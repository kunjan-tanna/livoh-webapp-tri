import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Link, withRouter, Redirect } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";
import { Emit, GetResponse } from "../../util/connect-socket";
import moment from "moment";
import Loader from "../Loader/Loader";
import history from "../../util/history";
import { displayLog } from "../../util/functions";
import alertify from "alertifyjs";
import { Input, Alert } from "reactstrap";
import ReactPaginate from "react-paginate";
//import 'alertifyjs/build/css/alertify.css';

class MySubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribeData: [],
      total: "",
      limit: 10,
      page_no: 1,
      loading: false,
      searchText: "",
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.getSubscriptionPlans();
    }, 500);
  }
  getSubscriptionPlans = () => {
    const reqData = {
      eventName: "getSubscriptionPlans",
    };
    setTimeout(() => {
      Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });

        displayLog(res.code, res.message);
        if (res.code === 1) {
          this.setState({ subscribeData: res.data.plans });
        }
      });
    }, 1000);
  };

  render() {
    let subscribeData =
      this.state.subscribeData && this.state.subscribeData.length > 0 ? (
        this.state.subscribeData.map((item, index) => (
          <div class="col-md-6" key={item.user_id}>
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
            </div>{" "}
          </div>
        ))
      ) : (
        <Alert color="danger">No Subscriptions Found!</Alert>
      );
    return (
      <div>
        <Header />
        <div className="minHeightOuter">
          <div className="transactionsBanner bannerImg">
            <div className="bannerText">
              <div className="container">
                <h1>My Subscriptions</h1>
                <h2>Host</h2>
              </div>
            </div>
          </div>

          <div className="myEvent">
            <div className="container">
              <div className="subscribeOptions">
                <h5>Options available</h5>
                <div class="row">
                  {" "}
                  {this.state.loading ? <Loader /> : subscribeData}
                </div>
              </div>
            </div>
            {/* {this.state.total > this.state.limit ? (
              <div className="Event_pagination">
                <ReactPaginate
                  pageCount={Math.ceil(this.state.total / this.state.limit)}
                  pageRangeDisplayed={1}
                  marginPagesDisplayed={2}
                  onPageChange={this.handlePageClick}
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  containerClassName={"pagination justify-content-end"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                  forcePage={this.state.page_no - 1}
                />
              </div>
            ) : null} */}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(MySubscription);
