import React, { useState, useEffect } from "react";
import { NavLink, Redirect, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import history from "../../util/history";
import routes from "../../Routes";

const ChooseAccount = (props) => {
  const viewerAcc = (e) => {
    props.history.push({
      pathname: routes.SIGNUP,
      state: { role: +e.target.value },
    });
  };
  const hostAcc = (e) => {
    props.history.push({
      pathname: routes.SIGNUP,
      state: { role: +e.target.value },
    });
  };
  return (
    <div className="signupMain d-md-flex">
      <div className="loginLeft d-flex justify-content-center align-items-center">
        <div
          className="welcomeMsg text-center wow fadeInUp"
          data-wow-delay="0.3s"
        >
          <img src="images/logo.svg" />
        </div>
      </div>
      <div className="signinForm chooseAccount d-flex justify-content-center align-items-center">
        <div className="formMain">
          <h2>
            Choose the account type you would like <br /> To use on LivOH
          </h2>
          <div className="d-flex form row">
            <div className="col-md-6">
              {" "}
              <button
                type="button"
                name="viewer"
                value="1"
                className="blueBtn text-center"
                onClick={(e) => viewerAcc(e)}
              >
                Viewer Account
              </button>{" "}
            </div>
            <div className="col-md-6">
              {" "}
              <button
                type="button"
                name="host"
                value="2"
                className="blueBtn text-center"
                onClick={(e) => hostAcc(e)}
              >
                Host Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(ChooseAccount);
