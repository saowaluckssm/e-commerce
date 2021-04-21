import React from 'react'
import { Container, Typography, Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import CardItem from "./CartItem/CartItem";

import useStyles from "./styles";

const Cart = ({ cart, handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart }) => {

  const classes = useStyles();

  const EmptyCart = () => (
    <Typography variant="subtitle">You have on items in your shopping cart,
      <Link to="/" className={classes.link} >strat adding some</Link>!
    </Typography>
  );

  const FilledCart = () => (
    <div>
      <Grid container spacing={3}>
       {cart.line_items.map((item) => (
         <Grid item xs={12} sm={4} key={item.id}>
            <CardItem item={item} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} />
         </Grid>
       ))}
      </Grid>
      <div className={classes.cardDetails}>
      <Typography variant="h5">
        Subtotal: {cart.subtotal.formatted_with_symbol}
      </Typography>
        <div>
          <Button className={classes.emptyButton} onClick={handleEmptyCart} size="large" type="button" variant="contained"
          color="secondary">Empty Cart</Button>
          <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained"
          color="primary">Checkout</Button>
        </div>

      </div>
    </div>
  )

  if(!cart.line_items) return "Loading...";

  return (
    <Container>
        <div className={classes.toolbar} />
        <Typography className={classes.title} variant="h4" gutterBottom >Your Shopping Cart</Typography>
        { !cart.line_items.length ? <EmptyCart/> : <FilledCart/> }

    </Container>
  )
}

export default Cart
