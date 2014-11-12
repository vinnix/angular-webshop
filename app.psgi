use strict;
use warnings;
use lib './lib';
use Webshop::HerokuConfig;
use WebApp;
use Plack::Builder;
use Plack::Response;
use Plack::App::Proxy;
use Plack::Middleware::Header;

my $app = WebApp->apply_default_middlewares(WebApp->psgi_app);

builder {
    enable 'ReverseProxy';
    enable 'ConditionalGET';

    enable_if { $_[0]->{PATH_INFO} =~ m{^/(rest)(_[^/]+)?/} }
        'Header', set => [
            'Cache-Control' => 'public,max-age=604800',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET',
            'Access-Control-Max-Age' => '1000',
            'Content-Type' => 'application/json; charset=utf-8'
        ];

    enable 'ErrorDocument',
        404 => 'root/assets/html/404.html',
        500 => 'root/assets/html/500.html';

    $app;
}
