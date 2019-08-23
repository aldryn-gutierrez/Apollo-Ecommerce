import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import Signout from './Signout';
import { TOGGLE_CART_MUTATION } from './Cart';
import { Mutation } from 'react-apollo';
import CartCount from './CartCount';
import CartItem from './CartItem';

const Nav = () => (
  <User>
    {({ data, loading }) => {
      if (loading) return null;
      const me = data ? data.me : null
      return (
      <NavStyles data-test="nav">
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <Signout/>
            <Mutation mutation={ TOGGLE_CART_MUTATION }>
              {(toggleCart) => (
                <button onClick={toggleCart}>
                  My Cart
                  <CartCount count={me.cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0 )}></CartCount>
                </button>
              )}
            </Mutation>
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>

        )}
      </NavStyles>
    )
    }}
  </User>
);

export default Nav;