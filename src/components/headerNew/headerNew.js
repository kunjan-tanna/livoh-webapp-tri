import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Link, withRouter, Router } from "react-router-dom";

import ScrollToTop from "../../ScrollToTop";
class Header extends Component {
  // componentWillMount() {
  //   window.scrollTo(0, 0);
  // }
  // componentDidMount() {
  //   console.log("HELLO-----");
  //   window.scrollTo(0, 0);
  // }
  //handle the login button
  handleLogin() {
    const eventID = localStorage.getItem("eventId");

    if (eventID) {
      localStorage.removeItem("eventId");
    }
    this.props.history.push(routes.SIGNIN);
  }
  render() {
    // console.log("HELLO", this.state.openSubMenu);
    return (
      <header>
        <ScrollToTop />
        <div className="row align-items-center">
          <div className="logoLeft col-md-2 col-3">
            <Link to={routes.DASHBOARD}>
              <img src="images/logo.svg" />
            </Link>
            {/* <a href={routes.DASHBOARD}><img src="images/logo.svg" /></a> */}
          </div>
          <div className="col-md-10 col-9 d-flex justify-content-end align-items-center">
            <button className="btnPurple" onClick={() => this.handleLogin()}>
              Login
            </button>
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(Header);
