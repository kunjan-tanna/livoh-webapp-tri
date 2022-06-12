import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import { displayLog } from "../../util/functions";
import { Emit, GetResponse } from "../../util/connect-socket";
import Loader from "../Loader/Loader";
import { Input, Alert } from "reactstrap";
import moment from "moment";

class SubscriptionPurchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      subscribeData: [],
      hostDetails: {},
      openSub: false,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.getHostSubscriptionPlans();
    }, 500);
  }
  getHostSubscriptionPlans = () => {
    const hostId =
      this.props && this.props.location && this.props.location.state.hostId;
    const reqData = {
      eventName: "getHostSubscriptionPlans",
      host_id: hostId,
    };
    setTimeout(() => {
      Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });

        displayLog(res.code, res.message);
        if (res.code === 1) {
          // console.log("RESS", res);
          this.setState({ subscribeData: res.data.plans });
          this.setState({ hostDetails: res.data.hostDetails });
        }
      });
    }, 1000);
  };
  handleOption = () => {
    this.setState({ openSub: true });
  };
  render() {
    // console.log("SUBBBSS", this.state.openSub);
    let subscribeData =
      this.state.subscribeData && this.state.subscribeData.length > 0 ? (
        this.state.subscribeData.map((item, index) => (
          <div class="col-md-6" key={index}>
            <div class="transactionBox">
              <label>{item.name}</label>
              <h6>{item.currency}</h6>
              <span>
                1 {item.period} @ £{item.amount}
              </span>
              <div className="textOuter">
                <p>
                  {item.description ? item.description : "No Description Found"}
                </p>
                <p className="subDescription">
                  {item.sub_description
                    ? item.sub_description
                    : "No Description Found"}
                </p>
              </div>
              {/* <ul className="subscribeOffer">
                <li>Full access to videos</li>
                <li>Full access to music</li>
                <li>Full access to this users account</li>
                <li>Direct messages to this user</li>
                <li>Cancel your subscription at anytime</li>
              </ul> */}
              <button
                className="blueinnerBtn"
                onClick={() =>
                  this.props.history.push({
                    pathname: routes.PAYMENT,
                    state: {
                      spId: item && item.sp_id,
                      spAmount: item && item.amount,
                    },
                  })
                }
              >
                PLEASE ADD A PAYMENT CARD
              </button>
            </div>
          </div>
        ))
      ) : (
        <Alert color="danger">No Subscriptions Found!</Alert>
      );
    return (
      <div>
        <Header />
        <div className="minHeightOuter">
          {this.state.loading && <Loader />}
          <div className="subscribeBanner bannerImg">
            {this.state.loading && <Loader />}
            {/* <div className="bannerImg imagefill"> <img src="images/subscription-img.jpg"  /></div> */}
            <div className="bannerText text-center">
              <div className="container">
                <h1>Subscription Purchase</h1>
                <h2>Viewer</h2>
              </div>
            </div>
          </div>
          <div className="myEvent">
            <div className="container">
              <div className="eventOuter">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="position-relative">
                      <img
                        src={
                          this.state.hostDetails
                            ? this.state.hostDetails.profile_picture
                            : "images/default.png"
                        }
                        alt=""
                        className="img-fluid w-100 eventImg"
                      />
                      {/* <i className="linkIcon">
                        <img src="images/likeIcon.svg" alt="" />{" "}
                      </i> */}
                    </div>
                  </div>
                  <div className="col-md-9">
                    <h3>
                      {this.state.hostDetails.full_name
                        ? this.state.hostDetails.full_name
                        : "N/A"}
                    </h3>
                    <div className="labelOuter">
                      <span>
                        @
                        {this.state.hostDetails.username
                          ? this.state.hostDetails.username
                          : "N/A"}
                      </span>{" "}
                      <h4>
                        Member Since{" "}
                        {moment(
                          this.state.hostDetails
                            ? this.state.hostDetails.joining_Date
                            : ""
                        ).format("MMM YYYY")}
                      </h4>
                    </div>
                    <div className="textOuter">
                      <p>
                        {this.state.hostDetails.description
                          ? this.state.hostDetails.description
                          : "N/A"}
                      </p>
                    </div>
                    <div className="subscribe-link">
                      <a
                        title="Subscription_option"
                        className="textLink"
                        title="SUBSCRIPTION OPTIONS"
                        onClick={this.handleOption}
                      >
                        SUBSCRIPTION OPTIONS
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="subscribeOptions">
                {this.state.openSub == true ? (
                  <>
                    {" "}
                    <h5>Options available</h5>
                    <div className="row">{subscribeData}</div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default SubscriptionPurchase;
