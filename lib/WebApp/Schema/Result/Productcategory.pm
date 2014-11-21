package WebApp::Schema::Result::Productcategory;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("productcategory");

__PACKAGE__->add_columns(
    "product",
    { data_type => "int", is_foreign_key => 1 },
    "category",
    { data_type => "int", is_foreign_key => 1 },
    "position",
    { data_type => "int", is_nullable => 1 },
);

__PACKAGE__->set_primary_key(qw( product category ));

__PACKAGE__->belongs_to(
    product => 'WebApp::Schema::Result::Product',
);

__PACKAGE__->belongs_to(
    category => 'WebApp::Schema::Result::Category',
);

1;
