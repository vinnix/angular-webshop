package WebApp::Controller::REST::Siteuser::Check::Email;
use Moose;
use namespace::autoclean;
use utf8;
use Data::Dumper;
use boolean;

BEGIN { extends 'WebApp::Controller::REST::Siteuser::Check' }

sub siteuser_check_email_base : Chained("siteuser_check_base") PathPart("email") CaptureArgs(0) {
}

sub stash_siteuser_check_email : Chained("siteuser_check_email_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $email) = @_;
    $c->stash->{email} = $email;
}

sub siteuser_check_email : Chained("stash_siteuser_check_email") PathPart("") Args(0) ActionClass("REST") {
}

sub siteuser_check_email_GET {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        my $prospect = $c->model("DB::Siteuser")->search({
            email => $c->stash->{email},
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