package WebApp::Schema::Result::Product;
use utf8;
use strict;
use warnings;
use base 'DBIx::Class::Core';

__PACKAGE__->table("product");

__PACKAGE__->load_components("InflateColumn::DateTime");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1 },
    "created",
    { data_type => "timestamp with time zone" },
    "updated",
    { data_type => "timestamp with time zone", is_nullable => 1 },
    "slug",
    { data_type => "varchar", is_nullable => 1, size => 150 },
    "title",
    { data_type => "varchar", size => 250 },
    "main_image",
    { data_type => "int", is_foreign_key => 1, is_nullable => 1 },
    "payload",
    { data_type => "json" },
    "vat",
    { data_type => "int", is_foreign_key => 1, is_nullable => 1 },
    "price",
    { data_type => "float", is_nullable => 1 },
    "discount",
    { data_type => "float", is_nullable => 1 },
    "hidden",
    { data_type => "integer", is_nullable => 1 },
);

__PACKAGE__->set_primary_key("id");

__PACKAGE__->add_unique_constraint([ "slug" ]);

__PACKAGE__->belongs_to(
    main_image => 'WebApp::Schema::Result::Image',
);

__PACKAGE__->might_have(
    vat => 'WebApp::Schema::Result::Vat',
);

__PACKAGE__->has_many(
    productcategory => 'WebApp::Schema::Result::Productcategory',
);

__PACKAGE__->many_to_many(
    categories => 'productcategory', 'category',
);

1;
