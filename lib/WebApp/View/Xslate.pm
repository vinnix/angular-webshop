package WebApp::View::Xslate;
use Moose;
use Text::Xslate;

extends 'Catalyst::View::Xslate';

has '+module' => (
    default => sub { [ 'Text::Xslate::Bridge::Star' ] }
);

__PACKAGE__->meta->make_immutable;

1;
