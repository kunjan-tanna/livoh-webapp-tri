import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Link } from "react-router-dom";

class Leftbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="leftBar">
        <div className="logoLeft ">
          {/* <Link to={routes.DASHBOARD}>
           
          </Link> */}
          <img src="images/logo.svg" />
          {/* <a href="#"><img src="images/logo.svg" /></a> */}
        </div>
        <ul className="leftMenu">
          <li>
            <a href="">
              <i class="fas fa-user-circle"></i>
            </a>
          </li>
          <li>
            <a href="">
              <i class="fas fa-sign-out-alt"></i>
            </a>
          </li>
          {/* <li><Link to={routes.DASHBOARD}><i class="fas fa-user-circle"></i></Link></li> */}
          {/* <li><Link to={routes.DASHBOARD}><i class="fas fa-sign-out-alt"></i></Link></li> */}
        </ul>
      </div>
    );
  }
}

export default Leftbar;
