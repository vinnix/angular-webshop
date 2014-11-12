package WebApp::Schema::Result::Role;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->load_components("InflateColumn::DateTime");

__PACKAGE__->table("role");

__PACKAGE__->add_columns(
    "id",
    { data_type => "int", is_auto_increment => 1, is_nullable => 0 },
    "name",
    { data_type => "varchar", is_nullable => 0, size => 80 },
);

__PACKAGE__->set_primary_key("id");

__PACKAGE__->has_many(
    "siteuser_roles",
    "WebApp::Schema::Result::SiteuserRole",
    { "foreign.role" => "self.id" },
    { cascade_copy => 0, cascade_delete => 0 },
);

1;
