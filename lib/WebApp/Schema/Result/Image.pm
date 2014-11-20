package WebApp::Schema::Result::Image;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("image");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "link",
    { data_type => "varchar", size => 250 },
    "width",
    { data_type => "int", is_nullable => 1 },
    "height",
    { data_type => "int", is_nullable => 1 },
);

__PACKAGE__->set_primary_key("id");

__PACKAGE__->add_unique_constraint([ "link" ]);

__PACKAGE__->has_many(
    productimage => 'WebApp::Schema::Result::Productimage',
);

__PACKAGE__->many_to_many(
    products => 'productimage', 'product'
);

1;
