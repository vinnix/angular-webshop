package Env::Heroku::Cloudinary;
use strict;
use warnings;
use URI;

sub import {
    my ($self) = @_;

    if (my $cloudinary_url = $ENV{CLOUDINARY_URL}) {
        $cloudinary_url =~ s/^\"//;
        $cloudinary_url =~ s/\"$//;
        if ( $cloudinary_url and $cloudinary_url =~ s/^cloudinary:// ) {
            my $url = URI->new( $cloudinary_url, 'http' );
            $ENV{CLOUDINARY_CLOUD} = $url->host;
            ($ENV{CLOUDINARY_API_KEY}, $ENV{CLOUDINARY_API_SECRET}) = split ':', $url->userinfo
                if $url->userinfo;
        }

        return 1;
    }
}

1;