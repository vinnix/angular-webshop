package WebApp::Controller::REST::Siteuser::Base;
use Moose;
use namespace::autoclean;
use utf8;
use Util::Password;
use JSON qw(encode_json decode_json from_json);
use Scalar::Util qw(looks_like_number);
use DateTime;
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::REST::Root' }

sub siteuser_base : Chained("rest_base") PathPart("siteuser") CaptureArgs(0) {
}

sub index : Chained('siteuser_base') PathPart('') Args(0) ActionClass('REST') {
}

sub index_GET {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        my $siteusers = $c->model('DB::Siteuser')->search({
        },{
            order_by => [
                { '-ASC' => 'username' }
            ],
        });
        my @siteusers_data;
        for my $siteuser ($siteusers->all) {
            push @siteusers_data, {
                id => $siteuser->id,
                username => $siteuser->username,
                first_name => $siteuser->first_name,
                last_name => $siteuser->last_name,
            };
        }
        $self->status_ok( $c, entity => { siteusers => \@siteusers_data } );
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub index_POST {
    my ($self, $c) = @_;
    my $params ||= $c->req->data || $c->req->params;
    if ($c->check_user_roles("admin")) {
        if ($params) {
            my $siteuser = $c->model('DB::Siteuser')->create({
                username => $params->{username},
                first_name => $params->{first_name},
                last_name => $params->{last_name},
                email => $params->{email},
            });

            if ($params->{password1} and $params->{password2} and $params->{password1} eq $params->{password2} and $params->{password1} ne '') {
                my $password = Util::Password->new;
                $siteuser = $siteuser->update({
                    password => $password->calculate_password($c, $params->{password1}),
                });
            }

            foreach (@{$params->{roles}}) {
                $c->model('DB::SiteuserRole')->create({
                    siteuser => $siteuser->id,
                    role => $_,
                });
            }

            $self->status_ok( $c, entity => {
                id => $siteuser->id,
                username => $siteuser->username,
                email => $siteuser->email,
                first_name => $siteuser->first_name,
                last_name => $siteuser->last_name,
                roles => [ $siteuser->roles->get_column('id')->all ],
            });
        } else {
            $self->status_not_found($c, message => "invalid parameters");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub stash_siteuser : Chained("siteuser_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    if (looks_like_number($id)) {
        my $siteuser = $c->model('DB::Siteuser')->find($id);
        $c->stash->{siteuser} = $siteuser;
    }
}

sub siteuser : Chained("stash_siteuser") PathPart("") Args(0) ActionClass("REST") {
}

sub siteuser_GET {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        if (my $siteuser = $c->stash->{siteuser}) {
            $self->status_ok( $c, entity => {
                id => $siteuser->id ,
                username => $siteuser->username ,
                email => $siteuser->email ,
                first_name => $siteuser->first_name ,
                last_name => $siteuser->last_name ,
                roles => [ $siteuser->roles->get_column('id')->all ],
            });
        } else {
            $self->status_not_found($c, message => "siteuser not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub siteuser_PUT {
    my ($self, $c) = @_;
    my $params ||= $c->req->data || $c->req->params;
    if ($c->check_user_roles("admin")) {
        if ($params) {
            if (my $siteuser = $c->stash->{siteuser}) {
                $siteuser = $siteuser->update({
                    username => $params->{username},
                    first_name => $params->{first_name},
                    last_name => $params->{last_name},
                    email => $params->{email},
                });

                if ($params->{password1} and $params->{password2} and $params->{password1} eq $params->{password2} and $params->{password1} ne '') {
                    my $password = Util::Password->new;
                    $siteuser = $siteuser->update({
                        password => $password->calculate_password($c, $params->{password1}),
                    });
                }

                $c->model('DB::SiteuserRole')->search({ siteuser => $siteuser->id })->delete;
                foreach (@{$params->{roles}}) {
                    $c->model('DB::SiteuserRole')->create({
                        siteuser => $siteuser->id,
                        role => $_,
                    });
                }

                $self->status_ok( $c, entity => {
                    id => $siteuser->id ,
                    username => $siteuser->username ,
                    email => $siteuser->email ,
                    first_name => $siteuser->first_name ,
                    last_name => $siteuser->last_name ,
                    roles => [ $siteuser->roles->get_column('id')->all ],
                });
            } else {
                $self->status_not_found($c, message => "siteuser not found");
            }
        } else {
            $self->status_not_found($c, message => "invalid parameters");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub siteuser_DELETE {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        if (my $siteuser = $c->stash->{siteuser} ) {
            if ($siteuser->id ne $c->user->id()) {
                $siteuser->delete();
                $self->status_ok( $c, entity => { result => 'ok' } );
            } else {
                $self->status_not_found($c, message => "cannot delete oneself");
            }
        } else {
            $self->status_not_found($c, message => "not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

__PACKAGE__->meta->make_immutable;

1;