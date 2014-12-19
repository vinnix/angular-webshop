package WebApp::Controller::Root;
use Moose;
use namespace::autoclean;

BEGIN { extends 'Catalyst::Controller::REST' }

__PACKAGE__->config(
    namespace => '',
    default => 'application/json',
    map => { 'application/javascript' => 'JSONP' },
);

sub base : Chained("/") PathPart("") CaptureArgs(0) {
}

sub index : Chained('base') PathPart('') Args(0) ActionClass('REST') {
}

sub index_GET {
    my ($self, $c) = @_;
    $self->status_ok( $c, entity => {
        message => 'OK',
    });
}

__PACKAGE__->meta->make_immutable;

1;
