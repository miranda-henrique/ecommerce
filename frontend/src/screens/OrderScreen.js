import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import PayPalCheckoutButton from '../components/PayPalCheckoutButton';


const OrderScreen = ({ match }) => {

    const orderId = match.params.id;

    const dispatch = useDispatch();

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        };

        //Calculate prices
        order.itemsPrice = addDecimals(order.orderItems.reduce((accum, item) =>
            accum + item.price * item.quantity, 0));

        order.shippingPrice = order.itemsPrice > 100 ? addDecimals(0) : addDecimals(100);

        order.taxPrice = addDecimals(Number((0.15 * order.itemsPrice)));

        order.totalPrice = addDecimals(Number(order.itemsPrice) + Number(order.shippingPrice)
            + Number(order.taxPrice));
    }

    useEffect(() => {
        if (!order || successPay) {
            dispatch({
                type: ORDER_PAY_RESET,
            });

            dispatch(getOrderDetails(orderId));
        }

        //To get the most recent order, check if there is already an order
        //or if the current order id is different from the one passed in the url
        if (!order || order._id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, order, orderId, successPay]);

    const successPaymentHandler = (order) => {
        console.log(order);

        dispatch(payOrder(orderId, order));
    };


    return loading
        ? <Loader />
        : error
            ? <Message variant='danger'>{error}</Message>
            : <>
                <h1>Order {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>

                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p><strong>Name: </strong> {order.user.name}</p>
                                <p>
                                    <strong>Email: </strong>
                                    <a href={`mailto:${order.user.email}`}>
                                        {order.user.email}
                                    </a>
                                </p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address},
                                    {order.shippingAddress.city},
                                    {order.shippingAddress.postalCode},
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered
                                    ? (
                                        <Message variant='success'>
                                            Delivered at {order.deliveredAt}
                                        </Message>
                                    )
                                    : (
                                        <Message variant='danger'>
                                            Not delivered
                                        </Message>
                                    )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid
                                    ? (
                                        <Message variant='success'>
                                            Paid on {order.paidAt}
                                        </Message>
                                    )
                                    : (
                                        <Message variant='danger'>
                                            Not paid
                                        </Message>
                                    )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order items</h2>
                                {order.orderItems.length === 0
                                    ? (
                                        <Message>Your order is empty</Message>
                                    )
                                    : (
                                        <ListGroup variant='flush'>
                                            {order.orderItems.map((item, index) => {
                                                return (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fluid
                                                                    rounded />
                                                            </Col>
                                                            <Col>
                                                                <Link to={`/product/${item.product}`}>
                                                                    {item.name}
                                                                </Link>
                                                            </Col>
                                                            <Col md={4}>
                                                                {item.quantity} x ${item.price} =
                                                                ${item.quantity * item.price}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                );
                                            })}
                                        </ListGroup>
                                    )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>

                                <ListGroup.Item>
                                    <h2>Order summary</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                            <PayPalCheckoutButton
                                                totalPrice={order.totalPrice}
                                                orderId={orderId}
                                            />
                                    </ListGroup.Item>
                                )}

                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>;

};


export default OrderScreen;