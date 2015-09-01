package WebApp::Controller::REST::Root;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller::REST' }

__PACKAGE__->config(
    default => 'application/json',
    map => { 'application/javascript' => 'JSONP' },
);

sub rest_base : Chained("/") PathPart("rest") CaptureArgs(0) {
}

sub index : Chained('rest_base') PathPart('') Args(0) ActionClass('REST') {
}

sub index_GET {
    my ($self, $c) = @_;
    $self->status_ok( $c, entity => {
        message => 'OK',
    });
}

__PACKAGE__->meta->make_immutable;

1;
