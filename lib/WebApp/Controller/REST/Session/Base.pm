package WebApp::Controller::REST::Session::Base;
use Moose;
use namespace::autoclean;
use utf8;
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::REST::Root' }

sub session_base : Chained("rest_base") PathPart("session") CaptureArgs(0) {
}

sub session : Chained("session_base") PathPart("") ActionClass("REST") {
}

sub session_GET {
    my ($self, $c) = @_;
    if ($c->user and $c->user > 0) {
        if (my $user = $c->model('DB::Siteuser')->find($c->user->id())) {
            $self->status_ok( $c, entity => {
                username => $user->username,
                session => $c->sessionid,
                roles => [ $c->user->roles() ],
            });
        } else {
            $self->status_not_found($c, message => "not found");
        }
    } else {
        $self->status_not_found($c, message => "not found");
    }
}

sub session_POST {
    my ($self, $c) = @_;
    if ($c->req->data and $c->req->data->{username} and $c->req->data->{password}) {
        if ($c->authenticate({ username => $c->req->data->{username}, password => $c->req->data->{password} })) {
            $self->status_ok( $c, entity => {
                username => $c->req->data->{username},
                session => $c->sessionid,
                roles => [ $c->user->roles() ],
            });
        } else {
            $self->status_not_found($c, message => "access denied");
        }
    } else {
        $self->status_not_found($c, message => "not found");
    }
}

sub session_DELETE {
    my ($self, $c) = @_;
    if ($c->user and $c->user > 0) {
        $c->logout();
        $c->delete_session('logout');
        $self->status_ok( $c, entity => { logout => "OK" } );
    } else {
        $self->status_not_found($c, message => "not found");
    }
}

__PACKAGE__->meta->make_immutable;

1;
