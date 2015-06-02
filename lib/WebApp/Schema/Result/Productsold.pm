package WebApp::Schema::Result::Productsold;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("productsold");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "product",
    { data_type => "int", is_foreign_key => 1 },
    "created",
    { data_type => "timestamp with time zone" },
    "amount",
    { data_type => "int" },
);

__PACKAGE__->set_primary_key("id");

__PACKAGE__->belongs_to(
    product => 'WebApp::Schema::Result::Product',
);

1;
