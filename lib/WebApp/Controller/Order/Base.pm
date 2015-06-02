package WebApp::Controller::Order::Base;
use Moose;
use namespace::autoclean;
use utf8;
use Scalar::Util qw(looks_like_number);
use Finance::Bank::Paytrail;
use boolean;
use JSON;
use URI;
use Data::Dumper;

BEGIN { extends 'WebApp::Controller::Root' }

sub order_base : Chained("base") PathPart("order") CaptureArgs(0) {
    my ($self, $c) = @_;
    $c->stash->{default_payload} = 
        encode_json({
            description => undef,
        });
}

sub index : Chained("order_base") PathPart("") ActionClass("REST") {
}

sub index_GET {
    my ($self, $c) = @_;
    my @orders_data;
    for my $order ($c->model("DB::Order")->all) {
        push @orders_data, {
            id => $order->id,
            reference => $order->reference,
            created => $order->created->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
            updated => $order->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
            contact => from_json($order->contact),
            products => from_json($order->products),
            paid => $order->paid,
            packaged => $order->packaged,
            shipped => $order->shipped,
            shipping_code => $order->shipping_code,
        };
    }
    $self->status_ok( $c, entity => { orders => \@orders_data } );
}

sub index_POST {
    my ($self, $c) = @_;
    my $params ||= $c->req->data || $c->req->params;
    if ($params->{contact} and $params->{products}) {

        my $current_time = DateTime->now->set_time_zone('Europe/Helsinki');

        my $order = $c->model("DB::Order")->create({
            title => $params->{title},
            created => DateTime::Format::Pg->format_datetime($current_time),
            updated => DateTime::Format::Pg->format_datetime($current_time),
            contact => $params->{contact},
            products => $params->{products},
        });

        $order->update({
            reference => $self->calculate_reference($order->id),
        });


=cut

 # Creating a new payment
    my $tx = Finance::Bank::Paytrail->new({merchant_id => 'XXX', merchant_secret => 'YYY'});
    # All content in accordance to http://docs.paytrail.com/ field specs
    $tx->content({
            orderNumber => 1,
            referenceNumber => 13,
            description => 'Order 1',
            currency => 'EUR',
            locale => 'fi_FI',
            urlSet => {success => $c->uri_for('/payment/success').'/',
                       failure => $c->uri_for('/payment/failure').'/',
                       pending => $c->uri_for('/payment/pending').'/',
                       notification => $c->uri_for('/payment/notification').'/',
            },
            orderDetails => {
                includeVat => 1,
                contact => {
                    firstName => 'First',
                    lastName => 'Last',
                    email => 'first@example.com',
                    telephone => '555123',
                    address => {
                        street => 'Street 123',
                        postalCode => '00100',
                        postalOffice => 'Helsinki',
                        country => 'FI',
                    }
                },
                products => [
                    {
                        "title" => 'Product title',
                        "amount" => "1.00",
                        "price" => 123,
                        "vat" => "0.00",
                        "discount" => "0.00",
                        "type" => "1", # 1=normal product row
                    },
                    ],
            },

    });

    # set to 1 when you are developing, 0 in production
    $tx->test_transaction(1);

    my $submit_result = $tx->submit();
    if ($submit_result) {
        print "Please go to ". $tx->url() ." $url to pay your order number ". $tx->order_number().', see you soon.';
    } else {
        die 'Failed to generate payment';
    }

=cut





        $self->status_ok( $c, entity => {
            id => $order->id,
            reference => $order->reference,
            created => $order->created->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
            updated => $order->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
            contact => from_json($order->contact),
            products => from_json($order->products),
            paid => $order->paid,
            packaged => $order->packaged,
            shipped => $order->shipped,
            shipping_code => $order->shipping_code,
        });
    } else {
        $self->status_not_found($c, message => "too short title");
    }
}

sub stash_order : Chained("order_base") PathPart("") CaptureArgs(1) {
    my ($self, $c, $id) = @_;
    if (looks_like_number($id) and my $order = $c->model("DB::Order")->find($id)) {
        $c->stash->{order_id} = $order->id;
    }
}

sub order : Chained("stash_order") PathPart("") ActionClass("REST") {
}

sub order_GET {
    my ($self, $c) = @_;
    if (my $order = $c->model("DB::Order")->find($c->stash->{order_id})) {
            $self->status_ok( $c, entity => {
            id => $order->id,
            reference => $order->reference,
            created => $order->created->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
            updated => $order->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
            contact => from_json($order->contact),
            products => from_json($order->products),
            paid => $order->paid,
            packaged => $order->packaged,
            shipped => $order->shipped,
            shipping_code => $order->shipping_code,
        });
    } else {
        $self->status_not_found($c, message => "order not found");
    }
}

sub order_POST {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        my $params ||= $c->req->data || $c->req->params;
        if (my $order = $c->model("DB::Order")->find($c->stash->{order_id})) {

            my $current_time = DateTime->now->set_time_zone('Europe/Helsinki');
            $order->update({
                updated => DateTime::Format::Pg->format_datetime($current_time),
            });                    

            if ($params->{contact}) {
                $order->update({
                    contact => encode_json($params->{contact}),
                });                    
            }

            if ($params->{products}) {
                $order->update({
                    products => encode_json($params->{products}),
                });                    
            }

            if ($params->{paid}) {
                $order->update({
                    paid => $params->{paid},
                });                    
                $order = create_slug($order);
            }

            if ($params->{packaged}) {
                $order->update({
                    packaged => $params->{packaged},
                });                    
            }

            if ($params->{shipped}) {
                $order->update({
                    shipped => $params->{shipped},
                });                    
            }

            if ($params->{shipping_code}) {
                $order->update({
                    shipping_code => $params->{shipping_code},
                });                    
            }

            $self->status_ok( $c, entity => {
                id => $order->id,
                reference => $order->reference,
                created => $order->created->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
                updated => $order->updated->strftime('%Y-%m-%dT%H:%M:%S.%6N%z'),
                contact => from_json($order->contact),
                products => from_json($order->products),
                paid => $order->paid,
                packaged => $order->packaged,
                shipped => $order->shipped,
                shipping_code => $order->shipping_code,
            });
        } else {
            $self->status_not_found($c, message => "order not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

sub order_DELETE {
    my ($self, $c) = @_;
    if ($c->check_user_roles("admin")) {
        if (my $order = $c->model("DB::Order")->find($c->stash->{order_id})) {
            if ($order->delete) {
                $self->status_ok( $c, entity => {
                    message => 'OK',
                });
            } else {
                $self->status_not_found($c, message => "delete failed");
            }
        } else {
            $self->status_not_found($c, message => "order not found");
        }
    } else {
        $self->status_forbidden($c, message => "access denied");
    }
}

1;
