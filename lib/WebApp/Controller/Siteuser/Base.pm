package WebApp::Controller::Siteuser::Base;
use Moose;
use namespace::autoclean;
use utf8;
use JSON qw(encode_json decode_json from_json);
use Scalar::Util qw(looks_like_number);
use DateTime;
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::Root' }

sub siteuser_base : Chained("base") PathPart("siteuser") CaptureArgs(0) {
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
        my @data;
        for my $siteuser ($siteusers->all) {
            push @data, {
                id          => $siteuser->id,
                username    => $siteuser->username
            };
        }
        $self->status_ok( $c, entity => { siteusers => \@data } );
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub index_POST {
    my ($self, $c) = @_; 
    my $data ||= $c->req->data || $c->req->params;

    if ($c->check_user_roles("admin")) {
        if ($data) {
            my $siteuser = $c->model('DB::Siteuser')->create({
                'username' => $data->{username},
                'first_name' => $data->{first_name},
                'last_name' => $data->{last_name},
                'email' => $data->{email},
            });
            if ($data->{password1} and $data->{password2} and $data->{password1} eq $data->{password2} and $data->{password1} ne '') {
                $siteuser = $siteuser->update({
                    'password' => $data->{password1},
                });
            }
            $self->status_ok( $c, entity => {
                id => $siteuser->id,
                username => $siteuser->username,
                email => $siteuser->email,
                first_name => $siteuser->first_name,
                last_name => $siteuser->last_name,
                siteuser_roles => undef,
                roles => $c->stash->{roles}
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
    if (my $siteuser = $c->model('DB::Siteuser')->find($id)) {
        $c->stash->{siteuser_id} = $siteuser->id;
    }
}

sub siteuser : Chained("stash_siteuser") PathPart("") Args(0) ActionClass("REST") {
}

sub siteuser_GET {
    my ($self, $c) = @_;    
    if ($c->check_user_roles("admin")) {
        if ($c->stash->{siteuser_id} > 0) {
            my $siteuser = $c->model('DB::Siteuser')->find($c->stash->{siteuser_id});

            my @siteuser_roles;
            if (my $res = $c->model('DB::SiteuserRole')->search({ siteuser => $c->stash->{siteuser_id} })) {
                while (my $siteuser_role = $res->next) {
                    push @siteuser_roles, $siteuser_role->role->id;
                }
            }

            $self->status_ok( $c, entity => {
                id => $siteuser->id ,
                username => $siteuser->username ,
                email => $siteuser->email ,
                first_name => $siteuser->first_name ,
                last_name => $siteuser->last_name ,
                siteuser_roles => \@siteuser_roles,
                roles => $c->stash->{roles}
            });
        } else {
            $self->status_not_found($c, message => "siteuser not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub siteuser_POST {
    my ($self, $c) = @_;
    my $data ||= $c->req->data || $c->req->params;

    if ($c->check_user_roles("admin")) {
        if ($data) {
            if (my $siteuser = $c->model('DB::Siteuser')->find($c->stash->{siteuser_id})) {
                $siteuser = $siteuser->update({
                    'username' => $data->{username},
                    'first_name' => $data->{first_name},
                    'last_name' => $data->{last_name},
                    'email' => $data->{email},
                });

                if ($data->{password1} and $data->{password2} and $data->{password1} eq $data->{password2} and $data->{password1} ne '') {
                    $siteuser = $siteuser->update({
                        'password' => $data->{password1},
                    });
                }

                $c->model('DB::SiteuserRole')->search({ siteuser => $c->stash->{siteuser_id} })->delete;
                foreach (@{$data->{siteuser_roles}}) {
                    $c->model('DB::SiteuserRole')->create({
                        'siteuser' => $c->stash->{siteuser_id},
                        'role' => $_,
                    });
                }

                $self->status_ok( $c, entity => {
                    id => $siteuser->id ,
                    username => $siteuser->username ,
                    email => $siteuser->email ,
                    first_name => $siteuser->first_name ,
                    last_name => $siteuser->last_name ,
                    siteuser_roles => $data->{siteuser_roles},
                    roles => $c->stash->{roles}
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
        if ($c->stash->{siteuser_id} ne $c->user->id()) {
            if (my $siteuser = $c->model('DB::Siteuser')->find($c->stash->{siteuser_id})) {
                $siteuser->delete();
                $self->status_ok( $c, entity => { result => 'ok' } );
            } else {
                $self->status_not_found($c, message => "not found");
            }
        } else {
            $self->status_not_found($c, message => "cannot delete oneself");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

__PACKAGE__->meta->make_immutable;

1;