package WebApp::Controller::Product::Base;
use Moose;
use namespace::autoclean;
use utf8;
use JSON qw(encode_json decode_json from_json);
use Date::Parse;
use Scalar::Util qw(looks_like_number);
use Data::Dumper;
use Text::Unidecode;
use DateTime;
use DateTime::Format::Pg;
use Time::HiRes;

BEGIN { extends 'WebApp::Controller::Root' }

sub create_slug {
    my ($product) = @_;
    my $slug = lc $product->title;
    $slug = unidecode($slug);
    $slug =~ s/[^a-z0-9\s]//g;
    $slug =~ s/\s+/-/g;

    my $created_slug;
    my $index = 0;
    until ($created_slug and $index < 100) {
        my $slug_tmp;
        if ($index > 0) {
            $slug_tmp = $slug . "-" . $index;
        } else {
            $slug_tmp = $slug;
        }
        my $prospect = WebApp->model("DB::Product")->search({
            id => { '!=' => $product->id },
            slug => $slug_tmp,
        });
        if (!$prospect->first) {
            $created_slug = $product->update({
                slug => $slug_tmp,
            });
        } else {
            $index++;
        }
    }
    return $created_slug;
}

sub product_base : Chained("base") PathPart("product") CaptureArgs(0) {
}

sub index : Chained("product_base") PathPart("") ActionClass("REST") {
}

sub index_GET {
    my ($self, $c) = @_;
    my @products_data;
    for my $product ($c->model("DB::Product")->all) {
        push @products_data, {
            id => $product->id,
            title => $product->title,
            updated => $product->updated ? $product->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z') : undef,
            hidden => $product->hidden,
        };
    }
    $self->status_ok( $c, entity => {
        products => \@products_data,
    });
}

sub index_POST {
    my ($self, $c) = @_;
    my $params ||= $c->req->data || $c->req->params;
    if (length $params->{title} > 1) {
        my $current_time = DateTime->now->set_time_zone('Europe/Helsinki');

        my $product = $c->model("DB::Product")->create({
            title => $params->{title},
            created => DateTime::Format::Pg->format_datetime($current_time),
            updated => DateTime::Format::Pg->format_datetime($current_time),
            hidden => 1,
        });

        $product = create_slug($product);

        $self->status_ok( $c, entity => {
            id => $product->id,
            slug => $product->slug,
            title => $product->title,
            description => $product->description,
            created => $product->created ? $product->created->strftime('%Y-%m-%dT%H:%M:%S.%6N%z') : undef,
            updated => $product->updated ? $product->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z') : undef,
            hidden => $product->hidden,
            main_image => $product->main_image ? $product->main_image->link : undef,
            hidden => $product->vat ? $product->vat->amount : undef,
            price => $product->price,
            discount => $product->discount,
            custom_image => $product->custom_image,
            custom_text => $product->custom_text,
        });
    } else {
        $self->status_not_found($c, message => "too short title");
    }
}

sub stash_product : Chained("product_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    if (looks_like_number($id)) {
        if (my $product = $c->model("DB::Product")->find($id)) {
            $c->stash->{product_id} = $product->id;
        } else {
            $self->status_not_found($c, message => "product not found");
        }
    } else {
        my $product = $c->model("DB::Product")->search({ slug => $id });
        if ($product->first) {
            $c->stash->{product_id} = $product->first->id;
        } else {
            $self->status_not_found($c, message => "product not found");
        }      
    }
}

sub product : Chained("stash_product") PathPart("") ActionClass("REST") {
}

sub product_GET {
    my ($self, $c) = @_;
    if ($c->stash->{product_id}) {
        if (my $product = $c->model("DB::Product")->find($c->stash->{product_id})) {
            $self->status_ok( $c, entity => {
                id => $product->id,
                slug => $product->slug,
                title => $product->title,
                description => $product->description,
                created => $product->created ? $product->created->strftime('%Y-%m-%dT%H:%M:%S.%6N%z') : undef,
                updated => $product->updated ? $product->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z') : undef,
                hidden => $product->hidden,
                main_image => $product->main_image ? $product->main_image->link : undef,
                hidden => $product->vat ? $product->vat->amount : undef,
                price => $product->price,
                discount => $product->discount,
                custom_image => $product->custom_image,
                custom_text => $product->custom_text,
            });
        } else {
            $self->status_not_found($c, message => "product not found");
        }
    } else {
        $self->status_not_found($c, message => "product not found");
    }
}

sub product_POST {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        my $params ||= $c->req->data || $c->req->params;
        if (my $product = $c->model("DB::Product")->find($c->stash->{product_id})) {

            my $current_time = DateTime->now->set_time_zone('Europe/Helsinki');
            $product->update({
                updated => DateTime::Format::Pg->format_datetime($current_time),
            });                    

            if ($params->{title}) {
                $product->update({
                    title => $params->{title},
                });                    
                $product = create_slug($product);
            }

            if ($params->{description}) {
                $product->update({
                    description => $params->{description},
                });                    
            }

            if ($params->{hidden}) {
                $product->update({
                    hidden => $params->{hidden},
                });                    
            }

            if ($params->{price}) {
                $product->update({
                    price => $params->{price},
                });                    
            }

            if ($params->{discount}) {
                $product->update({
                    discount => $params->{discount},
                });                    
            }

            if ($params->{custom_image}) {
                $product->update({
                    custom_image => $params->{custom_image},
                });                    
            }

            if ($params->{custom_text}) {
                $product->update({
                    custom_text => $params->{custom_text},
                });                    
            }

            $self->status_ok( $c, entity => {
                id => $product->id,
                slug => $product->slug,
                title => $product->title,
                description => $product->description,
                created => $product->created ? $product->created->strftime('%Y-%m-%dT%H:%M:%S.%6N%z') : undef,
                updated => $product->updated ? $product->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z') : undef,
                hidden => $product->hidden,
                main_image => $product->main_image ? $product->main_image->link : undef,
                hidden => $product->vat ? $product->vat->amount : undef,
                price => $product->price,
                discount => $product->discount,
                custom_image => $product->custom_image,
                custom_text => $product->custom_text,
            });
        } else {
            $self->status_not_found($c, message => "product not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub product_DELETE {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        if (my $product = $c->model("DB::Product")->find($c->stash->{product_id})) {
            if ($product->delete) {
                $self->status_ok( $c, entity => {
                    message => 'OK',
                });
            } else {
                $self->status_not_found($c, message => "delete failed");
            }
        } else {
            $self->status_not_found($c, message => "product not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

1;
