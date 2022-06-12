import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, withRouter } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import PaymentCard from "../Paymentcard/Paymentcard";
import {
  Emit,
  GetResponse,
  GetResponsePromise,
} from "../../util/connect-socket";
import moment from "moment";
import { displayLog } from "../../util/functions";
import Loader from "../Loader/Loader";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";
import Promise from "promise";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cardlist: [],
      transferHistory: [],
      fund_send: "",
      fund_receive: "",
      showdelete: false,
      card_id: "",
    };
  }

  componentDidMount = async () => {
    console.log("$$$$$$$$$$ 1");
    // await this.getAllCardList();
    console.log("$$$$$$$$$$ 4");
    await this.gettransferHistory();
    console.log("$$$$$$$$$$ 7");
  };

  // getAllCardList = async () => {
  //   let req_data = {}
  //   this.setState({ loading: true })
  //   console.log("$$$$$$$$$$ 2")
  //   await Emit('getAllCardList', req_data);
  //   await GetResponse(res => {
  //     console.log("$$$$$$$$$$ 3")
  //     this.setState({ loading: false })
  //     console.log('The res is cardlist-->', res);
  //     if (res.code == 1) {
  //       this.setState({ cardlist: res.data })
  //     }
  //    // this.gettransferHistory();
  //     return;
  //   })
  // }
  getAllCardList = async () => {
    return new Promise((resolve, reject) => {
      let req_data = {};
      this.setState({ loading: true });
      console.log("$$$$$$$$$$ 2");
      Emit("getAllCardList", req_data);
      GetResponsePromise().then((res) => {
        console.log("$$$$$$$$$$ 3");
        this.setState({ loading: false });
        console.log("The res is cardlist-->", res);
        if (res.code == 1) {
          this.setState({ cardlist: res.data });
        }
        resolve();
      });
    });
  };

  // gettransferHistory = () => {

  //   let req_data = {}
  //   console.log("$$$$$$$$$$ 5")
  //   Emit('transferHistory', req_data);
  //   this.setState({ loading: true })
  //   GetResponse(res => {
  //     console.log("$$$$$$$$$$ 6")
  //     this.setState({ loading: false })
  //     console.log('The res is transaction-->', res);
  //     if (res.code == 1) {
  //       this.setState({ transferHistory: res.data })
  //     }
  //   })
  //   return;
  // }
  gettransferHistory = async () => {
    return new Promise((resolve, reject) => {
      let req_data = {};
      this.setState({ loading: true });
      console.log("$$$$$$$$$$ 5");
      Emit("transferHistory", req_data);
      GetResponsePromise().then((res) => {
        console.log("$$$$$$$$$$ 6");
        this.setState({ loading: false });
        console.log("The res is tranfer-->", res);
        if (res.code == 1) {
          this.setState({ transferHistory: res.data });
        }
        resolve();
      });
    });
  };
  inputChangedHandler = (e) => {
    if (e.target.name == "fund_send")
      this.setState({ fund_send: e.target.value });
    if (e.target.name == "fund_receive")
      this.setState({ fund_receive: e.target.value });
  };
  proceedHandler = () => {
    console.log("proceed click");
    this.props.history.push({
      pathname: routes.MAKEPAYMENT,
      // search: '?id',
      state: { amount: this.state.fund_send },
    });
  };
  onReceiveApiReq = () => {
    let req_data = {
      amount: +this.state.fund_send,
    };

    Emit("calculateMoney", req_data);
    this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      if (res.code == 1) {
        this.setState({ fund_receive: res.data.final_gbp_amount });
        console.log("state", this.state);
      } else {
        this.setState({ error: res.message });
      }
    });
  };

  deleteCard = (id) => {
    console.log("delete card", id);
    let req_data = {
      card_id: +id,
    };
    Emit("deleteCard", req_data);
    this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({ loading: false, showdelete: !this.state.showdelete });
      console.log("The res is-->", res);
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
  render() {
    let cardList = this.state.cardlist.map((card, index) => (
      <li className="my-1" key={card.id}>
        <PaymentCard
          cardnum={card.last4}
          card_brand={card.card_brand}
          // delete={() => this.deleteCard(card.id)}
          delete={() =>
            this.setState({
              showdelete: !this.state.showdelete,
              card_id: card.id,
            })
          }
        />
      </li>
    ));
    let transferHistory = this.state.transferHistory.map((history, index) => (
      <tr key={history.id}>
        <td>
          {history.type === 1 ? (
            <i className="arrow-img">
              <img alt="" src="./images/green-arrow.svg" />{" "}
            </i>
          ) : (
            <i className="arrow-img">
              <img alt="" src="./images/pink-arrow.svg" />{" "}
            </i>
          )}
        </td>
        <td>Sent to:</td>
        <td className="text-center">
          {history.brand == "mastercard" && (
            <img
              alt=""
              src="./images/mastercard-logo.png"
              className="img-fluid"
            />
          )}
          {history.brand == "visa" && (
            <img
              alt=""
              src="./images/visacard-logo.jpg"
              className="img-fluid"
            />
          )}
        </td>
        <td>Amount:</td>
        <td>
          <span>
            {history.usd_amount} USD <br />
            {history.gbp_amount} GBP
          </span>
        </td>
        <td>When:</td>
        <td>
          <span>
            {moment.unix(history.created_date).format("h:mma")} <br />
            {moment.unix(history.created_date).format("DD MMM YYYY")}
          </span>
        </td>
        <td>Status:</td>
        <td className="statusTdGreen ">
          <i className="status">
            <img
              alt=""
              src="./images/completed-icon.svg"
              className="img-fluid"
            />
          </i>{" "}
          Completed
        </td>
        <td className="text-center pr-0">
          <button className="moreImg">
            <img alt="" src="./images/more.svg" />
          </button>
        </td>
      </tr>
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
              onClick={() => this.deleteCard(this.state.card_id)}
            >
              Yes
            </Button>
          </ModalFooter>
        </Modal>
        <div className="transactionsBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              <h1>My Transactions</h1>
              <h2>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus et
              </h2>
            </div>
          </div>
        </div>
        <div className="transactionDetails ">
          <div className="container">
            <div className="row text-center mb-op">
              <div className="col-md-4">
                <div className="transactionBox">
                  <label>Total earnings available</label>
                  <h3>$7,400.00</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="transactionBox">
                  <label>Total withdrawal amount</label>
                  <h3>$400.00</h3>
                </div>
              </div>
              <div className="col-md-4 ">
                <div className="transactionBox mb-0">
                  <label>last withdrawal date</label>
                  <h3>01/07/2020</h3>
                </div>
              </div>
            </div>
            <div className="row paymentMode mb-op  row-eq-height">
              <div className="col-md-6">
                <div className="transactionBox">
                  <label>Linked payment systems</label>
                  <div className="paymentOption d-flex">
                    <ul className="paymentOptionUl d-flex flex-wrap">
                      {cardList}
                      <li>
                        <button
                          className="addCard"
                          onClick={() =>
                            this.props.history.push({
                              pathname: routes.MAKEPAYMENT,
                              state: { amount: this.state.fund_send },
                            })
                          }
                        >
                          <i>+</i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="fundtransferBox transactionBox">
                  <label>Funds Transfer</label>
                  <div className="row transferRow">
                    <div className="col-md-6">
                      <span>Send</span>
                      <div className="amtOuter">
                        <div className="row align-items-center">
                          <div className="col-6" htmlFor="fund_send">
                            {/* <h5>400.00</h5> */}
                            <input
                              type="text"
                              name="fund_send"
                              id="fund_send"
                              value={this.state.fund_send}
                              onChange={this.inputChangedHandler}
                              onKeyUp={this.onReceiveApiReq}
                            />
                          </div>
                          <div className="col-6">
                            <h6>USD</h6>
                          </div>
                        </div>
                      </div>
                      <div className="fundStatus">Available £7,459.99</div>
                    </div>
                    <div className="col-md-6 pl-4">
                      <div className="rightArrow"></div>
                      <span>Will Receive</span>
                      <div className="amtOuter">
                        <div className="row align-items-center">
                          <div className="col-6" htmlFor="fund_receive">
                            {/* <h5>324.19</h5> */}
                            <input
                              type=""
                              name="fund_receive"
                              id="fund_receive"
                              value={this.state.fund_receive}
                              onChange={this.inputChangedHandler}
                            />
                          </div>
                          <div className="col-6">
                            <h6>GBP</h6>
                          </div>
                        </div>
                      </div>
                      <div className="fundStatus">1 USD = 0.81 GBP</div>
                    </div>
                  </div>

                  <div className="fundInfo">
                    <div className="row">
                      <div className="col-md-12 col-lg-8">
                        <div className="fundInfoDiv">
                          <i className="infoIcon">
                            <img alt="" src="./images/info-icon.svg" />{" "}
                          </i>{" "}
                          TRANSFER WILL BE RECEIVED ON 29 JUN 2019
                        </div>
                      </div>
                      <div className="col-lg-4 pl-lg-0">
                        <button
                          className="blueSmallBtn"
                          onClick={this.proceedHandler}
                        >
                          PROCEED TRANSFER
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="linkedPaymentTable">
              <div className="transactionBox">
                <label>Linked payment systems</label>

                <div className="paymentTableOuter table-responsive">
                  <table className="paymentOuter table">
                    <tbody>
                      {transferHistory}
                      <tr>
                        <td>
                          <i className="arrow-img">
                            <img alt="" src="./images/pink-arrow.svg" />
                          </i>
                        </td>
                        <td>Sent to:</td>
                        <td className="text-center">
                          <img
                            alt=""
                            src="./images/mastercard-logo.png"
                            className="img-fluid"
                          />
                        </td>
                        <td>Amount:</td>
                        <td>
                          <span>
                            400 USD <br />
                            324 GBP
                          </span>
                        </td>
                        <td>When:</td>
                        <td>
                          <span>
                            3:00pm <br />
                            01 Jul 2019
                          </span>
                        </td>
                        <td>Status:</td>
                        <td className="statusTdPink">
                          <i className="status">
                            <img
                              alt=""
                              src="./images/pending-icon.svg"
                              className="img-fluid"
                            />
                          </i>{" "}
                          Pending
                        </td>
                        <td className="text-center pr-0">
                          <button className="moreImg">
                            <img alt="" src="./images/more.svg" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <i className="arrow-img">
                            <img alt="" src="./images/green-arrow.svg" />
                          </i>
                        </td>
                        <td>Sent to:</td>
                        <td className="text-center">
                          <img
                            alt=""
                            src="./images/mastercard-logo.png"
                            className="img-fluid"
                          />
                        </td>
                        <td>Amount:</td>
                        <td>
                          <span>
                            400 USD <br />
                            324 GBP
                          </span>
                        </td>
                        <td>When:</td>
                        <td>
                          <span>
                            3:00pm <br />
                            01 Jul 2019
                          </span>
                        </td>
                        <td>Status:</td>
                        <td className="statusTdGreen ">
                          <i className="status">
                            <img
                              alt=""
                              src="./images/completed-icon.svg"
                              className="img-fluid"
                            />
                          </i>{" "}
                          Completed
                        </td>
                        <td className="text-center pr-0">
                          <button className="moreImg">
                            <img alt="" src="./images/more.svg" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

export default withRouter(Transaction);
