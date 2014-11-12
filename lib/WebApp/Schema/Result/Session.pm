package WebApp::Schema::Result::Session;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("session");

__PACKAGE__->add_columns(
    "id",
    { data_type => "char", size => 72 },
    "session_data",
    { data_type => "text", is_nullable => 1 },
    "expires",
    { data_type => "int", is_nullable => 1 },
);

__PACKAGE__->set_primary_key("id");

1;
