import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Link } from "react-router-dom";
import { Emit, GetResponse } from "../../util/connect-socket";
import { displayLog } from "../../util/functions";

class Topbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: "",
      image: "",
    };
  }

  render() {
    console.log("PROPPPSSS KUNJAN", this.props);
    return (
      <div className="topBarOuter">
        <div className="d-flex  align-items-center topBarOuterBox">
          <div className=" d-none d-md-flex align-items-center">
            <div className="eventLogo">
              <img src={this.props.image || ""} className="img-fluid" />
            </div>
            <div className="eventName">
              <h2>{this.props.eventName.toUpperCase() || ""}</h2>
              <label>{this.props.eventName ? "LIVE NOW" : null}</label>
            </div>

            {/* <ul className="topBarMenu d-flex">
              <li>
                <a href="#" title="Events">
                  Events
                </a>
              </li>
            </ul> */}
          </div>
          <div className="logoLeft d-md-none d-block">
            <Link to={routes.DASHBOARD}>
              <img src="images/logo.svg" />
            </Link>
          </div>
          <div className="d-flex  justify-content-end">
            <div className="topOuterButton  d-flex align-items-center">
              {this.props.attendeeMode == "video" ? (
                <>
                  {" "}
                  <button className="greenSmallBtn ml-0 d-none">follow</button>
                  <button className="blueSmallBtn  d-none">
                    subscribe
                  </button>{" "}
                </>
              ) : null}
              {this.props.attendeeMode == "audience" ? (
                <>
                  {" "}
                  <button className="greenSmallBtn ml-0">follow</button>
                  <button className="blueSmallBtn">subscribe</button>{" "}
                </>
              ) : null}

              {this.props.showlivecount && (
                <label className="d-none d-md-flex ">
                  <i class="far fa-eye"></i>
                  {this.props.totalViewers}
                </label>
              )}
            </div>
            <div className="topBaruserPhoto d-flex align-items-center">
              <div className="userOption">
                <label>
                  {localStorage.getItem("username") &&
                  localStorage.getItem("username").includes("null")
                    ? ""
                    : localStorage.getItem("username")}
                </label>

                {/* <div className="userIcon justify-content-end d-flex">
						  <a href="#" title=""><i class="fas fa-bell"></i></a>
						  <a href="#" title=""><i class="fas fa-envelope"></i></a>
						</div> */}
              </div>
              <div className="userPic">
                {/* <img src="images/user-img.png" className="img-fluid" /> */}
                <img
                  src={
                    localStorage.getItem("profile_picture") &&
                    localStorage.getItem("profile_picture") != "null"
                      ? localStorage.getItem("profile_picture")
                      : "images/default.png"
                  }
                  className="img-fluid"
                />
              </div>
              <a className="logoutClass d-md-none d-block">
                <i class="fas fa-sign-out-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;
