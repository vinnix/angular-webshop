package WebApp::Controller::Image::Base;
use Moose;
use namespace::autoclean;
use utf8;
use JSON qw(encode_json decode_json from_json);
use Date::Parse;
use Scalar::Util qw(looks_like_number);
use Imager;
use Digest::SHA qw( sha256_hex );
use LWP::UserAgent;
use Math::Round;
use Scalar::Util qw(looks_like_number);
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::Root' }

has 'ua' => (is => 'ro', lazy => 1, builder => '_build_ua');

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
    my $image_data;
    my $filename;
    my $params ||= $c->req->data || $c->req->params;

    if ($params->{src} and $params->{coords}) {

        # Get filename
        my (@temp) = split("/",$params->{src});
        $filename = $temp[-1];
        print Dumper $filename;

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
            $image->write( data => \$image_data, type => 'jpeg' )
                or die "Cannot write data: ", Imager->errstr;
        }
    } elsif (my $upload = $c->req->upload('file')) {
        $image = Imager->new();
        $image->read( file => $upload->tempname )
            or die "Cannot read " . $upload->tempname . ": ", Imager->errstr;
        $image->write( data => \$image_data, type => 'jpeg' )
            or die "Cannot write data: ", Imager->errstr;
        $filename = $upload->filename;
    }

    if ($image_data) {
        my $image_id = sha256_hex($filename);

        # TODO, need to upload image to somewhere

        my $created_image = $c->model("DB::Image")->find_or_create({
            link => $image_id . ".jpeg",
            width => $image->getwidth,
            height => $image->getheight,
        });
        $self->status_ok( $c, entity => {
            id => $created_image->id,
            link => $created_image->link,
            width => $created_image->width,
            height => $created_image->height,
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
            width => $image->width,
            height => $image->height,
        });
    } else {
        $self->status_not_found($c, message => "image not found");
    }
}

1;
