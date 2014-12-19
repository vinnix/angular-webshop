package WebApp::Controller::Product::Categories;
use Moose;
use namespace::autoclean;
use utf8;
use JSON qw(encode_json decode_json from_json);
use Date::Parse;
use Data::Dumper;
use Scalar::Util qw(looks_like_number);
use boolean;

BEGIN { extends 'WebApp::Controller::Product::Base' }

sub categories_base : Chained("stash_product") PathPart("categories") CaptureArgs(0) {
}

sub index : Chained("categories_base") PathPart("") Args(0) ActionClass("REST") {
}

sub index_GET {
    my ($self, $c) = @_;
    if ($c->stash->{product_id}) {

        my $productcategories = $c->model("DB::Productcategory")->search({
            product => $c->stash->{product_id},
        });

        my @categories;
        for my $productcategory ($productcategories->all) {
            push @categories, {
                id => $productcategory->category->id,
                title => $productcategory->category->title,
            }
        }

        if (@categories) {
            $self->status_ok( $c, entity => {
                categories => \@categories,
            });
        } else {
            $self->status_not_found($c, message => "categories not found");
        }
    } else {
        $self->status_not_found($c, message => "product not found");
    }
}

sub index_POST {
    my ($self, $c) = @_;
    my $params ||= $c->req->data || $c->req->params;
    if ($c->stash->{product_id}) {
        if ($params->{newcategory} and my $category = $c->model("DB::Category")->find($params->{newcategory})) {
            my $productcategory = $c->model("DB::Productcategory")->find_or_create({
                product => $c->stash->{product_id},
                category => $category->id,
            });

            if ($productcategory) {
                $self->status_ok( $c, entity => {
                    id => $productcategory->category->id,
                    title => $productcategory->category->title,
                });
            } else {
                $self->status_not_found($c, message => "category linking to product failed");
            }
        } else {
            $self->status_not_found($c, message => "link to category not found");
        }
    } else {
        $self->status_not_found($c, message => "product not found");
    }
}

sub stash_categories : Chained("categories_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    if (looks_like_number($id) and my $category = $c->model("DB::Category")->find($id)) {
        $c->stash->{category_id} = $category->id;
    } else {
        $self->status_not_found($c, message => "category not found");
    }
}

sub categories : Chained("stash_categories") PathPart("") Args(0) ActionClass("REST") {
}

sub categories_GET {
    my ($self, $c) = @_;

    if ($c->stash->{product_id} and $c->stash->{category_id}) {
        my $productcategory = $c->model("DB::Productcategory")->search({
            product => $c->stash->{product_id},
            category => $c->stash->{category_id},
        })->first;

        if ($productcategory) {
            $self->status_ok( $c, entity => {
                id => $productcategory->category->id,
                title => $productcategory->category->title,
            });
        } else {
            $self->status_not_found($c, message => "category not found");
        }
    } else {
        $self->status_not_found($c, message => "category not found");
    }
}

sub categories_DELETE {
    my ($self, $c) = @_;

    if ($c->stash->{product_id} and $c->stash->{category_id}) {
        my $productcategory = $c->model("DB::Productcategory")->search({
            product => $c->stash->{product_id},
            category => $c->stash->{category_id},
        })->first;

        if ($productcategory->delete) {
            $self->status_ok( $c, entity => {
                message => 'OK',
            });
        } else {
            $self->status_not_found($c, message => "category not found");
        }
    } else {
        $self->status_not_found($c, message => "category not found");
    }
}

__PACKAGE__->meta->make_immutable;

1;