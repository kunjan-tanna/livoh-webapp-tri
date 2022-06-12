import React, { Component } from "react";
import {
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { displayLog } from "../../util/functions";
import { Alert } from "reactstrap";
import Loader from "../Loader/Loader";

import routes from "../../Routes";
import {
  Emit,
  GetResponse,
  GetResponsePromise,
} from "../../util/connect-socket";

export default class CheckoutCard extends Component {
  constructor() {
    super();
    this.state = {
      error: "",
      cvv: "",
      disable: true,
      loading: false,
    };
  }
  inputChangedHandler = (e) => {
    this.setState({
      successMsg: "",
      error: "",
      cvv: e.target.value.replace(/^\s+/g, ""),
    });
  };

  saveHandler = async (event) => {
    event.preventDefault();

    const { cardId, addMoney, history, amount, spId } = this.props;
    //This section for Add Money to Wallet using save card
    if (addMoney) {
      //pass the card Id & amount to your backend api
      const reqData = {
        card_id: cardId,
        amount: addMoney,
      };
      this.setState({ loading: true });
      setTimeout(() => {
        Emit("transferMoney", reqData);

        GetResponse((res) => {
          console.log("The res is-->PAYMENT KUNJAN", res);
          this.setState({ loading: false });

          displayLog(res.code, res.message);
          if (res.code === 1) {
            console.log("The res is-->PAYMENT Save", res.data);
            setTimeout(() => {
              history.push(routes.WALLET);
            }, 3000);
            // this.props.history.push(routes.WALLET);
          }
        });
      }, 1000);
    }

    //This section is used for Purchase the ticket using save card
    if (amount) {
      this.PurchaseSave();
    }
    //This section for purchase the subscription
    if (spId) {
      this.purchaseSubscription();
    }
  };
  purchaseSubscription = () => {
    const { cardId, history, amount, spId } = this.props;
    const reqData = {
      eventName: "purchaseSubscription",
      card_id: cardId,
      sp_id: spId,
    };
    this.setState({ loading: true });

    setTimeout(() => {
      Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("FINALL PAYMNET", res);
        displayLog(res.code, res.message);
        if (res.code === 1) {
          setTimeout(() => {
            history.push(routes.UPCOMINGEVENTS);
          }, 3000);
        }
      });
    }, 1000);
  };
  PurchaseSave = () => {
    const { cardId, history, amount, eventId } = this.props;
    //Payment_type = 1- wallet payment & 2 - purchase payment
    const reqData = {
      eventName: "purchaseTicket",
      card_id: cardId,
      amount: amount,
      payment_type: 2,
      event_id: eventId,
    };

    this.setState({ loading: true });
    setTimeout(() => {
      Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("SETP 2", res);
        displayLog(res.code, res.message);
        if (res.code === 1) {
          setTimeout(() => {
            history.push(routes.UPCOMINGEVENTS);
          }, 3000);
        }
      });
    }, 1000);
  };
  inputHandler = () => {
    this.setState({ error: "" });
  };
  render() {
    const { addMoney, amount, spAmount } = this.props;
    return (
      <>
        <div className="row">
          {this.state.loading && <Loader />}
          {/* <div className="col-md-4" style={{ padding: "10px", margin: "10px" }}>
            <input
              type="password"
              placeholder="- - -"
              className="input-card inputRight"
              name="cvv"
              // style={tlStyle}
              // value={this.state.formValues.cvv}
              onChange={this.inputChangedHandler}
              maxLength="3"
            />
            <i
              className="helpIcon"
              style={{ bottom: "35px" }}
              title="It is the three-digit number at the back of your card."
            >
              <img alt="" src="./images/help-icon.svg" />{" "}
            </i>
          </div> */}
          <div className="col-md-4" style={{ padding: "10px", margin: "10px" }}>
            <button
              className="blueinnerBtn  cardBtn"
              onClick={this.saveHandler}
            >
              Pay&nbsp;£{amount && amount}
              {addMoney && addMoney}
              {spAmount && spAmount}
            </button>
          </div>{" "}
          <div className="text-center">
            {this.state.error !== "" ? (
              <Alert color="danger">{this.state.error}</Alert>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}
