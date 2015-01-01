package WebApp::Schema::Result::Category;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("category");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "slug",
    { data_type => "varchar", is_nullable => 1, size => 150 },
    "title",
    { data_type => "varchar", size => 250 },
    "description",
    { data_type => "text", is_nullable => 1 },
    "position",
    { data_type => "int", is_nullable => 1, default => 0 },
    "hidden",
    { data_type => "integer", is_nullable => 1 },
);

__PACKAGE__->set_primary_key("id");

__PACKAGE__->add_unique_constraint([ "slug" ]);

__PACKAGE__->has_many(
    productcategory => 'WebApp::Schema::Result::Productcategory',
);

__PACKAGE__->many_to_many(
    products => 'productcategory', 'product'
);

1;
