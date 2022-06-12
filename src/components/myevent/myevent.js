import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Link, withRouter } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import { Emit, GetResponse } from "../../util/connect-socket";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Loader from "../Loader/Loader";
import { displayLog } from "../../util/functions";
import { Alert } from "reactstrap";

class Myevents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: [],
      total: "",
      limit: 10,
      page_no: 1,
      loading: false,
      streaming_channel_name: "",
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.getEvents();
    }, 500);
  }
  getEvents = async () => {
    let req_data = {
      page_no: this.state.page_no,
      limit: this.state.limit,
      sort: 1,
    };
    Emit("getMyEventList", req_data);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      if (res.code == 1) {
        this.setState({ formValues: res.data.events, total: res.data.total });
      } else if (res.code == 0) {
        displayLog(res.code, res.message);
      }
    });
  };
  handlePageClick = (e) => {
    this.setState({ page_no: e.selected + 1 }, () => {
      this.getEvents();
    });
  };

  handleJoin = (e) => {
    console.log(e);
    // Call API for start the Stream and pass event id
    let obj = {
      event_id: e.event_id,
    };
    console.log(obj);
    window.location.href = "meeting";
  };

  startEventHandler = (event_id) => {
    let req_data = {
      event_id: event_id,
      is_live: 1,
    };
    this.setState({ loading: true });
    setTimeout(() => {
      Emit("startStopEvent", req_data);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("STARTSTOPEVENT", res);
        displayLog(res.code, res.message);
        if (res.code == 1) {
          let req_data = {
            streaming_title: res.data.streaming_channel_name,
            streaming_channel_name: res.data.streaming_channel_name,
            streaming_mode_type: 2,
            streaming_type: 1,
            event_id: event_id,
          };
          Emit("startStreaming", req_data);
          GetResponse((res) => {
            // console.log("FINALL VIDWEO", res);
            if (res.code == 1) {
              this.props.history.push({
                pathname: routes.MEETING,
                // search: `?event_id=${event_id}`,
                state: {
                  Event_id: event_id,
                  streaming_channel_name: res.data.streaming_channel_name,
                  attendeeMode: "video",
                },
              });
            }
          });
        }
      });
    }, 1000);
  };

  render() {
    let eventlist =
      this.state.formValues && this.state.formValues.length > 0 ? (
        this.state.formValues.map((event, index) => (
          <div className="eventOuter" key={event.event_id}>
            <div className="row align-items-center">
              <div className="col-md-3">
                <img src={event.image} className="img-fluid w-100 eventImg" />
              </div>
              <div className="col-md-9">
                <h3>{event.name}</h3>
                <div className="labelOuter">
                  <label>£{event.price ? event.price : "0.00"}</label>
                  <h4>
                    {moment(event.date).format("MMMM ")}{" "}
                    {moment(event.date).format("D")}
                    <sup>th</sup> {moment(event.date).format("YYYY")}
                  </h4>
                </div>
                <div className="textOuter">
                  <p title={event.description}>{event.description}</p>
                </div>
                <div className="eventInfo">
                  <span>
                    <i className="fas fa-map-marker-alt i-icon"></i>
                    {event.location}
                  </span>
                  <span>
                    <i className="far fa-clock i-icon"></i>
                    {event.start_time} - {event.end_time}
                  </span>
                </div>
                <div className="linkOuter text-md-right">
                  <Link
                    to={{
                      pathname: `${routes.EDITEVENT}`,
                      search: `?event_id=${event.event_id}`,
                    }}
                    className="textLink mx-2"
                  >
                    Edit Event
                  </Link>
                  <Link
                    to={{
                      pathname: `${routes.VIEWEREVENT}`,
                      search: `?event_id=${event.event_id}`,
                    }}
                    className="textLink mx-2"
                  >
                    View Event
                  </Link>
                  <a
                    className="textLink"
                    onClick={() => this.startEventHandler(event.event_id)}
                  >
                    {" "}
                    Start Stream
                  </a>
                  {/* {this.state.streaming_channel_name ? (
                  <a
                    className="textLink"
                    onClick={() => this.startEventHandler(event.event_id)}
                  >
                    {" "}
                    Stop Stream
                  </a>
                ) : (
                  <a
                    className="textLink"
                    onClick={() => this.startEventHandler(event.event_id)}
                  >
                    {" "}
                    Start Stream
                  </a>
                )} */}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Alert color="danger">No Event Found!</Alert>
      );

    //console.log("map list", eventlist)
    return (
      <div>
        <Header />
        <div className="minHeightOuter">
          <div className="transactionsBanner bannerImg">
            <div className="bannerText">
              <div className="container">
                <h1>My Events</h1>
                <h2>Host</h2>
              </div>
            </div>
          </div>

          <div className="myEvent">
            <div className="container">
              {this.state.loading ? <Loader /> : eventlist}
            </div>
            {this.state.total > this.state.limit ? (
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
            ) : null}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(Myevents);
