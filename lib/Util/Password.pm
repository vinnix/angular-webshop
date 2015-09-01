package Util::Password;
use Moose;
use namespace::autoclean;
use WebApp;
use Digest;
use Data::Dumper;

sub calculate_password {
    my ($self, $c, $plain) = @_;

    my $hashed = Digest->new($c->config->{'Plugin::Authentication'}
        ->{'siteuser'}->{'credential'}
        ->{'password_hash_type'});
   
    $hashed->add($c->config->{'Plugin::Authentication'}
        ->{'siteuser'}->{'credential'}
        ->{'password_pre_salt'})
        ->add($plain)
        ->add($c->config->{'Plugin::Authentication'}
        ->{'siteuser'}->{'credential'}
        ->{'password_post_salt'});

   return $hashed->b64digest;      
}

1;