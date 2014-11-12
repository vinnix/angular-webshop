{
    name => 'WebApp',
    encoding => 'utf-8',
    default_view => 'Xslate',
    'View::Xslate' => {
        encode_body => 0,
    },
    'Plugin::Session' => {
        dbic_class => 'DB::Session',
        cookie_name => 's',
        expires => 3600,
    },
    'Plugin::Authentication' => {
        default_realm => 'siteuser',
        'siteuser' => {
            'credential' => {
                'class' => 'Password',
                'username_field' => 'username',
                'password_field' => 'password',
                'password_type' => 'clear', # hashed, clear
                'password_hash_type' => 'SHA-512',
                'password_pre_salt' => 'foo',
                'password_post_salt' => 'bar',
            },
            'store' => {
                'class' => 'DBIx::Class',
                'user_model' => 'DB::Siteuser',
                'role_relation' => 'roles',
                'role_field' => 'name',
            },
        },
    },
    'Model::DB' => {
        schema_class => 'WebApp::Schema',
        connect_info => [
            'dbi:Pg:',
            undef, undef, {
                pg_enable_utf8 => 1,
                auto_savepoint => 1,
            }
        ],
    },
};
