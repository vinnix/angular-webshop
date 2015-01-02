package WebApp::Schema::Result::Size;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("size");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "title",
    { data_type => "varchar", size => 10 },
);

__PACKAGE__->set_primary_key("id");

__PACKAGE__->has_many(
    productsize => 'WebApp::Schema::Result::Productsize',
);

__PACKAGE__->many_to_many(
    products => 'productsize', 'product'
);

1;
