package WebApp::Schema::Result::Siteuser;
use utf8;
use strict;
use warnings;

use base 'DBIx::Class::Core';

__PACKAGE__->load_components("InflateColumn::DateTime");

__PACKAGE__->table("siteuser");

__PACKAGE__->add_columns(
    "id",
    { data_type => "integer", is_auto_increment => 1 },
    "email",
    { data_type => "varchar", is_nullable => 1, size => 50 },
    "username",
    { data_type => "varchar", is_nullable => 1, size => 50 },
    "password",
    { data_type => "varchar", is_nullable => 1, size => 255 },
    "first_name",
    { data_type => "varchar", is_nullable => 1, size => 50 },
    "last_name",
    { data_type => "varchar", is_nullable => 1, size => 50 },
);

__PACKAGE__->set_primary_key("id");
__PACKAGE__->add_unique_constraint([ "email", "username" ]);

__PACKAGE__->has_many(
    "siteuser_roles",
    "WebApp::Schema::Result::SiteuserRole",
    { "foreign.siteuser" => "self.id" },
    { cascade_copy => 0, cascade_delete => 0 },
);

__PACKAGE__->many_to_many(
    roles => 'siteuser_roles',
    'role',
);

1;
