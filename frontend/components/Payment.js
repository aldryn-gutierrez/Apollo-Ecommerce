import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOter($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id 
        title
      }
    }
  } 
`;

function totalItems(cart) {
  return cart.reduce( (tally, cartItem) => tally + cartItem.quantity, 0 ); 
}

class Payment extends React.Component {
  onTokenResponse = async (response, createOrder) => {
    NProgress.start();
    
    console.log(response)
    const order = await createOrder({
      variables: {
          token: response.id
        }
      })
      .catch(error => { alert(error.message)});
    
    Router.push({
      pathname: '/order',
      query: {
        id: order.data.createOrder.id
      }
    })
  }

  render() {
    return (
      <User>
        {({ data: {me}, loading}) => {
          if (loading) return null;
          return(
            <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
              {(createOrder) => (
                <StripeCheckout  
                  stripeKey="pk_test_5XbDNQ1oxr5UvWjI5leVDNRV00zeMmHBSO"
                  amount={calcTotalPrice(me.cart)}
                  name="Sick Fits"
                  description={`Order of ${totalItems(me.cart)} Items`}
                  image={ me.cart.length && me.cart[0].item && me.cart[0].item.image}
                  currency="SGD"
                  email={me.email}
                  token={response => this.onTokenResponse(response, createOrder)}
                >
                  {this.props.children}
                </StripeCheckout> 
              )}
            </Mutation>  
          );
        }}
      </User>
    )
  }
}

export default Payment;
export { CREATE_ORDER_MUTATION };