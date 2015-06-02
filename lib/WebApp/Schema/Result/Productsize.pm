package WebApp::Schema::Result::Productsize;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("productsize");

__PACKAGE__->add_columns(
    "product",
    { data_type => "int", is_foreign_key => 1 },
    "size",
    { data_type => "int", is_foreign_key => 1 },
);

__PACKAGE__->set_primary_key(qw( product size ));

__PACKAGE__->belongs_to(
    product => 'WebApp::Schema::Result::Product',
);

__PACKAGE__->belongs_to(
    size => 'WebApp::Schema::Result::Size',
);

1;
