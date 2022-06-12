import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import Header from "../headerNew/headerNew";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import { Emit, GetResponse } from "../../util/connect-socket";
import Loader from "../Loader/Loader";
//import { Link } from "@material-ui/core";
import { Alert } from "reactstrap";
import moment from "moment";
import DatePicker from "react-datepicker";
import { displayLog } from "../../util/functions";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {
        location: "",
        event_date: "",
      },
      loading: false,
      page_no: 1,
      limit: 6,
      upcomingEvent: [],
      featuredEvent: [],
      setTime: "",
      total: 0,
      loadMore: false,
    };
  }
  // componentWillMount() {
  //   this.getFeaturedEvents();
  // }
  async componentDidMount() {
    this.setState({ loading: true });

    await this.getUpcomingEvents();
    await this.getFeaturedEvents();
    // setTimeout(() => {}, 2000);

    // await this.getFeaturedEvents();
  }

  getUpcomingEvents = () => {
    // Type 1: upcoming event
    // Type 2: featured Event
    let req_data = {
      page_no: this.state.page_no,
      limit: this.state.limit,
      type: 1,
    };
    console.log("BODYYY-----------", req_data);
    Emit("getEventListWithoutLogin", req_data);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->----kkkk", res);
      if (res.code === 1) {
        this.setState({ upcomingEvent: res.data.events });
        this.setState({ total: res.data.total });
      }
      if (res.code === 401) {
        localStorage.clear();
      }
    });
  };
  getFeaturedEvents = async () => {
    this.setState({ loading: true });
    // Type 1: upcoming event
    // Type 2: featured Event
    let req_data = {
      page_no: this.state.page_no,
      limit: this.state.limit,
      type: 2,
    };
    console.log("BODYY", req_data);
    setTimeout(() => {
      Emit("getEventListWithoutLogin", req_data);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("The res is-->----kkkk", res);
        if (res.code === 1) {
          this.setState({ featuredEvent: res.data.events });
        }
        if (res.code === 401) {
          localStorage.clear();
        }
      });
    }, 2000);
  };

  changestartTime = (date, name) => {
    let form = this.state.formValues;
    form["event_date"] = moment(date).format("YYYY-MM-DD");
    this.setState({ formValues: form, eventdate: date });
  };
  inputChangedHandler = (e) => {
    let name = e.target.name;
    let form = this.state.formValues;

    if (name == "email") {
      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    // console.log("form data", form);
    // console.log("time ", this.state.formValues.end_time.replace(/:/g, ""));

    this.setState({ formValues: form });
  };
  handleFilter = () => {
    let reqdata = {
      location: this.state.formValues.location,
      date: this.state.formValues.event_date,
      page_no: 1,
      limit: this.state.limit,
      type: 1,
    };
    console.log("BODY", reqdata);
    Emit("getEventListWithoutLogin", reqdata);
    GetResponse((res) => {
      // this.setState({ loading: false });
      console.log("The res is-->----kkkk", res);
      if (res.code === 1) {
        this.setState({ upcomingEvent: res.data.events });
        // displayLog(res.code, res.message);
      } else if (res.code === 0) {
        this.setState({ upcomingEvent: [] });
        displayLog(res.code, res.message);
      }
    });
  };
  handleClick = (eId) => {
    console.log("EIDD", eId);
    this.props.history.push({
      pathname: routes.VIEWEREVENTWITHOUTLOGIN,
      search: `?event_id=${eId}`,
    });
  };
  //pagination upcoming event
  handleMore = (e) => {
    // console.log("HELLO", Math.ceil(this.state.total / this.state.limit));
    // this.setState({ loading: true });
    this.setState({ page_no: this.state.page_no + 1 }, () => {
      this.getUpcomingEvents();
      this.setState({ loadMore: true });
    });
    // const upcomingEvent = this.state.upcomingEvent.length;
    // console.log("LENG", upcomingEvent);
  };
  handleBack = () => {
    this.setState({ page_no: this.state.page_no - 1 }, () => {
      this.getUpcomingEvents();
    });
  };

  render() {
    // console.log("UPCOMINGEVENTS", this.state.upcomingEvent);

    let upcomingEvent =
      this.state.upcomingEvent && this.state.upcomingEvent.length > 0 ? (
        this.state.upcomingEvent.map((item, index) => (
          <div className="col-md-6 col-lg-4">
            <div
              className="upcomingEventBox"
              key={index}
              onClick={() => this.handleClick(item.event_id)}
            >
              <div className="upcomingEventPicture">
                <img src={item.image} alt="" className="img-fluid w-100" />
                <div className="price-like">
                  <label>£{item.price}</label>
                </div>
              </div>
              <div className="upcomingEventDetail">
                <div className="upcomingEventDate">
                  <span> {moment(item.date).format("MMM")}</span>
                  <label>{moment(item.date).format("DD")}</label>
                </div>
                <div className="upcomingEventRight">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="location-time">
                    <span>
                      <i class="fas fa-map-marker-alt"></i>
                      {item.location}
                    </span>
                    {/* <span>
                    <i className="far fa-clock"></i>
                    {moment(item.start_time).format("h:mm a")} - 1am
                  </span> */}
                    <span>
                      <i className="far fa-clock"></i>
                      {/* {console.log("ggg", item.start_time)} */}
                      {/* {item.start_time} - {item.end_time} */}
                      {moment(item.start_time, "HH:mm:ss").format(
                        "hh:mm A"
                      )} - {moment(item.end_time, "HH:mm:ss").format("hh:mm A")}
                      {/* {startTime.map((item) => moment(item).format("LT"))}-{" "} */}
                      {/* {endTime.map((item) => moment(item).format("LT"))} */}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Alert color="danger">No Upcoming Events Found!</Alert>
      );
    //Feature Event

    let featuredEvent =
      this.state.featuredEvent && this.state.featuredEvent.length > 0
        ? this.state.featuredEvent.map((item, index) => (
            <div
              className="upcomingEventBox"
              key={index}
              onClick={() => this.handleClick(item.event_id)}
            >
              <div className="upcomingEventPicture">
                <img
                  src={item.image ? item.image : "images/featured-events01.png"}
                  alt=""
                  className="img-fluid w-100"
                />
                <div className="price-like">
                  <label>£{item.price}</label>
                  {/* <NavLink to="">
                  <i className="fas fa-heart"></i>
                </NavLink> */}
                </div>
                <div className="featuredEventsDate">
                  <span>{moment(item.date).format("MMM")}</span>
                  <label>{moment(item.date).format("DD")}</label>
                </div>
              </div>
              <div className="upcomingEventDetail">
                <div className="upcomingEventRight">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="location-time">
                    <span>
                      <i className="fas fa-map-marker-alt"></i> {item.location}
                    </span>
                    <span>
                      <i className="far fa-clock"></i>
                      {moment(item.start_time, "HH:mm:ss").format(
                        "hh:mm A"
                      )} - {moment(item.end_time, "HH:mm:ss").format("hh:mm A")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        : "";
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}
        <>
          <div className="homeBanner">
            <div className="homeBannerText">
              <h1>
                The new normal
                <br /> in all events
              </h1>
              <p>
                LivOH provides an interactive virtual solution for events.
                <br /> It is an all-in-one ticketed online events platform
                <br /> designed to connect audiences
              </p>
            </div>
            <div className="homeBannerArrow">
              <a href="#down">
                <i className="far fa-arrow-alt-circle-down"></i>
              </a>
            </div>
          </div>
          <div className="homeFilter" id="down">
            <div className="container">
              <div className="homeFilterRow">
                <div className="homeFilterBox">
                  <label>Location</label>
                  <div className="custom-select-box">
                    <select
                      value={this.state.formValues.location}
                      name="location"
                      onChange={this.inputChangedHandler}
                    >
                      <option value="">Enter Location</option>
                      <option value="India">India</option>
                      <option value="Us">Us</option>
                      <option value="Australia">Australia</option>
                    </select>
                    {/* <select>
                      <option value="" selected>
                        Any location
                      </option>
                      <option value="">Location 1</option>
                      <option value="">Location 2</option>
                    </select> */}
                  </div>
                </div>

                <div className="homeFilterBox filterDate">
                  <label>Date</label>

                  <div className="custom-select-box">
                    <DatePicker
                      // className="form-input-text"
                      selected={this.state.eventdate}
                      onChange={(date) =>
                        this.changestartTime(date, "event_date")
                      }
                      placeholderText="Event Date"
                      minDate={new Date()}
                      showYearDropdown
                      //showMonthDropdown
                    />
                    {/* <select>
                      <option value="" selected>
                        Any date
                      </option>
                      <option value="">Date 1</option>
                      <option value="">Date 2</option>
                    </select> */}
                  </div>
                </div>
                <div className="homeFilterBox FilterSearch">
                  <button
                    type="submit"
                    className="btnFilterSearch"
                    onClick={() => this.handleFilter()}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="upcomingEvents">
            <div className="container">
              <div className="upcomingEventsHeader">
                <h3>Upcoming Events</h3>
                {/* <div className="eventFilter">
                  <div className="custom-select-box mb-0">
                    <select>
                      <option value="" selected>
                        Weekdays
                      </option>
                      <option value="">Sunday</option>
                      <option value="">Monday</option>
                    </select>
                  </div>
                  <div className="custom-select-box mb-0">
                    <select>
                      <option value="" selected>
                        Event Type
                      </option>
                      <option value="">Event Type</option>
                      <option value="">Event Type</option>
                    </select>
                  </div>
                </div> */}
              </div>
              <div className="upcomingEventsContent">
                <div className="row">
                  {upcomingEvent}
                  {this.state.upcomingEvent.length == 6 ? (
                    <div className="col-md-12 text-center">
                      <button
                        className="btnLoadMore"
                        onClick={(event) => this.handleMore(event)}
                      >
                        LOAD MORE
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  {this.state.loadMore == true &&
                  this.state.page_no ==
                    Math.ceil(this.state.total / this.state.limit) ? (
                    <div className="col-md-12 text-center">
                      <button
                        className="btnLoadMore"
                        onClick={(event) => this.handleBack(event)}
                      >
                        Back
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="fullCenterSection nextEventToday">
            <div className="container">
              <h3>Build your next event today</h3>
              <p>
                LivOH is your on stop shop for delivering all
                <br /> types of online events.
              </p>
              <button className="btnWhite">GET IN TOUCH</button>
            </div>
          </div> */}
          <div className="featuredEvents">
            <div className="container">
              <h3 className="title">Featured Events</h3>
              {featuredEvent}
            </div>
          </div>
          {/* <div className="fullCenterSection joinRevolution">
            <div className="container">
              <h3>Join The Revolution</h3>
              <p>Find out why so many people are joining the platform<br /> and how it works</p>
              <button className="btnWhite">FIND OUT MORE</button>
            </div>
          </div> */}
        </>
        <Footer />
      </div>
    );
  }
}

export default Home;
