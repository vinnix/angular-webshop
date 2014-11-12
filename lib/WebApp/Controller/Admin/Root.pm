package WebApp::Controller::Admin::Root;
use Moose;
use Data::Dumper;

BEGIN { extends 'Catalyst::Controller' }

sub base : Chained("/") PathPart("admin") CaptureArgs(0) {
}

sub assets : Chained('base') PathPart('assets') CaptureArgs() {
    my ( $self, $c, @filepath ) = @_;
    my $buildhtml = 'root/admin/build/index.html';
    my $binhtml = 'root/admin/bin/index.html';
    my $buildfile =  "root/admin/build/assets/".join('/',@filepath);
    my $binfile =  "root/admin/bin/assets/".join('/',@filepath);
    if (-e $buildhtml and -e $buildfile and scalar @filepath > 0) {
        $c->serve_static_file($buildfile);
    } elsif (-e $binhtml and -e $binfile and scalar @filepath > 0) {
        $c->serve_static_file($binfile);
    } else {
        $c->response->body( 'Page not found' );
        $c->response->status(404);
    }
}

sub vendor : Chained('base') PathPart('vendor') CaptureArgs() {
    my ( $self, $c, @filepath ) = @_;
    my $buildhtml = 'root/admin/build/index.html';
    my $buildfile =  "root/admin/build/vendor/".join('/',@filepath);
    if (-e $buildhtml and -e $buildfile and scalar @filepath > 0) {
        $c->serve_static_file($buildfile);
    } else {
        $c->response->body( 'Page not found' );
        $c->response->status(404);
    }
}

sub src : Chained('base') PathPart('src') CaptureArgs() {
    my ( $self, $c, @filepath ) = @_;
    my $buildhtml = 'root/admin/build/index.html';
    my $buildfile =  "root/admin/build/src/".join('/',@filepath);
    if (-e $buildhtml and -e $buildfile and scalar @filepath > 0) {
        $c->serve_static_file($buildfile);
    } else {
        $c->response->body( 'Page not found' );
        $c->response->status(404);
    }
}

sub default : Chained('base') PathPart('') CaptureArgs() {
    my ( $self, $c, @filepath ) = @_;
    my $buildhtml = 'root/admin/build/index.html';
    my $binhtml = 'root/admin/bin/index.html';
    
    my ( $filetype, $filename );
    if (scalar @filepath > 0) {
        $filetype = substr $filepath[0], -3;
        $filename = 'root/admin/build/'.$filepath[0];
    }

    if (-e $buildhtml and $filetype eq '.js') {
        if (-e $filename) {
            $c->serve_static_file($filename);
        } else {
            $c->response->body( 'Page not found' );
            $c->response->status(404);
        }
    } elsif (-e $buildhtml) {
        $c->serve_static_file($buildhtml);
    } elsif (-e $binhtml) {
        $c->serve_static_file($binhtml);
    } else {
        $c->response->body( 'Page not found' );
        $c->response->status(404);
    }
}

__PACKAGE__->meta->make_immutable;

1;
