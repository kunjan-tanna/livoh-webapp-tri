import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, withRouter } from "react-router-dom";
import Leftbar from "../leftbar/leftbar";
import Topbar from "../topbar/topbar";
import Livechat from "../livechat/livechat";

class Liveevent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    //const id = this.props.location.state.Event_id;
    //console.log("id", id)
    return (
      <div className="liveEventOuter">
        <Leftbar />
        <Topbar />
        <div className="eventVideo">
          <img src="./images/bg.jpg" className="img-fluid" />
        </div>
        <Livechat />
        <div className="centerButton">
          <button className="pinkSmallBtn">
            OFFERING{" "}
            <i class="offering-icon">
              {" "}
              <img src="./images/offering.svg" />
            </i>
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Liveevent);
