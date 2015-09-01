use strict;
use warnings;
use utf8;
use lib 'lib';
use Env::Heroku::Cloudinary;
use Env::Heroku::Pg;
use Env::Heroku::Rediscloud;
use WebApp;
use Plack::Builder;
use Plack::Response;
use Plack::Middleware::Static;
use Text::Xslate;
use Encode qw(encode_utf8);
use Data::Dumper;

my $spa = sub { my ($root,$base) = @_; builder {
    if ( -d $root . "/build") {
        $root = $root . "/build";
    } else {
        $root = $root . "/bin";
    }
    enable 'Head'; enable 'ConditionalGET'; enable 'HTTPExceptions';
    enable 'Static', path => sub{1}, root => $root, pass_through => 1;
    enable_if { $_[0]->{PATH_INFO} } sub { my $app = shift; sub { my $env = shift;
        my $tx = Text::Xslate->new( path => $root );
        my $res = Plack::Response->new( 200, [content_type => 'text/html;charset=utf-8'] );
        $res->body( encode_utf8( $tx->render( 'index.html', { base => $base } ) ) );
        return $res->finalize;
    }};
    sub { [ 301, [ Location => $base ], [] ] };
}};

builder {
    enable 'ReverseProxy';

    # Everything except /assets and /preview should not be cached
    enable_if { $_[0]->{PATH_INFO} !~ m{^/assets|^/preview} }
        'Header', set => [
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

    # Extra security (BasicAuth), if needed
    enable_if { $ENV{AUTH_USERNAME} }
        'Auth::Basic', authenticator => sub {
        my ($username,$password) = @_;
        return  ( $ENV{AUTH_USERNAME} && $username eq $ENV{AUTH_USERNAME} and
                ! $ENV{AUTH_PASSWORD} || $password eq $ENV{AUTH_PASSWORD} );
    };

    mount '/assets' => Plack::App::File->new(root => "assets")->to_app;
    mount '/admin' => $spa->('admin','/admin/');
    mount '/' => $app;
}
