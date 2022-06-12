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

class SubscriptionList extends Component {
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
      this.getHostSubscriptionPlans();
    }, 500);
  }
  getHostSubscriptionPlans = async () => {
    let reqData = {
      eventName: "getSubscribedPlans",
    };

    Emit("event", reqData);
    GetResponse((res) => {
      this.setState({ loading: false });

      displayLog(res.code, res.message);
      if (res.code === 1) {
        console.log("RESS", res);
        this.setState({ subscribeData: res.data.subscriptions });
        // this.setState({ hostDetails: res.data.hostDetails });
      }
    });
  };
  render() {
    let subscribeData =
      this.state.subscribeData && this.state.subscribeData.length > 0 ? (
        this.state.subscribeData.map((item, index) => (
          <div className="row align-items-center" key={index}>
            <div className="col-md-3">
              <div className="position-relative">
                <img
                  src={item ? item.profile_picture : "images/default.png"}
                  alt=""
                  className="img-fluid w-100 eventImg"
                />
                {/* <i className="linkIcon">
                  <img src="images/likeIcon.svg" alt="" />{" "}
                </i> */}
              </div>
            </div>
            <div className="col-md-9">
              <h3>{item.full_name}</h3>
              <div className="labelOuter">
                <span>@{item.username}</span>{" "}
                <h4>
                  Member Since{" "}
                  {moment(item ? item.joining_date : "").format("MMM YYYY")}
                </h4>
              </div>
              <div className="textOuter">
                <p>{item.description}</p>
              </div>
              {/* <div className="subscribe-link">
                <a href="#" className="textLink" title="SUBSCRIPTION OPTIONS">
                  SUBSCRIPTION OPTIONS
                </a>
              </div> */}
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
          <div className="transactionsBanner bannerImg">
            <div className="bannerText">
              <div className="container">
                <h1>Subscriptions</h1>
                <h2>Viewer</h2>
              </div>
            </div>
          </div>

          <div className="myEvent">
            <div className="container">
              <div className="eventOuter">
                {" "}
                {this.state.loading ? <Loader /> : subscribeData}
              </div>
              {/* <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="position-relative">
                      <img
                        src="images/img08.jpg"
                        alt=""
                        className="img-fluid w-100 eventImg"
                      />
                      <i className="linkIcon">
                        <img src="images/likeIcon.svg" alt="" />{" "}
                      </i>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <h3>GHETTS</h3>
                    <div className="labelOuter">
                      <span>@realghetts</span> <h4>Member Since Aug 2020</h4>
                    </div>
                    <div className="textOuter">
                      <p>
                        Management: trenton@metmgmt.com #ConflictOfInterest OUT
                        NOW https://ghetts.co/conflictofinterest-itunes
                      </p>
                    </div>
                    <div className="subscribe-link">
                      <a
                        href="#"
                        className="textLink"
                        title="SUBSCRIPTION OPTIONS"
                      >
                        SUBSCRIPTION OPTIONS
                      </a>
                    </div>
                  </div>
                </div> */}
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

export default withRouter(SubscriptionList);
