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

class Upcomingevent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: [],
      searchData: [],
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
      this.getUpcomingEvents();
    }, 500);
  }
  getUpcomingEvents = async () => {
    let req_data = {
      page_no: this.state.page_no,
      limit: this.state.limit,
      sort: 1,
    };
    // console.log("REWWW", req_data);
    // this.state.searchText !== ""
    //   ? (req_data.search = this.state.searchText)
    //   : null;
    Emit("getEventListForClient", req_data);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->kk", res);
      if (res.code == 1) {
        this.setState({
          formValues: res.data.events,
          total: res.data.total,
        });
      } else {
        alertify.error(res.message);
      }
    });
  };

  RegisterEventHandler = (event_id) => {
    let req_data = {
      event_id: event_id,
    };
    Emit("registerForEvent", req_data);
    this.setState({ loading: true });

    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      displayLog(res.code, res.message);
      if (res.code == 1) {
        this.props.history.push({
          pathname: routes.VIEWEREVENT,
          search: `?event_id=${event_id}`,
        });
      } else if (res.code == 0) {
      }
    });
  };
  joinEventHandler = (event_id) => {
    let req_data = {
      streaming_id: event_id,
      streaming_channel_name: `stream-livoh-${event_id}`,
    };
    this.setState({ loading: true });
    setTimeout(() => {
      Emit("joinStreaming", req_data);

      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("The res is-->kunjj", res);
        displayLog(res.code, res.message);
        if (res.code == 1) {
          // history.push(routes.LIVEEVENT);
          this.props.history.push({
            pathname: routes.MEETING,
            // search: '?id',
            state: {
              Event_id: event_id,
              streaming_channel_name: `stream-livoh-${event_id}`,
              attendeeMode: "audience",
            },
          });
        }
      });
    }, 1000);
  };
  //Search the Event
  enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      this.getUpcomingEvents();
    }
  };
  onSearch = (event) => {
    if (event.target.value.length > 2) {
      this.setState({
        searchText: event.target.value.trimStart(),
        page_no: 1,
        loading: false,
      });
    } else if (event.target.value.length == 0) {
      this.setState({ searchText: "", page_no: 1 });
    }
  };

  render() {
    //Get the Search Listing
    let searchEventList = this.state.formValues.filter((event, index) => {
      return (
        event.name
          .toLowerCase()
          .indexOf(this.state.searchText.toLowerCase()) !== -1
      );
    });

    let eventlist =
      searchEventList && searchEventList.length > 0 ? (
        searchEventList.map((event, index) => (
          <div className="UpcomingeventOuter col-md-6" key={event.event_id}>
            <div className="row">
              <div className="col-md-4 pr-md-0">
                <img src={event.image} className="img-fluid w-90 eventImg" />
              </div>
              <div className="col-md-8 pl-md-0">
                <div className="upcomingEventMd9">
                  <h3>{event.name}</h3>
                  {event.is_live ? (
                    <span className="liveEventText ">Live</span>
                  ) : null}
                  <div className="labelOuter">
                    <label>£{event.price}</label>
                    <h4>
                      {moment(event.date).format("MMMM ")}{" "}
                      {moment(event.date).format("D")}
                      <sup>
                        {moment(event.date).format("Do").replace(/\d/g, "")}
                      </sup>{" "}
                      {moment(event.date).format("YYYY")}
                    </h4>
                  </div>
                  <div className="textOuter">
                    <p title={event.description} className="ellipsis">
                      {event.description}
                    </p>
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
                  <div className="linkOuter">
                    {/* If When user First time Register */}
                    {!event.joined ? (
                      <a
                        title="Register Event"
                        className="textLink"
                        onClick={() =>
                          this.RegisterEventHandler(event.event_id)
                        }
                      >
                        Register{" "}
                      </a>
                    ) : null}
                    {/* If When User is Joined but not the Purchase TIcket */}
                    {event.joined &&
                    !event.purchased_ticket &&
                    !event.purchased_subscription ? (
                      <a
                        title="View Event"
                        className="textLink"
                        onClick={() =>
                          this.props.history.push({
                            pathname: routes.VIEWEREVENT,
                            search: `?event_id=${event.event_id}`,
                          })
                        }
                      >
                        View Event
                      </a>
                    ) : null}
                    {/* If When User is Joined && purchase the ticket  */}
                    {(event.joined && event.purchased_ticket) ||
                    event.purchased_subscription ? (
                      <>
                        {" "}
                        <a
                          title="Join Event"
                          className="textLink"
                          onClick={() => this.joinEventHandler(event.event_id)}
                        >
                          Join Event
                        </a>
                        {/* <a
                          title="View Event"
                          className="textLink"
                          onClick={() =>
                            this.props.history.push({
                              pathname: routes.VIEWEREVENT,
                              search: `?event_id=${event.event_id}`,
                            })
                          }
                        >
                          View Event
                        </a>{" "} */}
                      </>
                    ) : null}
                    {/* This is used for temp */}
                    {/* {event.joined && event.is_live ? (
                      <a
                        title="Join Event"
                        className="textLink"
                        onClick={() => this.joinEventHandler(event.event_id)}
                      >
                        Join Event
                      </a>
                    ) : null} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No Upcoming Events found</p>
      );

    return (
      <div>
        <Header />
        <div className="minHeightOuter">
          <div className="transactionsBanner bannerImg">
            <div className="bannerText">
              <div className="container">
                <h1>My Upcoming Shows</h1>
                <h2>Viewer</h2>
              </div>
            </div>
          </div>

          <div>
            <div className="container">
              <div className="row cardButton">
                <div className="col-md-9"></div>
                <div className="col-md-3">
                  <Input
                    type="text"
                    name="search"
                    style={{ marginBottom: "20px", padding: "10px" }}
                    id="search-todo"
                    size="small"
                    placeholder="Search by Event Name"
                    onKeyPress={(e) => this.enterPressed(e)}
                    onChange={(e) => this.onSearch(e)}
                    //   value={this.state.searchText}
                  />
                </div>
              </div>

              <div className="eventUpComing">
                <div className="row row-eq-height">
                  {" "}
                  {this.state.loading ? <Loader /> : eventlist}
                </div>
              </div>
              {/* {eventlist} */}
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

export default withRouter(Upcomingevent);
