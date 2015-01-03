package WebApp::Schema::Result::Color;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->table("color");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "title",
    { data_type => "varchar", size => 60 },
    "code",
    { data_type => "varchar", size => 6 },
);

__PACKAGE__->set_primary_key("id");

__PACKAGE__->has_many(
    productbasecolor => 'WebApp::Schema::Result::Productbasecolor',
);

__PACKAGE__->many_to_many(
    baseproducts => 'productbasecolor', 'product'
);

__PACKAGE__->has_many(
    productprintcolor => 'WebApp::Schema::Result::Productprintcolor',
);

__PACKAGE__->many_to_many(
    printproducts => 'productprintcolor', 'product'
);
1;
