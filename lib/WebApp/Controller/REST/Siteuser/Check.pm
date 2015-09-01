package WebApp::Controller::REST::Siteuser::Check;
use Moose;
use namespace::autoclean;

BEGIN { extends 'WebApp::Controller::REST::Siteuser::Base' }

sub siteuser_check_base : Chained("stash_siteuser") PathPart("check") CaptureArgs(0) {
}

__PACKAGE__->meta->make_immutable;

1;