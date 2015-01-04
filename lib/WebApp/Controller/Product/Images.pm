package WebApp::Controller::Product::Images;
use Moose;
use namespace::autoclean;
use utf8;
use JSON qw(encode_json decode_json from_json);
use Date::Parse;
use Data::Dumper;
use Scalar::Util qw(looks_like_number);
use boolean;

BEGIN { extends 'WebApp::Controller::Product::Base' }

sub images_base : Chained("stash_product") PathPart("images") CaptureArgs(0) {
}

sub index : Chained("images_base") PathPart("") Args(0) ActionClass("REST") {
}

sub index_GET {
    my ($self, $c) = @_;
    if ($c->stash->{product_id}) {

        my $productimages = $c->model("DB::Productimage")->search({
            product => $c->stash->{product_id},
        });

        my @images;
        for my $productimage ($productimages->all) {
            my $is_main = false;
            if ($productimage->image and $productimage->product and $productimage->product->main_image and $productimage->image->id == $productimage->product->main_image->id) {
                $is_main = true;
            }
            push @images, {
                id => $productimage->image->id,
                link => $productimage->image->link,
                is_main => $is_main,
                cloudinary => {
                    public_id => $productimage->image->cloudinary_public_id,
                    cloud_name => $productimage->image->cloudinary_cloud_name,
                },
            }
        }

        if (@images) {
            $self->status_ok( $c, entity => {
                images => \@images,
            });
        } else {
            $self->status_not_found($c, message => "images not found");
        }
    } else {
        $self->status_not_found($c, message => "product not found");
    }
}

sub index_POST {
    my ($self, $c) = @_;
    my $params ||= $c->req->data || $c->req->params;
    if ($c->stash->{product_id}) {
        if ($params->{newimage} and my $image = $c->model("DB::Image")->find($params->{newimage})) {
            my $productimage = $c->model("DB::Productimage")->find_or_create({
                product => $c->stash->{product_id},
                image => $image->id,
            });

            if ($productimage) {
                $self->status_ok( $c, entity => {
                    id => $productimage->image->id,
                    link => $productimage->image->link,
                    is_main => false,
                    cloudinary => {
                        public_id => $productimage->image->cloudinary_public_id,
                        cloud_name => $productimage->image->cloudinary_cloud_name,
                    },
                });
            } else {
                $self->status_not_found($c, message => "image linking to product failed");
            }
        } else {
            $self->status_not_found($c, message => "link to image not found");
        }
    } else {
        $self->status_not_found($c, message => "product not found");
    }
}

sub stash_images : Chained("images_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    if (looks_like_number($id) and my $image = $c->model("DB::Image")->find($id)) {
        $c->stash->{image_id} = $image->id;
    } else {
        $self->status_not_found($c, message => "image not found");
    }
}

sub images : Chained("stash_images") PathPart("") Args(0) ActionClass("REST") {
}

sub images_GET {
    my ($self, $c) = @_;

    if ($c->stash->{product_id} and $c->stash->{image_id}) {
        my $productimage = $c->model("DB::Productimage")->search({
            product => $c->stash->{product_id},
            image => $c->stash->{image_id},
        })->first;

        if ($productimage) {
            my $is_main = false;
            if ($productimage->image->id == $productimage->product->main_image->id) {
                $is_main = true;
            }
            $self->status_ok( $c, entity => {
                id => $productimage->image->id,
                link => $productimage->image->link,
                is_main => $is_main,
                cloudinary => {
                    public_id => $productimage->image->cloudinary_public_id,
                    cloud_name => $productimage->image->cloudinary_cloud_name,
                },
            });            
        } else {
            $self->status_not_found($c, message => "image not found");
        }
    } else {
        $self->status_not_found($c, message => "image not found");
    }
}

sub images_POST {
    my ($self, $c) = @_;

    if ($c->stash->{product_id} and $c->stash->{image_id}) {
        my $productimage = $c->model("DB::Productimage")->search({
            product => $c->stash->{product_id},
            image => $c->stash->{image_id},
        })->first;

        if ($productimage) {
            my $product = $c->model("DB::Product")->find($productimage->product->id);
            if ($product->update({ main_image => $productimage->image->id })) {
                my $is_main = true;
                $self->status_ok( $c, entity => {
                    id => $productimage->image->id,
                    link => $productimage->image->link,
                    is_main => $is_main,
                    cloudinary => {
                        public_id => $productimage->image->cloudinary_public_id,
                        cloud_name => $productimage->image->cloudinary_cloud_name,
                    },
                });            
            } else {
                $self->status_not_found($c, message => "setting main image failed");
            }
        } else {
            $self->status_not_found($c, message => "image not found");
        }
    } else {
        $self->status_not_found($c, message => "image not found");
    }
}

sub images_DELETE {
    my ($self, $c) = @_;

    if ($c->stash->{product_id} and $c->stash->{image_id}) {
        my $productimage = $c->model("DB::Productimage")->search({
            product => $c->stash->{product_id},
            image => $c->stash->{image_id},
        })->first;

        if ($productimage->delete) {
            $self->status_ok( $c, entity => {
                message => 'OK',
            });
        } else {
            $self->status_not_found($c, message => "image not found");
        }
    } else {
        $self->status_not_found($c, message => "image not found");
    }
}

__PACKAGE__->meta->make_immutable;

1;