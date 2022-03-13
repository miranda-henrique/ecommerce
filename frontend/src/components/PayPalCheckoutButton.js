import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useDispatch } from 'react-redux';
import { payOrder } from '../actions/orderActions';


const PayPalCheckoutButton = (props) => {
    const dispatch = useDispatch();

    const { totalPrice, orderId } = props;
    //PayPal only accepts payments on local currency. It interprets the value with
    //a decimal part separated by a dot as USD, so it is important to replace the
    //dot for a comma or to remove the decimal part entirely for the value to be
    //interpreted as BRL

    //remove comment below after app is completed
    const totalPriceBRL = 1;//Math.trunc(totalPrice);

    const successPaymentHandler = (order) => {
        console.log(order);

        dispatch(payOrder(orderId, order));
    };

    return (
        <PayPalButtons
            createOrder={(data, actions) => {
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: totalPriceBRL,
                            }
                        }
                    ]
                });
            }}

            onApprove={async (data, actions) => {
                const order = await actions.order.capture();

                console.log('order', order);
                console.log('data', data);

                successPaymentHandler(order);
            }}
        />
    );
};


export default PayPalCheckoutButton;
