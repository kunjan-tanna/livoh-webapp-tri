import React, { Component } from "react";
import routes from "../../Routes";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import { Alert } from "reactstrap";
import { Emit, GetResponse } from "../../util/connect-socket";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

class Forgotpwd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        email: "",
      },
      error: "",
      errorField: "",
      successmsg: "",
      loading: false,
    };
  }
  changeValuesHandler = (e) => {
    var formValues = this.state.formValues;
    var name = e.target.name;

    formValues[name] = e.target.value;
    this.setState({ formValues: formValues }, () => {
      // console.log(this.state.formValues);
    });
  };
  getnewPasswordHandler = () => {
    console.log(this.state.formValues);
    let obj = {
      email: this.state.formValues.email,
    };

    this.validateFormData(obj);
  };

  validateFormData = (body) => {
    let schema = Joi.object().keys({
      email: Joi.string().trim().email().required(),
    });
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        console.log("error", error.details[0].message);

        if (
          error.details[0].message !== this.state.error ||
          error.details[0].context.key !== this.state.errorField
        ) {
          let errorLog = functions.validateSchema(error);
          this.setState({
            error: errorLog.error,
            errorLog: errorLog.errorField,
          });
          // console.log("error is 63 ", this.state.error);
        }
      } else {
        this.setState({ error: "", errorLog: "" });
        let reqData = {
          email: body.email,
        };
        //  console.log("11111111111111", ...reqData)
        this.forgotpasswordReq(reqData);
        this.setState({ loading: true });
      }
    });
  };
  forgotpasswordReq = async () => {
    let reqData = {
      email: this.state.formValues.email,
    };
    //api
    Emit("forgotPassword", reqData);
    //getting response
    GetResponse((response) => {
      this.setState({ loading: false });
      console.log("$$$$$$$ res->", response);
      if (response.code == 1) {
        //this.showModal();
        this.setState({ successmsg: response.message });
      }
      if (response.code == 0) {
        //this.setState({ error: response.message })
      }
    });
  };

  render() {
    return (
      <div className="forgotMain loginMain d-md-flex">
        {this.state.loading && <Loader />}
        <div className="loginLeft d-flex justify-content-center align-items-center">
          <div
            className="welcomeMsg text-center wow fadeInUp"
            data-wow-delay="0.3s"
          >
            <img src="images/logo.svg" />
          </div>
        </div>

        <div className="signinForm d-flex justify-content-center align-items-center">
          <div className="canceliconsLeftMenu">
            <Link to={routes.SIGNIN}>
              <img src="images/cancel.svg" />
              <img src="images/cancel-white.svg" className="cancelWhite" />
            </Link>
          </div>
          <div className="formMain">
            <h2 className="textWhite">
              LivOH is a live streaming video platform Start your streaming
              today.
            </h2>
            <div
              className="form text-center wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="field position-relative fieldIcon">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="input-text"
                  onChange={this.changeValuesHandler}
                  value={this.state.formValues.email}
                />
                <i className="far fa-envelope position-absolute f-icon"></i>
              </div>
              <p className="infotext textWhite">
                Please enter your email address. You will receive a email
                message with instructions on how to reset your password.
              </p>
              <div>
                {this.state.error !== "" ? (
                  <Alert color="danger">{this.state.error}</Alert>
                ) : null}
                {this.state.successmsg !== "" ? (
                  <Alert color="success">{this.state.successmsg}</Alert>
                ) : null}
              </div>
              <button
                type="button"
                className="blueBtn text-center"
                onClick={this.getnewPasswordHandler}
              >
                Get New Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Forgotpwd;
