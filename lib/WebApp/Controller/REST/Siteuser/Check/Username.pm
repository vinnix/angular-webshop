package WebApp::Controller::REST::Siteuser::Check::Username;
use Moose;
use namespace::autoclean;
use utf8;
use Data::Dumper;
use boolean;

BEGIN { extends 'WebApp::Controller::REST::Siteuser::Check' }

sub siteuser_check_username_base : Chained("siteuser_check_base") PathPart("username") CaptureArgs(0) {
}

sub stash_siteuser_check_username : Chained("siteuser_check_username_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $username) = @_;
    $c->stash->{username} = $username;
}

sub siteuser_check_username : Chained("stash_siteuser_check_username") PathPart("") Args(0) ActionClass("REST") {
}

sub siteuser_check_username_GET {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        my $prospect = $c->model("DB::Siteuser")->search({
            username => $c->stash->{username},
        });
        if (my $siteuser = $c->stash->{siteuser}) {
            $prospect = $prospect->search({
                id => { '!=' => $siteuser->id },
            });
        }
        my $exists;
        if ($prospect->count > 0) {
            $exists = true;
        } else {
            $exists = false;
        }
        $self->status_ok( $c, entity => { exists => $exists } );
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

__PACKAGE__->meta->make_immutable;

1;