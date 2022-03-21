import { useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0
};

const cartReducer = (state, action) => {
  let existingCartItem;
  let existingCartItemIndex;
  let updatedTotalAmount;
  let updatedItem;
  let updatedItems;
  switch (action.type) {
    case 'ADD':
      updatedTotalAmount =
        state.totalAmount + action.item.price * action.item.amount;

      existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.item.id
      );
      existingCartItem = state.items[existingCartItemIndex];

      if (existingCartItem) {
        updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount + action.item.amount
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.item);
      }
      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount
      };
    case 'REMOVE':
      existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      existingCartItem = state.items[existingCartItemIndex];
      updatedTotalAmount = state.totalAmount - existingCartItem.price;
      if (existingCartItem.amount === 1) {
        //remove from items array
        updatedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        //keep in array but decrease amount
        updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount - 1
        };
        updatedItems = [...state.items];
        updatedItems[existingCartItemIndex] = updatedItem;
      }
      return {
        items: updatedItems,
        totalAmount: updatedTotalAmount
      };

    default:
      return defaultCartState;
  }
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
