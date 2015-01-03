package WebApp::Controller::Image::Base;
use Moose;
use namespace::autoclean;
use utf8;
use JSON qw(encode_json decode_json from_json);
use Date::Parse;
use Scalar::Util qw(looks_like_number);
use Imager;
use Cloudinary;
use Mojo::IOLoop::Delay;
use Digest::SHA qw( sha256_hex );
use LWP::UserAgent;
use Math::Round;
use Scalar::Util qw(looks_like_number);
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::Root' }

has 'cloudinary' => (is => 'ro', lazy => 1, builder => '_build_cloudinary');
has 'ua' => (is => 'ro', lazy => 1, builder => '_build_ua');

sub _build_cloudinary {
    my ($self) = @_;
    die "[FATAL ERROR] Cloudinary environment variables missing" unless (
            $ENV{CLOUDINARY_CLOUD} and
            $ENV{CLOUDINARY_API_KEY} and
            $ENV{CLOUDINARY_API_SECRET}
        );

    my $cloudinary = Cloudinary->new(
        cloud_name => $ENV{CLOUDINARY_CLOUD},
        api_key => $ENV{CLOUDINARY_API_KEY},
        api_secret => $ENV{CLOUDINARY_API_SECRET},
    );

    return $cloudinary;
}

sub _build_ua {
    my ($self) = @_;
    return LWP::UserAgent->new();
}

sub image_base : Chained("base") PathPart("image") CaptureArgs(0) {
}

sub index : Chained("image_base") PathPart("") ActionClass("REST") {
}

sub index_GET {
    my ($self, $c) = @_;

    # flow returns the following params (e.g. $params->{param}):
    # - flowChunkNumber => integer (num chunks)
    # - flowFilename => string (filename)
    # - flowChunkSize => integer (size of the chunk)
    # - flowTotalChunks => integer (total num of chunks)
    # - flowIdentifier => string (unique identifier, based on filename)
    # - flowRelativePath => string (filename + relative path)
    # - flowTotalSize => integer (total filesize)
    # - flowCurrentChunkSize => integer (size of current chunk)
    my $params ||= $c->req->data || $c->req->params;

    # Always return that the image is not found (this will force Flow to upload the actual image)
    $self->status_not_found($c, message => "image not found");
}

sub index_POST {
    my ($self, $c) = @_;

    my $image;
    my $tempfile;
    my $filename;
    my $params ||= $c->req->data || $c->req->params;

    if ($params->{src} and $params->{coords}) {
        # Get filename
        my (@temp) = split("/",$params->{src});
        $filename = $temp[-1];

        my $protocol = substr $params->{src}, 0, 2;
        if ($protocol eq '//') {
            $params->{src} = "http:".$params->{src};
        }
        my $response = $self->ua->get($params->{src});
        if ($response->is_success) {
            $image = Imager->new();
            $image->read( data => $response->decoded_content )
                or die "Cannot read image data: ", Imager->errstr;

            my $width = $image->getwidth;
            my $height = $image->getheight;
            my $ratio = $width / 160;

            $image = $image->crop(
                left => round($params->{coords}->[0] * $ratio),
                top => round($params->{coords}->[1] * $ratio),
                #right => $width - round($params->{coords}->[2] * $ratio),    # These are really not needed
                #bottom => $height - round($params->{coords}->[3] * $ratio),  # if width and height are set
                width => round($params->{coords}->[4] * $ratio),
                height => round($params->{coords}->[5] * $ratio),
            );
            (undef, $tempfile) = tempfile( SUFFIX => '.jpg' );
            $image->write( file => $tempfile, type => 'jpeg' )
                or die "Cannot write data: ", Imager->errstr;
        }
    } elsif (my $upload = $c->req->upload('file')) {

        $tempfile = $upload->tempname;
        $filename = $upload->filename;
    }

    if ($tempfile) {
        my $delay = Mojo::IOLoop::Delay->new;
        my $end = $delay->begin;

        my @tags;
        if ($params->{type}) {
            push @tags, $params->{type};
        }
        my $uploaded_image;
        $self->cloudinary->upload({
            file => { file => $tempfile },
            tags => @tags,
        }, sub {
            my ($cloudinary, $res) = @_;
            die "ERROR: ".$res->{error} if $res->{error};
            $uploaded_image = $c->model("DB::Image")->find_or_create({
                link => $res->{url},
                width => $res->{width},
                height => $res->{height},
                cloudinary_cloud_name => $ENV{CLOUDINARY_CLOUD},
                cloudinary_public_id => $res->{public_id},
            });
            $end->();
        });
        $delay->wait;

        $self->status_ok( $c, entity => {
            success => 'true',
            id => $uploaded_image->id,
            width => $uploaded_image->width,
            height => $uploaded_image->height,
            image_src => $uploaded_image->link,
            cloudinary => {
                public_id => $uploaded_image->cloudinary_public_id,
                cloud_name => $uploaded_image->cloudinary_cloud_name,
            },
        });
    } else {
        $self->status_not_found($c, message => "image not found");
    }
}

sub stash_image : Chained("image_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    if (looks_like_number($id)) {
        if (my $image = $c->model("DB::Image")->find($id)) {
            $c->stash->{image_id} = $image->id;
        }
    }
}

sub image : Chained("stash_image") PathPart("") ActionClass("REST") {
}

sub image_GET {
    my ($self, $c) = @_;
    if (my $image = $c->model("DB::Image")->find($c->stash->{image_id})) {
        $self->status_ok( $c, entity => {
            id => $image->id,
            link => $image->link,
            lastmodified => $image->lastmodified,
            etag => $image->etag,
            basename => $image->basename,
            alt => $image->alt,
            contenttype => $image->contenttype,
            contentlength => $image->contentlength+0,
            width => $image->width,
            height => $image->height,
            cloudinary => $image->cloudinary_public_id ? {
                public_id => $image->cloudinary_public_id,
                cloud_name => $image->cloudinary_cloud_name,
            } : undef,
        });
    } else {
        $self->status_not_found($c, message => "image not found");
    }
}

1;
