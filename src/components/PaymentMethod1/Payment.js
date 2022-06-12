import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import PaymentCard from "../Paymentcard/Paymentcard";
import Joi from "joi-browser";

import {
  Emit,
  GetResponse,
  GetResponsePromise,
} from "../../util/connect-socket";
import { displayLog } from "../../util/functions";
import Loader from "../Loader/Loader";
import { Modal, ModalHeader, ModalFooter, Alert } from "reactstrap";
import Button from "@material-ui/core/Button";
import Promise from "promise";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import CheckoutCard from "../CheckoutForm/CheckoutCard";

const styles = {
  label: {
    fontSize: "70px",
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
  labelText: {
    fontWeight: 500,
    fontSize: "25px",
  },
  card: {
    paddingTop: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    lineHeight: "23px",
    letterSpacing: "1.5px",
    textTransform: "math-auto",
  },
};

//Public key
const stripePromise = loadStripe(
  process.env.PUBLIC_KEY ||
    "pk_test_51IWNYSGmuUdCgkqJyi9r7thHglLqDIBwFpBjRikIDQeqpuN9fSFwa2Y9L4GIc0xyKGRFY1Zv8NUvE9LLu78JOYeU00RwY8FdY9"
);
class Payment extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,

      error: "",
      errorField: "",
      successMsg: "",

      cardlist: [],

      card_id: "",

      loading: false,
      isSaveCard: false,
      isMoreCard: false,
      isShowBal: false,
      showBal: 0,
      showCvv: false,
      showModal: false,
    };
  }
  // this.props.location.state.Event_id;
  componentDidMount() {
    this.setState({ loading: true });

    setTimeout(() => {
      this.getAllCardList();
    }, 500);
  }
  componentWillMount() {
    this.getWalletBal();
    // setTimeout(() => {
    //   this.getAllCardList();
    // }, 1000);
  }

  getWalletBal = () => {
    let req_data = {};

    Emit("getWalletBalance", req_data);
    // this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({ loading: false });

      if (res.code == 1) {
        this.setState({ showBal: res.data && res.data.wallet_amount });
      }
    });
  };

  deleteCard = (card_id) => {
    console.log("delete card", card_id);

    let req_data = {
      card_id: card_id,
    };
    Emit("deleteCard", req_data);
    this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({
        loading: false,
        showCvv: false,
        showModal: false,
        card_id: "",
      });
      console.log("The res is-->DELETE", res);
      // displayLog(res.code, res.message)
      if (res.code == 1) {
        // this.setState({ successMsg: res.message })
        displayLog(res.code, res.message);
        this.getAllCardList();
      } else if (res.code == 0) {
        displayLog(
          res.code,
          res.message.statusCode ? res.message.raw.message : res.message
        );
      } else {
        //this.setState({ error: res.message })
        displayLog(res.code, res.message);
      }
    });
  };
  selectedcardHandler = (card_id) => {
    if (this.state.card_id == card_id) {
      this.setState({
        card_id: "",
        error: "",
        showCvv: false,
      });
    } else {
      this.setState({ card_id: card_id, error: "", showCvv: true });
    }
  };
  changeBal = () => {
    this.setState({
      isShowBal: !this.state.isShowBal,
      isMoreCard: false,
      isSaveCard: false,
    });
  };
  //Purchase ticket using wallet
  purchaseTicketWallet = (amount) => {
    const eventId = this.props.location.state?.eventId;
    //Payment_type = 1- wallet payment & 2 - purchase payment
    const reqData = {
      eventName: "purchaseTicket",
      amount: amount,
      payment_type: 1,
      event_id: eventId,
    };

    this.setState({ loading: true });
    setTimeout(async () => {
      await Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });

        displayLog(res.code, res.message);
        if (res.code === 1) {
          setTimeout(() => {
            this.props.history.push(routes.UPCOMINGEVENTS);
          }, 3000);
        }
      });
    }, 1000);
  };
  changeSave = () => {
    this.getAllCardList();

    this.setState({
      isSaveCard: !this.state.isSaveCard,
      isMoreCard: false,
      isShowBal: false,
      showCvv: false,
      card_id: "",
    });
  };
  getAllCardList = () => {
    let req_data = {};
    // this.setState({ loading: true });
    Emit("getAllCardList", req_data);
    this.setState({ loading: false });
    GetResponse((res) => {
      if (res.code == 1) {
        console.log("FFF", res);
        this.setState({ cardlist: res.data.data });
      }
    });
  };
  changeCard = () => {
    this.setState({
      isMoreCard: !this.state.isMoreCard,
      isSaveCard: false,
      isShowBal: false,
    });
  };
  openModal = () => {
    this.setState({ showModal: true });
  };
  render() {
    const { isSaveCard, isMoreCard, isShowBal, showCvv, showModal } =
      this.state;
    //This amount is show the wallet Balance
    const AvalBal = this.state.showBal;
    //This amount is ticket purchase
    const amount = this.props.location.state?.amount;
    //This amount is come for add money to wallet
    const addMoney = this.props.location.state?.addMoney;
    //Get the Event Id from Event listing the
    const eventId = this.props.location.state?.eventId;
    //Get the SP_ID from subscription Purchase
    const spId = this.props.location.state?.spId;
    //Get Subscription amount
    const spAmount = this.props.location.state?.spAmount;

    // console.log("PROPPPSSS", spAmount);

    //Checkout Form For Stripe
    const InjectedCheckoutForm = () => (
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CheckoutForm
            stripe={stripe}
            elements={elements}
            addMoney={addMoney}
            history={this.props.history}
            amount={amount}
            eventId={eventId}
            spId={spId}
            spAmount={spAmount}
          />
        )}
      </ElementsConsumer>
    );
    //Checkout card for Stripe
    // const InjectedCheckoutCard = () => (
    //   <ElementsConsumer>
    //     {({ stripe, elements }) => (
    //       <CheckoutCard
    //         stripe={stripe}
    //         elements={elements}
    //         addMoney={addMoney}
    //         cardId={this.state.card_id ? this.state.card_id : ""}
    //       />
    //     )}
    //   </ElementsConsumer>
    // );

    //Listout the save Card Details
    let cardlist = <p>No Upcoming Events found</p>;
    cardlist =
      this.state.cardlist && this.state.cardlist.length > 0 ? (
        this.state.cardlist.map((event, index) => (
          <li
            className="my-1"
            key={index}
            onClick={() => this.selectedcardHandler(event.id)}
            style={styles.card}
            className={
              event.id === this.state.card_id ? "border border-success" : ""
            }
          >
            <PaymentCard
              cardnum={event.last4}
              card_brand={event.brand}
              delete={() => this.openModal()}
              // delete={() =>
              //   this.setState({
              //     showdelete: !this.state.showdelete,
              //     dcard_id: event.id,
              //   })
              // }
              selectedcard={this.state.card_id}
            />
          </li>
        ))
      ) : (
        <div className="text-center pl-5">
          <Alert color="danger">Your Save Card is Empty</Alert>
        </div>
      );

    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}
        <div className="transactionsBanner bannerImg">
          <div className="bannerText text-center">
            <div className="container">
              <h1>Payment Methods</h1>
              <h2>Viewer</h2>
            </div>
          </div>
        </div>
        <div className="transactionDetails makePayment ">
          <div className="container">
            <div className="row paymentMode mb-op  row-eq-height">
              <div className="col-md-12" style={{ textAlign: "center" }}>
                <div className="transactionBox">
                  {addMoney ? <label>Select option to add money</label> : ""}
                  {amount ? (
                    <label>Select option to purchase ticket</label>
                  ) : (
                    ""
                  )}
                  {spId ? (
                    <label>Select option to purchase subscription</label>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* Wallet Balance */}
              {!spId && !addMoney && AvalBal >= amount ? (
                <div className="col-md-12">
                  <div
                    className="text-left checkBoxOuter"
                    style={styles.RadioOuter}
                  >
                    <label
                      className="control control--checkbox"
                      style={styles.labelText}
                    >
                      Wallet Balance
                      <input
                        type="radio"
                        checked={isShowBal}
                        name="enable_use_description"
                        onChange={this.changeBal}
                      />
                      <div className="control__radio" />
                    </label>
                    <p className="text-muted" style={{ fontSize: "15px" }}>
                      Available Balance:£{AvalBal}.00
                    </p>
                    {isShowBal ? (
                      <div className="paymentOption d-flex">
                        <button
                          className="blueinnerBtn  cardBtn"
                          onClick={() => this.purchaseTicketWallet(amount)}
                          // disabled={!stripe}
                        >
                          Pay&nbsp;£{amount}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : addMoney || spId ? null : (
                <div className="col-md-12" style={{ opacity: "0.4" }}>
                  <div
                    className="text-left checkBoxOuter"
                    style={styles.RadioOuter}
                  >
                    <label
                      className="control control--checkbox"
                      style={styles.labelText}
                    >
                      Wallet Balance
                      <input
                        type="radio"
                        checked={isShowBal}
                        name="enable_use_description"
                        onChange={this.changeBal}
                      />
                      <div className="control__radio" />
                    </label>
                    <p className="text-muted" style={{ fontSize: "15px" }}>
                      Available Balance:£{AvalBal}.00
                    </p>

                    <Alert color="danger">
                      You do not have enough balance for this Payment
                    </Alert>
                  </div>
                </div>
              )}

              {/* Save the card Button */}
              <div className="col-md-12">
                {addMoney || spId ? null : <hr />}
                <div
                  className="text-left checkBoxOuter"
                  style={styles.RadioOuter}
                >
                  <label
                    className="control control--checkbox"
                    style={styles.labelText}
                  >
                    Save Cards
                    <input
                      type="radio"
                      checked={isSaveCard}
                      name="enable_use_description"
                      onChange={this.changeSave}
                    />
                    <div className="control__radio" />
                  </label>
                </div>
                {isSaveCard ? (
                  <>
                    {" "}
                    <div className="paymentOption d-flex">
                      <ul
                        className="paymentOptionUl d-flex flex-wrap"
                        style={{ padding: "15px 10px 0 10px" }}
                      >
                        {cardlist}
                      </ul>
                    </div>
                    {!showModal && showCvv ? (
                      <>
                        <CheckoutCard
                          cardId={this.state.card_id ? this.state.card_id : ""}
                          addMoney={addMoney}
                          history={this.props.history}
                          amount={amount}
                          eventId={eventId}
                          spId={spId}
                          spAmount={spAmount}
                        />
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>

              {/* credit/debit card button */}
              <div className="col-md-12">
                <hr />
                <div
                  className="text-left checkBoxOuter"
                  style={styles.RadioOuter}
                >
                  <label
                    className="control control--checkbox"
                    style={styles.labelText}
                  >
                    Credit&nbsp;/&nbsp;Debit Cards
                    <input
                      type="radio"
                      checked={isMoreCard}
                      name="enable_use_description"
                      onChange={this.changeCard}
                    />
                    <div className="control__radio" />
                  </label>
                </div>
                {isMoreCard ? (
                  <>
                    {" "}
                    <Elements stripe={stripePromise}>
                      <InjectedCheckoutForm />
                    </Elements>{" "}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {/* open the delete card modal */}
        <Modal
          isOpen={this.state.showModal}
          // toggle={() => this.showToggle()}
        >
          <ModalHeader id="modal-header-css">
            Are you sure you want to Delete the Card?
          </ModalHeader>

          <ModalFooter id="modal-footer-css">
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              className="text-white btn-danger mx-2"
              onClick={() =>
                this.setState({ showModal: !this.state.showModal })
              }
            >
              No
            </Button>
            <Button
              style={{ backgroundColor: "#3C16D5" }}
              className="text-white"
              variant="contained"
              onClick={() => this.deleteCard(this.state.card_id)}
            >
              Yes
            </Button>
          </ModalFooter>
        </Modal>
        <Jointherevolution />
        <Footer />
      </div>
    );
  }
}

export default Payment;
