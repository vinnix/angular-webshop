package WebApp::Controller::REST::Role::Base;
use Moose;
use namespace::autoclean;
use utf8;
use Util::Password;
use JSON qw(encode_json decode_json from_json);
use Scalar::Util qw(looks_like_number);
use DateTime;
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::REST::Root' }

sub role_base : Chained("rest_base") PathPart("role") CaptureArgs(0) {
}

sub index : Chained('role_base') PathPart('') Args(0) ActionClass('REST') {
}

sub index_GET {
    my ($self, $c) = @_;
    my @roles;
    for my $role ($c->model('DB::Role')->all) {
        push @roles, {
            id => $role->id,
            name => $role->name,
        };
    }
    $self->status_ok( $c, entity => { roles => \@roles } );
}

__PACKAGE__->meta->make_immutable;

1;