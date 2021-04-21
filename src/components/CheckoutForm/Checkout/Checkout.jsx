import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from "@material-ui/core"
import { Link, useHistory } from 'react-router-dom';

import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
import useStyles from "./styles";

const steps = ["Shipping address", "Payment details"];


const Checkout = ({ cart, onCaptureCheckout, order, error }) => {
    const classes = useStyles();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);

    const nextStep = () => setActiveStep((prevActivestep) => prevActivestep + 1);
    const backStep = () => setActiveStep((prevActivestep) => prevActivestep - 1);
    

    useEffect(() => {
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, { type: "cart" });

          // console.log(token);

          setCheckoutToken(token);

        } catch (error) {
          console.log(error);
          history.push("/");

        }
      }
      generateToken();

    }, [cart]);

    

    const next = (data) => {
      setShippingData(data);
      nextStep();
    }

    const timeout = () => {
      setTimeout(() => {
        console.log("IsFinished");
        setIsFinished(true);
      }, 5000);
    }



    let Confirmation = () => order.customer ? (
      <div>
        {/* Confirmation */}
        
         <div>
           <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
           <Divider className={classes.divider} />
           <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
        </div>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
      </div>
    ): isFinished ? (
      <div>
         <div>
           <Typography variant="h5">Thank you for your purchase</Typography>
           <Divider className={classes.divider} />
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">Back to home</Button>
      </div>

    ):(
      <div className={classes.spinner}>
         <CircularProgress />
      </div>
    );


    if (error) {
      Confirmation = () => (
        <>
          <Typography variant="h5">Error: {error}</Typography>
          <br />
          <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
      );
    }

    const Form = () => activeStep === 0
      ? <AddressForm checkoutToken={ checkoutToken } next={next} />
      : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout}/>


  return (
    <div>
      <CssBaseline />
      <div className={classes.toolbar} />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
             <Typography variant="h4" align="center">Checkout</Typography>
             <Stepper activeStep={activeStep} className={classes.stepper}>
               {steps.map((step) => (
                  <Step key={step}>
                    <StepLabel>{step}</StepLabel>
                  </Step>
               ))}
             </Stepper>
              {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
          </Paper>
        </main> 
    </div>
  )
}

export default Checkout
