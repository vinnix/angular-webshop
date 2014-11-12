package WebApp;
use Moose;
use namespace::autoclean;

use Catalyst::Runtime;

use Catalyst qw/
    ConfigLoader
    Static::Simple
    Authentication
    Authorization::ACL
    Authorization::Roles
    Session
    Session::Store::DBIC
    Session::State::Cookie
/;

extends 'Catalyst';

our $VERSION = '0.01';

# Start the application
__PACKAGE__->setup();

1;
