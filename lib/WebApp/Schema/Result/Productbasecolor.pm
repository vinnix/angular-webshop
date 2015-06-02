package WebApp::Schema::Result::Productbasecolor;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("productbasecolor");

__PACKAGE__->add_columns(
    "product",
    { data_type => "int", is_foreign_key => 1 },
    "color",
    { data_type => "int", is_foreign_key => 1 },
);

__PACKAGE__->set_primary_key(qw( product color ));

__PACKAGE__->belongs_to(
    product => 'WebApp::Schema::Result::Product',
);

__PACKAGE__->belongs_to(
    color => 'WebApp::Schema::Result::Color',
);

1;
