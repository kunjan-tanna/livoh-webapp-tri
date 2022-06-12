import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import PaymentCard from "../Paymentcard/Paymentcard";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import { Alert, Input } from "reactstrap";
import Switch from "react-switch";
import moment from "moment";
import {
  Emit,
  GetResponse,
  GetResponsePromise,
} from "../../util/connect-socket";
import { displayLog } from "../../util/functions";
import Loader from "../Loader/Loader";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";
import Promise from "promise";

class Makepayment extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      formValues: {
        name: "",
        cardnumber: "",
        expiry_date: "",
        cvv: "",
      },
      error: "",
      errorField: "",
      successMsg: "",
      exp_month: "",
      exp_year: "",
      cardlist: [],
      iscardselected: false,
      card_id: "",
      showdelete: false,
      dcard_id: "",
    };
  }
  // this.props.location.state.Event_id;
  componentDidMount() {
    this.getAllCardList();
  }

  getAllCardList = () => {
    let req_data = {};
    Emit("getAllCardList", req_data);
    this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      if (res.code == 1) {
        this.setState({ cardlist: res.data });
      }
    });
  };
  handleChange = () => {
    this.setState({ checked: !this.state.checked });
  };
  inputChangedHandler = (e) => {
    this.setState({ successMsg: "", error: "" });
    let name = e.target.name;
    let form = this.state.formValues;
    if (name == "cardnumber") {
      const re = /^[0-9 ]+$/;
      if (e.target.value === "" || re.test(e.target.value)) {
        if (
          e.target.value.toString().replace(/ /g, "").length % 4 === 0 &&
          form[name].toString().replace(/ /g, "").length % 4 == 3 &&
          form[name].toString().replace(/ /g, "").length !== 15
        ) {
          form[name] = e.target.value + " ";
        } else if (e.target.value === "" || re.test(e.target.value)) {
          form[name] = e.target.value;
        }
      }
    } else if (name == "expiry_date") {
      // const re = /\d*([0-9/]?\d+)/;
      const re = /^[0-9/]+$/;
      if (e.target.value === "" || re.test(e.target.value)) {
        if (e.target.value.toString().length === 2 && form[name].length == 1) {
          form[name] = e.target.value + "/";
        } else {
          form[name] = e.target.value;
        }
        // if (e.target.value.toString().length <= 2) {
        //     this.setState({ exp_month: +e.target.value })
        // }
        // else if (e.target.value.toString().length > 3) {
        //     this.setState({ exp_year: "20" + e.target.value.slice(3, 5) })
        // }
      }
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    this.setState({ formValues: form });
    //  console.log("state", this.state)
  };
  saveHandler = () => {
    // console.log(this.state.formValues.expiry_date.slice(0, 2))

    if (this.state.card_id !== "") {
      // if (this.state.checked) {
      //     this.saveCardReq();
      // }
      if (this.props.location.state.amount) {
        this.TransferMoneyReq();
      }
    } else {
      let obj = {
        name: this.state.formValues.name,
        card_number: this.state.formValues.cardnumber
          .toString()
          .replace(/ /g, ""),
        // expiry_date: this.state.formValues.expiry_date,
        exp_month: this.state.formValues.expiry_date.slice(0, 2),
        exp_year: this.state.formValues.expiry_date.slice(3, 5),
        cvv: this.state.formValues.cvv,
      };
      this.validateFormData(obj);
    }

    // console.log(reqdata)
    // if (this.state.checked) {
    //     this.saveCardReq(reqdata);
    // }
    // if(this.state.amount !== ""){
    // this.TransferMoneyReq();
    // }
  };
  validateFormData = (body) => {
    let schema = Joi.object().keys({
      name: Joi.string().trim().required(),
      card_number: Joi.string().trim().min(16).required(),
      // expiry_date: Joi.string().trim().required(),
      exp_month: Joi.number().integer().required(),
      exp_year: Joi.number().integer().required(),
      cvv: Joi.string().trim().required(),
    });
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        //console.log("error", error.details[0].message);
        if (
          error.details[0].message !== this.state.error ||
          error.details[0].context.key !== this.state.errorField
        ) {
          let errorLog = functions.validateSchema(error);
          this.setState({
            error: errorLog.error,
            errorField: errorLog.errorField,
          });
          this.setState({ successMsg: "" });
          //console.log("error is 63 ", this.state.error);
        }
      } else {
        this.setState({ error: "", errorField: "" });
        if (this.props.location.state.amount) {
          console.log("$$$$$$$  1");
          // (async() => {
          //   await this.TransferMoneyReq();
          // })();
          this.TransferMoneyReq();
          console.log("$$$$$$$  4");
        }
        if (this.state.checked) {
          console.log("$$$$$$$  5");
          this.saveCardReq();
          console.log("$$$$$$$  8");
        }
      }
    });
  };
  saveCardReq = async () => {
    let req_data = {
      number: this.state.formValues.cardnumber.replace(/ /g, ""),
      exp_month: +this.state.formValues.expiry_date.slice(0, 2),
      exp_year: +("20" + this.state.formValues.expiry_date.slice(3, 5)),
      cvc: this.state.formValues.cvv,
    };
    if (this.state.cardlist.length <= 2) {
      return new Promise((resolve, reject) => {
        console.log("$$$$$$$  6");
        Emit("addCard", req_data);
        this.setState({ loading: true });
        GetResponsePromise().then((res) => {
          this.setState({ loading: false });
          console.log("The res is-->", res);
          console.log("$$$$$$$  7");
          if (res.code == 1) {
            // this.setState({ successMsg: res.message })
            let form = {
              name: "",
              cardnumber: "",
              expiry_date: "",
              cvv: "",
            };
            this.setState({ formValues: form, checked: false });
            this.getAllCardList();
            displayLog(res.code, res.message);
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
    } else {
      this.setState({ error: "You can add upto 3 cards only" });
    }
  };

  // saveCardReq = async () => {
  //     console.log("addCard api")
  //     let req_data = {
  //         number: this.state.formValues.cardnumber.replace(/ /g, ""),
  //         exp_month: +this.state.formValues.expiry_date.slice(0, 2),
  //         exp_year: +("20" + this.state.formValues.expiry_date.slice(3, 5)),
  //         cvc: this.state.formValues.cvv,
  //     }
  //     if (this.state.cardlist.length <= 2) {
  //         await Emit('addCard', req_data);
  //         this.setState({ loading: true })
  //         GetResponse(res => {
  //             this.setState({ loading: false })
  //             console.log('The res is-->', res);
  //             if (res.code == 1) {
  //                 // this.setState({ successMsg: res.message })
  //                 let form = {
  //                     name: "",
  //                     cardnumber: "",
  //                     expiry_date: "",
  //                     cvv: "",
  //                 }
  //                 this.setState({ formValues: form, checked: false })
  //                 this.getAllCardList();
  //                 displayLog(res.code, res.message)
  //             }
  //             else if (res.code == 0) {
  //                 displayLog(res.code, res.message.statusCode ? res.message.raw.message : res.message)
  //             }
  //             else {
  //                 displayLog(res.code, res.message)
  //             }
  //         })
  //     } else {
  //         this.setState({ error: "You can add upto 3 cards only" })
  //     }
  // }

  TransferMoneyReq = async () => {
    return new Promise((resolve, reject) => {
      var tranfermoney_req_data = {};
      if (this.state.card_id !== "") {
        tranfermoney_req_data = {
          amount: +this.props.location.state.amount,
          card_id: this.state.card_id,
        };
      } else {
        tranfermoney_req_data = {
          amount: +this.props.location.state.amount,
          number: this.state.formValues.cardnumber.replace(/ /g, ""),
          exp_month: +this.state.formValues.expiry_date.slice(0, 2),
          exp_year: +("20" + this.state.formValues.expiry_date.slice(3, 5)),
          cvc: this.state.formValues.cvv,
        };
      }

      console.log("$$$$$$$  2");
      Emit("transferMoney", tranfermoney_req_data);
      this.setState({ loading: true });
      GetResponsePromise().then((res) => {
        this.setState({ loading: false });
        console.log("The res is-->", res);
        console.log("$$$$$$$  3");
        displayLog(res.code, res.message);
        if (res.code == 1) {
          // this.setState({ successMsg: res.message , error:""})
        } else {
          // this.setState({ error: res.message, successMsg:"" })
        }
        resolve();
      });
    });
  };
  deleteCard = (card_id) => {
    console.log("delete card", card_id);
    let req_data = {
      card_id: +card_id,
    };
    Emit("deleteCard", req_data);
    this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({
        loading: false,
        showdelete: !this.state.showdelete,
        card_id: "",
      });
      console.log("The res is-->", res);
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
      this.setState({ card_id: "", error: "" });
    } else {
      this.setState({ card_id: card_id, error: "" });
    }
  };
  render() {
    let cardList =
      this.state.cardlist.length > 0 &&
      this.state.cardlist.map((event, index) => (
        <li
          className="my-1"
          onClick={() => this.selectedcardHandler(event.id)}
          className={
            event.id === this.state.card_id ? "border border-success" : ""
          }
        >
          <PaymentCard
            cardnum={event.last4}
            card_brand={event.card_brand}
            //delete={() => this.deleteCard(event.id)}
            delete={() =>
              this.setState({
                showdelete: !this.state.showdelete,
                dcard_id: event.id,
              })
            }
            selectedcard={event.id}
          />
        </li>
      ));
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}
        <Modal
          isOpen={this.state.showdelete}
          toggle={() => this.showLogoutModal()}
        >
          <ModalHeader id="modal-header-css">
            Are you sure you want to Delete Card?
          </ModalHeader>
          <ModalFooter id="modal-footer-css">
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              className="text-white btn-danger mx-2"
              onClick={() =>
                this.setState({ showdelete: !this.state.showdelete })
              }
            >
              No
            </Button>
            <Button
              style={{ backgroundColor: "#3C16D5" }}
              className="text-white"
              variant="contained"
              onClick={() => this.deleteCard(this.state.dcard_id)}
            >
              Yes
            </Button>
          </ModalFooter>
        </Modal>
        <div className="transactionsBanner bannerImg">
          <div className="bannerText text-center">
            <div className="container">
              <h1>Make A Payment</h1>
            </div>
          </div>
        </div>
        <div className="transactionDetails makePayment ">
          <div className="container">
            <div className="row paymentMode mb-op  row-eq-height">
              <div className="col-md-6">
                <div className="transactionBox">
                  <label>Saved cards</label>
                  <div className="paymentOption d-flex">
                    <ul className="paymentOptionUl d-flex flex-wrap">
                      {cardList}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-12 paymentMethodCard">
                <div className="transactionBox">
                  <label>Other payment methods</label>
                  <div className="row">
                    <div className="col-md-6">
                      <button className="blueBtn blueBtnCard">
                        Credit card <i class="fas fa-long-arrow-alt-right"></i>
                      </button>
                    </div>
                  </div>
                  <div className="row cardDetail">
                    <div className="col-md-6">
                      <label>Name on card</label>
                      <input
                        type="text"
                        placeholder="Enter your name here"
                        className="input-card"
                        name="name"
                        value={this.state.formValues.name}
                        onChange={this.inputChangedHandler}
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Card number</label>
                      <input
                        type="text"
                        placeholder="0000  0000  0000  0000"
                        className="input-card inputRight"
                        name="cardnumber"
                        value={this.state.formValues.cardnumber}
                        onChange={this.inputChangedHandler}
                        maxLength="19"
                      />
                      <i className="mastercardIcon">
                        <img alt="" src="./images/mastercard-logo.png" />{" "}
                      </i>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-6">
                          <label>Expiry date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="input-card"
                            name="expiry_date"
                            value={this.state.formValues.expiry_date}
                            onChange={this.inputChangedHandler}
                            maxLength="5"
                          />
                        </div>
                        <div className="col-md-6 mb-0">
                          <label>cvv</label>
                          <input
                            type="text"
                            placeholder="- - -"
                            className="input-card inputRight"
                            name="cvv"
                            value={this.state.formValues.cvv}
                            onChange={this.inputChangedHandler}
                            maxLength="3"
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
                  </div>
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
                  </div>
                  <div className="text-center">
                    {this.state.error !== "" ? (
                      <Alert color="danger">{this.state.error}</Alert>
                    ) : null}
                    {this.state.successMsg !== "" ? (
                      <Alert color="success">{this.state.successMsg}</Alert>
                    ) : null}
                  </div>
                  <div className="row cardButton">
                    <div className="col-md-6"></div>
                    <div className="col-md-6">
                      <button
                        className="blueinnerBtn  cardBtn"
                        onClick={this.saveHandler}
                      >
                        Stripe<i class="fas fa-long-arrow-alt-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Jointherevolution />
        <Footer />
      </div>
    );
  }
}

export default Makepayment;
