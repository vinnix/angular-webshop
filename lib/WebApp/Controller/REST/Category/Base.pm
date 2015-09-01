package WebApp::Controller::REST::Category::Base;
use Moose;
use namespace::autoclean;
use utf8;
use JSON qw(encode_json decode_json from_json);
use Date::Parse;
use Scalar::Util qw(looks_like_number);
use Data::Dumper;
use Text::Unidecode;

BEGIN { extends 'WebApp::Controller::REST::Root' }

sub create_slug {
    my ($self, $str) = @_;
    return unless $str;
    my $slug = lc $str;
    $slug =~ s/[^a-z0-9\s]//g;
    $slug =~ s/\s+/-/g;
    return $slug;
}

sub category_base : Chained("rest_base") PathPart("category") CaptureArgs(0) {
}

sub index : Chained("category_base") PathPart("") ActionClass("REST") {
}

sub index_GET {
    my ($self, $c) = @_;
    my @categories_data;
    for my $category ($c->model("DB::Category")->all) {
        push @categories_data, {
            id => $category->id,
            slug => $category->slug,
            title => $category->title,
            description => $category->description,
            position => $category->position,
            hidden => $category->hidden,
        };
    }
    $self->status_ok( $c, entity => { categories => \@categories_data } );
}

sub index_POST {
    my ($self, $c) = @_;
    my $params ||= $c->req->data || $c->req->params;
    if ($c->check_user_roles("admin")) {
        my $maxpos = $c->model("DB::Category")->search({
        },{
            order_by => [
                { '-DESC' => 'position' },
            ],
        });

        my $position = 1;
        if ($maxpos->first) {
            $position = $maxpos->first->position + 1;
        }

        my $category = $c->model("DB::Category")->create({
            slug => $self->create_slug($params->{title}),
            title => $params->{title},
            position => $position,
            hidden => 1,
        });

        $self->status_ok( $c, entity => {
            id => $category->id,
            slug => $category->slug,
            title => $category->title,
            description => $category->description,
            position => $category->position,
            hidden => $category->hidden,
        });
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub stash_category : Chained("category_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    if (looks_like_number($id)) {
        if (my $category = $c->model("DB::Category")->find($id)) {
            $c->stash->{category_id} = $category->id;
            $c->stash->{category_position} = $category->position;
        } else {
            $self->status_not_found($c, message => "category not found");
        }
    }
}

sub category : Chained("stash_category") PathPart("") ActionClass("REST") {
}

sub category_GET {
    my ($self, $c) = @_;
    if ($c->stash->{category_id}) {
        if (my $category = $c->model("DB::Category")->find($c->stash->{category_id})) {
            $self->status_ok( $c, entity => {
                id => $category->id,
                slug => $category->slug,
                title => $category->title,
                description => $category->description,
                position => $category->position,
                hidden => $category->hidden,
            });
        } else {
            $self->status_not_found($c, message => "category not found");
        }
    } else {
        $self->status_not_found($c, message => "category not found");
    }
}

sub category_POST {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        my $params ||= $c->req->data || $c->req->params;
        if (my $category = $c->model("DB::Category")->find($c->stash->{category_id})) {
            if ($params->{title}) {
                $category->update({
                    slug => $self->create_slug($params->{title}),
                    title => $params->{title},
                });
            }

            if ($params->{description}) {
                $category->update({
                    description => $params->{description},
                });
            }

            if ($params->{hidden}) {
                $category->update({
                    hidden => $params->{hidden},
                });
            }

            $self->status_ok( $c, entity => {
                id => $category->id,
                slug => $category->slug,
                title => $category->title,
                description => $category->description,
                position => $category->position,
                hidden => $category->hidden,
            });
        } else {
            $self->status_not_found($c, message => "category not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub category_DELETE {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        if (my $category = $c->model("DB::Category")->find($c->stash->{category_id})) {
            my $deleted_position = $category->position;
            if ($category->delete) {

                my $categories = $c->model("DB::Category")->search({
                    position => { '>' => $deleted_position },
                },{
                    order_by => [
                        { '-ASC' => 'position' },
                    ],
                });

                for my $category ($categories->all) {
                    my $position = $category->position - 1;
                    $category->update({
                        position => $position,
                    });
                }

                $self->status_ok( $c, entity => {
                    message => 'OK',
                });
            } else {
                $self->status_not_found($c, message => "delete failed");
            }
        } else {
            $self->status_not_found($c, message => "category not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

1;
