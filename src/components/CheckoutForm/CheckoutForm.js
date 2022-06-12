import React, { Component } from "react";
import {
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { Alert } from "reactstrap";
import Loader from "../Loader/Loader";
import { displayLog } from "../../util/functions";
import history from "../../util/history";
import routes from "../../Routes";
import Switch from "react-switch";
import {
  Emit,
  GetResponse,
  GetResponsePromise,
} from "../../util/connect-socket";

const tlStyle = {
  base: {
    fontSize: "20px",
    fontFamily: "europa , sans-serif",
    letterSpacing: "2px",
    lineHeight: "23px",
    color: "#697A94",
  },
  invalid: {
    color: "#cf3100",
    iconColor: "#cf3100",
  },
};
export default class CheckoutForm extends Component {
  constructor() {
    super();
    this.state = {
      error: "",
      loading: false,
      disable: true,
      checked: false,
      checkList: [],
    };
  }
  // componentWillMount() {
  //   console.log("GETT", this.props.loading);
  //   this.setState({ loading: true });
  // }

  //Handle the Payment Integration
  handleSubmit = async (event) => {
    event.preventDefault();

    const { stripe, elements, addMoney, history, amount, spId } = this.props;

    //This section for Add Money to Wallet
    if (addMoney) {
      if (!stripe || !elements) {
        return;
      }
      const cardNumber = await elements.getElement(CardNumberElement);

      // //Generate the Token
      const result = await stripe.createToken(cardNumber);
      this.setState({ loading: true });
      if (result.error) {
        this.setState({ error: result.error.message });
      } else {
        this.setState({ error: "" });

        // pass the token & amount to your backend api
        let id = result.token && result.token.id;
        let cardId = result.token && result.token.card && result.token.card.id;

        const reqData = {
          token: id,
          amount: addMoney,
          card_id: cardId,
        };
        setTimeout(() => {
          Emit("transferMoney", reqData);
          GetResponse((res) => {
            this.setState({ loading: false });
            // console.log("The res is-->PAYMENT KUNJAN", res);
            displayLog(res.code, res.message);
            if (res.code === 1) {
              if (this.state.checked) {
                this.saveCardReq();
              }
              setTimeout(() => {
                history.push(routes.WALLET);
              }, 3000);
            }
          });
        }, 1000);
      }
    }
    //This section for Purchase the ticket
    if (amount) {
      this.purchaseTicket();
    }
    //This section for purchase the subscription
    if (spId) {
      this.purchaseSubscription();
    }
  };
  purchaseSubscription = async () => {
    const { stripe, elements, history, spId } = this.props;
    console.log("SPIDD", spId);
    if (!stripe || !elements) {
      return;
    }
    const cardNumber = await elements.getElement(CardNumberElement);
    // //Generate the Token
    const result = await stripe.createToken(cardNumber);
    this.setState({ loading: true });
    if (result.error) {
      this.setState({ error: result.error.message });
    } else {
      this.setState({ error: "" });
      let id = result.token && result.token.id;
      const reqData = {
        eventName: "purchaseSubscription",
        token: id,
        sp_id: spId,
      };
      Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("FINALL RESPONSEE", res);
        displayLog(res.code, res.message);
        if (res.code === 1) {
          if (this.state.checked) {
            this.saveCardReq();
          }
          setTimeout(() => {
            history.push(routes.UPCOMINGEVENTS);
          }, 3000);
        }
      });
    }
  };
  purchaseTicket = async () => {
    const { stripe, elements, addMoney, history, amount, eventId } = this.props;
    if (!stripe || !elements) {
      return;
    }
    const cardNumber = await elements.getElement(CardNumberElement);

    // //Generate the Token
    const result = await stripe.createToken(cardNumber);
    this.setState({ loading: true });
    if (result.error) {
      this.setState({ error: result.error.message });
    } else {
      this.setState({ error: "" });
      let id = result.token && result.token.id;
      // let cardId = result.token && result.token.card && result.token.card.id;
      //Payment_type = 1- wallet payment & 2 - purchase payment
      const reqData = {
        eventName: "purchaseTicket",
        token: id,
        amount: amount,
        payment_type: 2,
        event_id: eventId,
      };
      // setTimeout(() => {
      Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("SETP 2", res);
        displayLog(res.code, res.message);
        if (res.code === 1) {
          if (this.state.checked) {
            this.saveCardReq();
          }
          setTimeout(() => {
            history.push(routes.UPCOMINGEVENTS);
          }, 3000);
        }
      });
    }
  };

  inputHandler = () => {
    this.setState({ error: "" });
  };
  handleChange = () => {
    this.setState({ checked: !this.state.checked });
  };
  //Save the card
  saveCardReq = async () => {
    const { stripe, elements, history } = this.props;
    if (!stripe || !elements) {
      return;
    }
    const cardNumber = await elements.getElement(CardNumberElement);

    // //Generate the Token
    const result = await stripe.createToken(cardNumber);
    if (result.error) {
      this.setState({ error: result.error.message });
    } else {
      this.setState({ error: "" });
      console.log("RESSS FINGER", result.token);
      // pass the token to your backend api for save card
      let id = result.token && result.token.id;
      // let fingerprint =
      //   result.token && result.token.card && result.token.card.fingerprint;

      const saveCard = {
        token: id,
        // fingerprint: fingerprint,
      };
      this.setState({ loading: true });
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          Emit("addCard", saveCard);

          GetResponsePromise().then((res) => {
            this.setState({ loading: false });
            console.log("The res is-->ADD CARD", res);

            // console.log("$$$$$$$  7");
            if (res.code == 1) {
              // this.setState({ successMsg: res.message })

              this.setState({ checked: false });
              // setTimeout(() => {
              //   history.push(routes.WALLET);
              // }, 3000);

              displayLog(res.code, res.message);
              // return getAllCardList;
            } else if (res.code == 0) {
              displayLog(
                res.code,
                res.message.statusCode ? res.message.raw.message : res.message
              );
            } else {
              displayLog(res.code, res.message);
            }
            resolve();
          });
        });
      }, 1000);
    }

    // if (this.state.cardlist.length <= 2) {
    //   return new Promise((resolve, reject) => {
    //     Emit("addCard", saveCard);
    //     this.setState({ loading: true });
    //     GetResponsePromise().then((res) => {
    //       this.setState({ loading: false });
    //       console.log("The res is-->ADD CARD", res);
    //       // console.log("$$$$$$$  7");
    //       // if (res.code == 1) {
    //       //   // this.setState({ successMsg: res.message })
    //       //   let form = {
    //       //     name: "",
    //       //     cardnumber: "",
    //       //     expiry_date: "",
    //       //     cvv: "",
    //       //   };
    //       //   this.setState({ formValues: form, checked: false });
    //       //   this.getAllCardList();
    //       //   displayLog(res.code, res.message);
    //       // } else if (res.code == 0) {
    //       //   displayLog(
    //       //     res.code,
    //       //     res.message.statusCode ? res.message.raw.message : res.message
    //       //   );
    //       // } else {
    //       //   displayLog(res.code, res.message);
    //       // }
    //       resolve();
    //     });
    //   });
    // } else {
    //   this.setState({ error: "You can add upto 3 cards only" });
    // }
  };

  render() {
    const { stripe, addMoney, amount, spAmount } = this.props;

    return (
      <div className="col-md-12 paymentMethodCard">
        {this.state.loading && <Loader />}
        <div className="transactionBox">
          <div className="row cardDetail" style={{ marginTop: "10px" }}>
            <div className="col-md-6">
              <label>Card number</label>
              <CardNumberElement
                className="input-card inputRight"
                options={{
                  placeholder: "0000  0000  0000  0000",
                  style: tlStyle,
                  showIcon: true,
                }}
                onChange={this.inputHandler}
              />
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <label>Expiry date</label>
                  <CardExpiryElement
                    className="input-card inputRight"
                    options={{
                      placeholder: "MM/YY",
                      style: tlStyle,
                    }}
                    onChange={this.inputHandler}
                  />
                </div>
                <div className="col-md-6 mb-0">
                  <label>cvv</label>
                  <CardCvcElement
                    id="cvc"
                    className="input-card inputRight"
                    options={{
                      placeholder: "- - -",
                      style: tlStyle,
                      hidden: true,
                    }}
                    onChange={this.inputHandler}
                  />

                  <i
                    className="helpIcon"
                    title="It is the three-digit number at the back of your debit card."
                  >
                    <img alt="" src="./images/help-icon.svg" />{" "}
                  </i>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              {" "}
              <div className="reactOpswitch">
                <label>
                  <Switch
                    checked={this.state.checked}
                    onChange={this.handleChange}
                    onColor="#3AB5E5"
                    onHandleColor="#fff"
                    handleDiameter={12}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                    className="react-switch"
                    id="material-switch"
                  />
                  <span>Save this card</span>
                </label>
              </div>{" "}
            </div>

            <div className="col-md-2"></div>
            <div className="col-md-4">
              <button
                type="button"
                className="blueinnerBtn  cardBtn"
                onClick={this.handleSubmit}
                // onClick={this.saveHandle}
                disabled={!stripe}
              >
                Pay&nbsp;£{amount && amount}
                {addMoney && addMoney}
                {spAmount && spAmount}
              </button>
            </div>
            <div className="text-center">
              {this.state.error !== "" ? (
                <Alert color="danger">{this.state.error}</Alert>
              ) : null}
              {/* {this.state.successMsg !== "" ? (
                      <Alert color="success">{this.state.successMsg}</Alert>
                    ) : null} */}
            </div>
            {/* <div className="row cardButton"></div> */}
          </div>
        </div>
      </div>
    );
  }
}
