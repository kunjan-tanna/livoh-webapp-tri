import React, { Component } from "react";
import Footer from "../footer/footer";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Loader from "../Loader/Loader";
import Header from "../header/header";
import {
  Alert,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Button from "@material-ui/core/Button";
import routes from "../../Routes";
import {
  Emit,
  GetResponse,
  GetResponsePromise,
} from "../../util/connect-socket";

class wallet extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      // formValues: {
      //   name: "",
      //   cardnumber: "",
      //   expiry_date: "",
      //   cvv: "",
      // },
      amount: 0,
      error: "",
      errorField: "",
      successMsg: "",
      loading: false,
      showModal: false,
      disable: true,
      showBal: 0,
    };
  }

  componentDidMount() {
    this.setState({ loading: !this.state.loading });
    setTimeout(() => {
      this.getWalletBal();
    }, 500);
  }

  getWalletBal = () => {
    let req_data = {};
    Emit("getWalletBalance", req_data);
    this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("GET BALANCE", res);
      if (res.code == 1) {
        this.setState({ showBal: res.data && res.data.wallet_amount });
      }
    });
  };
  showToggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  inputChangedHandler = (e) => {
    let amount = e.target.value;
    this.setState({ amount: +amount, error: "" });
  };
  openModal = () => {
    let obj = this.state.amount;
    if (obj) {
      this.setState({ showModal: !this.state.showModal });
    } else {
      this.setState({ error: "Please Enter a Valid Amount" });
    }
  };

  render() {
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}

        <div className="transactionsBanner bannerImg">
          <div className="bannerText text-center">
            <div className="container">
              <h1>My Wallet</h1>
              <h2>Viewer</h2>
            </div>
          </div>
        </div>
        <div className="transactionDetails makePayment ">
          <div className="container">
            <div className="row paymentMode mb-op  row-eq-height">
              <div className="col-md-12" style={{ textAlign: "center" }}>
                <div className="transactionBox">
                  <label>Add Money to Wallet</label>
                </div>
              </div>
              <div className="col-md-12 paymentMethodCard">
                <div className="transactionBox">
                  {/* <label>Other payment methods</label> */}
                  <div className="row">
                    <div className="col-md-5">
                      <div className="transactionBox">
                        <label>Available Balance:</label>
                        <div className="paymentOption d-flex">
                          <label>£{this.state.showBal}.00</label>
                        </div>
                      </div>

                      {/* <InputGroup>
                        <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                        <Input
                          placeholder="Amount"
                          min={0}
                          max={100}
                          type="number"
                          step="1"
                        />
                        <InputGroupAddon addonType="append">
                          .00
                        </InputGroupAddon>
                      </InputGroup> */}
                    </div>
                  </div>

                  <div className="row cardDetail">
                    <div className="col-md-6">
                      <label>Enter the Amount </label>
                      <div className="form-input">
                        <input
                          type="number"
                          className="form-input-text"
                          placeholder="Amount"
                          name="amount"
                          //   value={this.state.formValues.service_charge}
                          onChange={this.inputChangedHandler}
                        />
                        <i class=" form-icon svg-icon">
                          <img src="./images/price-icon.svg" />{" "}
                        </i>
                      </div>
                    </div>
                    <div className="col-md-6" style={{ marginTop: "40px" }}>
                      <button
                        type="button"
                        className="blueinnerBtn text-center"
                        style={{ float: "right" }}
                        onClick={() => this.openModal()}
                      >
                        Add Money
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    {this.state.error !== "" ? (
                      <Alert color="danger">{this.state.error}</Alert>
                    ) : null}
                    {this.state.successMsg !== "" ? (
                      <Alert color="success">{this.state.successMsg}</Alert>
                    ) : null}
                  </div>
                  {/* Open the Payment Modal */}

                  <Modal
                    isOpen={this.state.showModal}
                    toggle={() => this.showToggle()}
                  >
                    <ModalHeader id="modal-header-css">
                      Are you sure you want to Add Money to Wallet?
                    </ModalHeader>
                    {/* <ModalBody>
                      <PaymentOption />
                    </ModalBody> */}
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
                        onClick={() =>
                          this.props.history.push({
                            pathname: routes.PAYMENT,
                            state: {
                              addMoney: this.state.amount,
                            },
                          })
                        }
                      >
                        Yes
                      </Button>
                    </ModalFooter>
                  </Modal>
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
export default wallet;
