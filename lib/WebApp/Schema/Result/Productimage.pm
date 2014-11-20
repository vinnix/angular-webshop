package WebApp::Schema::Result::Productimage;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("productimage");

__PACKAGE__->add_columns(
    "product",
    { data_type => "int", is_foreign_key => 1 },
    "image",
    { data_type => "int", is_foreign_key => 1 },
);

__PACKAGE__->set_primary_key(qw( product image ));

__PACKAGE__->belongs_to(
    product => 'WebApp::Schema::Result::Product',
);

__PACKAGE__->belongs_to(
    image => 'WebApp::Schema::Result::Image',
);

1;
