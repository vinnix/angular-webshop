package Util::Password;
use Moose;
use namespace::autoclean;
use WebApp;
use Crypt::SaltedHash;
use Data::Dumper;

sub calculate_password {
    my ($self, $c, $password) = @_;
    my $password_type = $c->config->{'Plugin::Authentication'}
        ->{'siteuser'}->{'credential'}
        ->{'password_type'};

    my $password_salt_len = $c->config->{'Plugin::Authentication'}
        ->{'siteuser'}->{'credential'}
        ->{'password_salt_len'} || 0;

    print Dumper $password_type;

    if ($password_type and $password_type eq 'salted_hash') {
        my $csh = Crypt::SaltedHash->new(
            algorithm => 'SHA-512',
            salt_len => $password_salt_len,
        );
        $csh->add($password);
        return $csh->generate;
    } else {
        return $password;
    }
}

sub validate_password {
    my ($self, $c, $password, $stored_password) = @_;
    my $password_type = $c->config->{'Plugin::Authentication'}
        ->{'siteuser'}->{'credential'}
        ->{'password_type'};

    my $password_salt_len = $c->config->{'Plugin::Authentication'}
        ->{'siteuser'}->{'credential'}
        ->{'password_salt_len'} || 0;

    if ($password_type and $password_type eq 'salted_hash') {
        return Crypt::SaltedHash->validate($stored_password, $password, $password_salt_len);
    } else {
        return $password eq $stored_password;
    }
}


1;