package WebApp::Controller::REST::Setting::Base;
use Moose;
use namespace::autoclean;
use utf8;
use Util::Password;
use JSON qw(encode_json decode_json from_json);
use Scalar::Util qw(looks_like_number);
use DateTime;
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::REST::Root' }

sub setting_base : Chained("rest_base") PathPart("setting") CaptureArgs(0) {
    my ($self, $c) = @_;    

    my @roles;
    for my $role ($c->model('DB::Role')->all) {
        push @roles, {
            id => $role->id,
            text => $role->name,
        };
    }
    $c->stash->{roles} = \@roles;
}

sub index : Chained('setting_base') PathPart('') Args(0) ActionClass('REST') {
}

sub index_GET {
    my ($self, $c) = @_;
    if (my $siteuser = $c->model('DB::Siteuser')->find($c->user->id)) {
        $self->status_ok( $c, entity => {
            id => $siteuser->id,
            name => $siteuser->username,
        } );
    } else {
        $self->status_not_found($c, message => "user not found");
    }
}

sub index_PUT {
    my ($self, $c) = @_; 
    my $params ||= $c->req->data || $c->req->params;
    if (my $siteuser = $c->model('DB::Siteuser')->find($c->user->id)) {
        if ($params) {
            my $password = Util::Password->new;
            if (
                $params->{oldpassword}
                and $siteuser->password
                and $password->calculate_password($c, $params->{oldpassword}) eq $siteuser->password
                and $params->{newpassword1}
                and $params->{newpassword2}
                and $params->{newpassword1} eq $params->{newpassword2}
                and $params->{newpassword1} ne ''
            ) {
                $siteuser = $siteuser->update({
                    'password' => $password->calculate_password($c, $params->{newpassword1}),
                });
                $self->status_ok( $c, entity => {
                    id => $siteuser->id,
                    name => $siteuser->username,
                } );
            } else {
                $self->status_not_found($c, message => "password change failed");
            }
        } else {
            $self->status_not_found($c, message => "invalid parameters");
        }
    } else {
        $self->status_not_found($c, message => "user not found");
    }
}

__PACKAGE__->meta->make_immutable;

1;