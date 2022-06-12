import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Redirect } from "react-router-dom";
import { Emit, GetResponse } from "../../util/connect-socket";
import Header from "../header/header";
import Dropzone from "react-dropzone";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import { Alert, Input } from "reactstrap";
import queryString from "query-string";
import moment from "moment";
import Loader from "../Loader/Loader";
import ErrorImage from "../../assets/default.png";
import alertify from "alertifyjs";
import { displayLog } from "../../util/functions";
import { Event_constant } from "../../util/constant";
import DatePicker from "react-datepicker";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";
import Userinfo from "../../constants/Dashboard";

import "react-datepicker/dist/react-datepicker.css";
import { Link } from "@material-ui/core";

class Viewevent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      formValues: {
        name: "",
        location: "",
        date: "",
        start_time: "",
        end_time: "",
        image: "",
        description: "",

        ticket_type: "",
        ticket_name: "",
        quantity: "",
        service_charge: "",
        price: "",
        ticket_description: "",
        twitter_handle: "",
        instagram_handle: "",
      },
      img: [],
      image_data: "",
      image_name: "",
      error: "",
      errorevent: "",
      fileerror: "",
      errorField: "",
      successMsg: "",
      starttime: "",
      endtime: "",
      eventdate: "",
      showremove: false,
    };
    this.params = queryString.parse(this.props.location.search);
  }
  componentDidMount() {
    let reqData = { event_id: this.params.event_id };

    this.setState({ loading: true });
    Emit("getEventDetailsById", reqData);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->EVENTDETAILSSS", res);
      if (res.code === 1) {
        this.setState({
          formValues: res.data.events,
          image_name: "Image.png",
          eventdate: new Date(res.data.events.date),
          starttime: new Date(`2021-05-31T${res.data.events.start_time}:00.00`),
          endtime: new Date(`2021-05-31T${res.data.events.end_time}:00.00`),
        });
      }
      if (res.code === 401) {
        localStorage.clear();
      }
      if (res.code === 0) {
        // alertify.error(res.message);
        //this.setState({ errorevent: res.message })
        displayLog(res.code, res.message);
        // setTimeout(() => {
        //   window.location.href = routes.MYEVENT;
        // }, 2000);
      }
    });
  }
  render() {
    //Display the Total Amount - from Viewer
    const AddAmount =
      +this.state.formValues.price + +this.state.formValues.service_charge;
    const totalAmount = Math.round(AddAmount);

    return (
      <div>
        {this.state.loading && <Loader />}
        <Header />

        <div className="addeventBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              <h1>View Event</h1>
              {localStorage.getItem("role") == 1 ? (
                <h2>Viewer</h2>
              ) : (
                <h2>Host</h2>
              )}
            </div>
          </div>
        </div>

        <div className="outerProfile">
          <div className="container">
            <div className="eventFrom">
              {" "}
              <h3>EVENT INFORMATION</h3>
            </div>
            {/* <img src="images/img01.jpg" alt="" className="img-fluid" /> */}

            <div className="uploadPhotoOuter">
              <img
                src={this.state.formValues.image || "images/default.png"}
                className="event_uploaded_img"
                // className="uploaded_img"
                // style={{
                //   width: "160px !important",
                //   height: "170px",
                //   borderRadius: "3%",
                // }}
              />
              <button
                type="button"
                className="blueinnerBtn text-center"
                style={{ float: "right" }}
                onClick={() => this.props.history.push(routes.UPCOMINGEVENTS)}
              >
                Back
              </button>

              {/* <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png image/jpeg image/jpg "
                onChange={this.loadFile}
                style={{ display: "none" }}
              />
              <label
                className="uploadImg"
                for="avatar"
                style={{ cursor: "pointer" }}
              >
                Upload Image{" "}
                <img src="images/upload-icon.svg" className="uploadIcon" />
              </label>
              <button
                type="button"
                className="blueinnerBtn text-center"
                onClick={() =>
                  this.setState({ showremove: !this.state.showremove })
                }
              >
                Remove
              </button> */}
            </div>

            <div className="userBioDetail">
              <div className="row row-eq-height">
                <div className="col-md-4 bioDetail-4">
                  <label>full name</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.name || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>Event Date</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {moment(this.state.formValues.date).format("MM-DD-YYYY") ||
                      moment("11-11-1111").format("MM-DD-YYYY")}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>description</label>
                  <span style={{ wordBreak: "break-all" }} className="ellipsis">
                    {this.state.formValues.description || Userinfo.Userinfo}
                  </span>
                </div>

                <div className="col-md-4 bioDetail-4 mb-md-5">
                  <label>Start Time</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {moment(
                      this.state.formValues.start_time,
                      "HH:mm:ss"
                    ).format("hh:mm A")}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>End Time</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {moment(this.state.formValues.end_time, "HH:mm:ss").format(
                      "hh:mm A"
                    )}
                    {/* {this.state.formValues.end_time || Userinfo.Userinfo} */}
                  </span>
                </div>
              </div>
            </div>
            <div className="eventFrom" style={{ paddingBottom: "0px" }}>
              {" "}
              <h3>TICKET INFORMATION</h3>
              {console.log("TICKET NAMWE", this.state.formValues)}
            </div>
            <div className="userBioDetail" style={{ marginTop: "30px" }}>
              <div className="row row-eq-height">
                <div className="col-md-6 bioDetail-4">
                  <label>Ticket name</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.ticket_name || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-6 bioDetail-4">
                  <label>quantity</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.quantity || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-6 bioDetail-4">
                  <label>service charge</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.service_charge || Userinfo.Userinfo}
                  </span>
                </div>

                <div className="col-md-6 bioDetail-4 mb-md-5">
                  <label>price</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.price || Userinfo.Userinfo}
                  </span>
                </div>
              </div>
            </div>
            {localStorage.getItem("role") == 1 ? (
              <div className="eventFrom">
                {" "}
                <h3>
                  Total Amount :<b> {totalAmount}</b>{" "}
                </h3>
              </div>
            ) : null}

            <div>
              {this.state.error !== "" ? (
                <Alert color="danger">{this.state.error}</Alert>
              ) : null}
              {this.state.successMsg !== "" ? (
                <Alert color="success">{this.state.successMsg}</Alert>
              ) : null}
            </div>
            <div className="row button-outer">
              {localStorage.getItem("role") == 1 ? (
                <>
                  {" "}
                  <div className="col-6">
                    {this.state.formValues.purchased_ticket == 0 ? (
                      <button
                        type="button"
                        className="pinkBtn text-center"
                        onClick={() =>
                          this.props.history.push({
                            pathname: routes.PAYMENT,
                            state: {
                              amount: totalAmount,
                              eventId:
                                this.state.formValues &&
                                this.state.formValues.event_id,
                            },
                          })
                        }
                      >
                        Ticket Purchase
                      </button>
                    ) : null}
                  </div>
                  <div className="col-6">
                    {this.state.formValues.purchased_subscription == 0 ? (
                      <button
                        type="button"
                        className="blueinnerBtn text-center"
                        onClick={() =>
                          this.props.history.push({
                            pathname: routes.SUBSCRIPTIONPURCHASE,
                            state: {
                              hostId:
                                this.state.formValues &&
                                this.state.formValues.host_id,
                            },
                          })
                        }
                      >
                        Subscriptions Purchase
                      </button>
                    ) : null}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {this.state.errorevent !== "" ? (
          <div className="text-center">
            <Alert color="danger">{this.state.errorevent}</Alert>
          </div>
        ) : null}
        <Footer />
      </div>
    );
  }
}
export default Viewevent;
