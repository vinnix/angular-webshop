package WebApp::Schema::Result::Vat;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("vat");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "amount",
    { data_type => "float" },
    "default",
    { data_type => "integer", is_nullable => 1 },
);

__PACKAGE__->set_primary_key("id");

1;
