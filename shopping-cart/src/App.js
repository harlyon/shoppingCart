import React, {Component} from 'react';


import MobileNavbar from './navbar/Mobile-navbar'
import Navbar from './navbar/Navbar'
import Cards from './content/cards/Cards';
import AppData from './mockData/data';

import ShoppingCart from './cart/ShoppingCart';

import './App.scss';

class App extends Component{
  state = {
   data: AppData,
    cart:{
      cartItems: [],
      quantity: 0
    },
    shoppingCartIconAnimate: '',
    icon:'shopping_cart',
    getShoppingCartModal: false,
  }


  addItems = (item) => {
    const { cartItems, quantity} = this.state.cart
    const items = {...item, "count": 0, "totalPrice": 0}
    this.setState({
      cart: {
        cartItems: [...new Set(cartItems.concat(this.getCartItems(items, cartItems.concat([(items)]))))],
        quantity: quantity + 1,
      },
      shoppingCartIconAnimate:"bounce animated",
      icon:'add_shopping_cart'
    })
  }
  getCartItems = (items, cartItems) => {
     return cartItems.filter((item) => {
      if(items.id === item.id){
        item.count += 1;
        item.totalPrice = item.price * item.count;
      }
       return items.id === item.id;
      }).slice(0, 1); //Get array with highest count with array order
  }
  handleChangeInCartItemsQuantity = (itemIdentifier,  change) => {
    const { cartItems, quantity} = this.state.cart
    switch(change){
      case "increase":
            this.setState({
             cart: {
                cartItems: cartItems.map((item, i)=>{
                  if(item.id === itemIdentifier){
                    item.count += 1;
                    item.totalPrice = (item.price * item.count).toFixed(2);
                  }
                  return item
                }),
                 quantity: quantity + 1,
              },
            })
      break;
      case "decrease":
         this.setState({
             cart: {
                cartItems: cartItems.map((item)=>{
                  if(item.id === itemIdentifier){
                    item.count = (item.count == null || item.count === 1) ? 1: item.count -= 1;
                    item.totalPrice = (item.price / item.count).toFixed(2);
                  }
                  return item
                }),
                 quantity: (quantity === null || quantity === 1) ? (this.deleteShoppingCartItem(itemIdentifier)) : quantity - 1,
              },
            })
      break;
      default:
      console.log("Handle change")
      break;
    }
  }
  deleteShoppingCartItem = (itemIdentifier) => {
    const { cartItems, quantity} = this.state.cart
    console.log('Inside delete function', itemIdentifier)
    let itemCount = 0
     this.setState({
        cart: {
          cartItems: cartItems.filter((item) => {
          console.log('item id in array filter', item.id)
          itemCount = item.count
          console.log('item count', itemCount)
          return item.id !== itemIdentifier}),
          quantity: (quantity === null || quantity === 1) ? 0 : quantity - itemCount,

        },
      })
  }
  handleShoppingCartDisplay  = (e) => {
    e.stopPropagation(e);
    this.setState((state) => ({
      getShoppingCartModal: !state.getShoppingCartModal,
    }));
  };


  render() {
     return (
      <div className="App">
        <header className="App-header">
          <MobileNavbar
          handleShoppingCartClickOpen = {this.handleShoppingCartDisplay}
          quantity={this.state.cart.quantity}
          shoppingCartIconAnimate={this.state.shoppingCartIconAnimate}
          icon={this.state.icon}/>
          <Navbar handleShoppingCartClickOpen = {this.handleShoppingCartDisplay}
          quantity={this.state.cart.quantity} shoppingCartIconAnimate={this.state.shoppingCartIconAnimate} icon={this.state.icon}/>
        </header>
          <ShoppingCart
          openShoppingCart={this.state.getShoppingCartModal}
          onClose = {this.handleShoppingCartDisplay}
          cartItemsArray= {this.state.cart.cartItems}
          handleChangeInCartItemsQuantity = {this.handleChangeInCartItemsQuantity}
          deleteShoppingCartItem = {this.deleteShoppingCartItem}
          />
        <content className="App-content">
          <Cards shoppingCartData={this.state.data}
          addItems = {this.addItems}/>
        </content>
      </div>
    )
  }
}

export default App;
