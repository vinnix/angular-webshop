package WebApp::Controller::Category::Position;
use Moose;
use namespace::autoclean;
use utf8;
use Data::Dumper;
use Scalar::Util qw(looks_like_number);

BEGIN { extends 'WebApp::Controller::Category::Base' }

sub position_base : Chained("stash_category") PathPart("position") CaptureArgs(0) {
}

sub stash_position : Chained("position_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $position) = @_;
    $c->stash->{position} = $position;
}

sub position : Chained("stash_position") PathPart("") ActionClass("REST") {
}

sub position_POST {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        if ($c->stash->{category_id} and $c->stash->{category_position} and $c->stash->{position} and ($c->stash->{category_position} != $c->stash->{position})) {

            my $min; my $max;
            if ($c->stash->{position} < $c->stash->{category_position}) {
                $min = $c->stash->{position};
                $max = $c->stash->{category_position};
            } else {
                $min = $c->stash->{category_position};
                $max = $c->stash->{position};
            }

            my $categories = $c->model("DB::Category")->search({
                position => {
                    -between => [
                        $min,
                        $max,
                    ],
                },
            },{
                order_by => [
                    { '-ASC' => 'position' },
                ],
                parent => $c->stash->{category_parent},
            });

            for my $category ($categories->all) {
                if ($category->id == $c->stash->{category_id}) {
                    $category->update({
                        position => $c->stash->{position},
                    });
                } elsif ($c->stash->{position} < $c->stash->{category_position}) {
                    my $position = $category->position + 1;
                    $category->update({
                        position => $position,
                    });
                } else {
                    my $position = $category->position - 1;
                    $category->update({
                        position => $position,
                    });
                }
            }

            $self->status_ok( $c, entity => {
                message => 'OK',
            });
        } else {
            $self->status_not_found($c, message => "category not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

__PACKAGE__->meta->make_immutable;

1;