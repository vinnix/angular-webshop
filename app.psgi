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

my $app = WebApp->apply_default_middlewares(WebApp->psgi_app);

my $spa = sub { my ($root,$base) = @_; builder {
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

    enable "Plack::Middleware::Static",
        path => qr{^/common/}, root => 'root/';

    enable 'ErrorDocument',
        404 => 'root/common/html/404.html',
        500 => 'root/common/html/500.html';

    mount '/rest' => $app;
    mount '/admin/build' => $spa->('root/admin/build','/admin/build/');
    mount '/admin' => $spa->('root/admin/bin','/admin/');
    mount '/build' => $spa->('root/app/build','/build/');
    mount '/' => $spa->('root/app/bin','/');
}
