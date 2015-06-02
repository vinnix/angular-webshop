package WebApp::Schema::Result::Order;
use utf8;
use strict;
use warnings;
use base 'DBIx::Class::Core';

__PACKAGE__->table("order");

__PACKAGE__->load_components("InflateColumn::DateTime");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "reference",
    { data_type => "int", is_nullable => 1 },
    "created",
    { data_type => "timestamp with time zone" },
    "updated",
    { data_type => "timestamp with time zone", is_nullable => 1 },
    "contact",
    { data_type => "json" },
    "products",
    { data_type => "json" },
    "paid",
    { data_type => "boolean", default_value => 'false' },
    "packaged",
    { data_type => "boolean", default_value => 'false' },
    "shipped",
    { data_type => "boolean", default_value => 'false' },
    "shipping_code",
    { data_type => "varchar", size => 250 },
);

__PACKAGE__->set_primary_key("id");

1;
