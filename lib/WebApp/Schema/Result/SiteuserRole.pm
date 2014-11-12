package WebApp::Schema::Result::SiteuserRole;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->load_components("InflateColumn::DateTime");

__PACKAGE__->table("siteuser_role");

__PACKAGE__->add_columns(
    "siteuser",
    { data_type => "int", is_foreign_key => 1, is_nullable => 0 },
    "role",
    { data_type => "int", is_foreign_key => 1, is_nullable => 0 },
);
__PACKAGE__->set_primary_key("siteuser", "role");

__PACKAGE__->belongs_to(
    "siteuser",
    "WebApp::Schema::Result::Siteuser",
    { id => "siteuser" },
    { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

__PACKAGE__->belongs_to(
    "role",
    "WebApp::Schema::Result::Role",
    { id => "role" },
    { is_deferrable => 1, on_delete => "CASCADE", on_update => "CASCADE" },
);

1;
