import React, { Component } from "react";
import { ModalFooter } from "reactstrap";
import Paymentcard from "../Paymentcard/Paymentcard";
import Button from "@material-ui/core/Button";
// import StripeCheckout from "react-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import CheckoutForm from "../CheckoutForm/CheckoutForm";

//Public key
const stripePromise = loadStripe(
  "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3"
);
const styles = {
  label: {
    fontSize: "13px",
    lineheight: "18px",
    fontfamily: "europa",
    fontWeight: 700,
    letterSpacing: "3px",
    textTransform: "uppercase",
    paddingBottom: "20px",
    color: "#0E0833",
  },
  RadioOuter: {
    marginBottom: "20px",
    fontWeight: 10,
    paddingLeft: "50px",

    textTransform: "none",
  },
};
const InjectedCheckoutForm = () => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <CheckoutForm stripe={stripe} elements={elements} />
    )}
  </ElementsConsumer>
);
export default class PaymentOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaveCard: false,
      isMoreCard: false,
    };
  }
  changeSave = () => {
    this.setState({ isSaveCard: !this.state.isSaveCard });
    this.setState({ isMoreCard: false });
  };
  changeCard = () => {
    this.setState({ isSaveCard: false });
    this.setState({ isMoreCard: !this.state.isMoreCard });
  };
  render() {
    const { isSaveCard, isMoreCard } = this.state;
    return (
      <>
        <div className="container">
          <div className="eventFrom">
            <label style={styles.label}>Select option to add money</label>

            <div className="text-left checkBoxOuter" style={styles.RadioOuter}>
              <label className="control control--checkbox">
                Save Cards
                <input
                  type="radio"
                  checked={isSaveCard}
                  name="enable_use_description"
                  onChange={this.changeSave}
                />
                <div className="control__radio" />
              </label>
              {isSaveCard ? (
                <div
                  className="paymentOption d-flex"
                  style={{ paddingTop: "10px" }}
                >
                  <ul className="paymentOptionUl d-flex flex-wrap">
                    <li>
                      <a href="#">
                        <img
                          alt=""
                          src="../images/card01.png"
                          className="img-fluid"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img
                          alt=""
                          src="../images/card01.png"
                          className="img-fluid"
                        />
                      </a>
                    </li>
                    {/* <li
                    className="my-1"
                    //   onClick={() => this.selectedcardHandler(event.id)}
                    //   className={
                    //     event.id === this.state.card_id ? "border border-success" : ""
                    //   }
                  >
                    <Paymentcard
                      cardnum={5555555555554444}
                      card_brand={"mastercard"}
                      //delete={() => this.deleteCard(event.id)}
                      // delete={() =>
                      //   this.setState({
                      //     showdelete: !this.state.showdelete,
                      //     dcard_id: event.id,
                      //   })
                      // }
                      // selectedcard={event.id}
                    />
                  </li> */}
                  </ul>
                </div>
              ) : null}
            </div>
            <hr />
            <div className="text-left checkBoxOuter" style={styles.RadioOuter}>
              <label className="control control--checkbox">
                Credit&nbsp;/&nbsp;Debit Cards
                <input
                  type="radio"
                  checked={isMoreCard}
                  name="enable_use_description"
                  onChange={this.changeCard}
                />
                <div className="control__radio" />
              </label>
              {isMoreCard ? (
                <div className="container" style={{ padding: "10px" }}>
                  <Elements stripe={stripePromise}>
                    <InjectedCheckoutForm />
                  </Elements>
                  {/* <StripeCheckout
                    token={"this.onToken"}
                    stripeKey="my_PUBLISHABLE_stripekey"
                  /> */}
                  {/* <a href="#">
                    <img
                      alt=""
                      src="../images/Payment.png"
                      className="img-fluid"
                    />
                  </a> */}
                </div>
              ) : null}
            </div>
          </div>

          {/* <div className="transactionBox">
          <label>Select option to add money</label>
          <div style={{ padding: "10px", margin: "10ox" }}>
            <Input type="radio" name="radio1" /> Saved Cards
          </div>
        </div> */}
        </div>{" "}
      </>
    );
  }
}
