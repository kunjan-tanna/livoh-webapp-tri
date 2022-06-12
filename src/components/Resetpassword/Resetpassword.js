import React, { useState, useEffect } from "react";
import { NavLink, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Joi from "joi-browser";
import { Emit, GetResponse } from "../../util/connect-socket";
import md5 from "md5";
import { signIn } from "../../actions";
import { GoogleLogin } from "react-google-login";
import * as socketIo from "../../util/connect-socket";
import * as functions from "../../util/functions";
import { Alert } from "reactstrap";
import { TwitterLogin } from "react-twitter-login";
import Routes from "../../Routes";
import queryString from "query-string";
import Loader from "../Loader/Loader";

const Resetpassword = (props) => {
  const Qvalue = queryString.parse(props.history.location.search);
  const [form, setform] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, seterror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [showpassword, setShowpassword] = useState("false");
  const [showconfirmpassword, Setshowconfirmpassword] = useState("false");
  const [successmsg, setsuccessmsg] = useState("");
  const [loading, setloading] = useState(false);

  const changeValuesHandler = (e) => {
    seterror("");
    setsuccessmsg("");
    var name = e.target.name;
    if (name == "email") {
      console.log("inside121");

      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
      //form[name] = e.target.value
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    setform({ ...form }, form);
  };

  const validateFormData = (body) => {
    let schema = Joi.object().keys({
      password: Joi.string().trim().min(6).required(),
      confirm_password: Joi.string().trim().min(6).required(),
    });
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        console.log("error", error.details[0].message);

        if (
          error.details[0].message !== error ||
          error.details[0].context.key !== errorField
        ) {
          let errorLog = functions.validateSchema(error);
          seterror(errorLog.error);
          seterrorField(errorLog.errorField);
          // console.log("error is 63 ", this.state.error);
        }
      } else {
        seterror("");
        //const value = queryString.parse(props.history.location.search);
        console.log("val is", Qvalue);
        let reqData = {
          email: Qvalue.email,
          guid: Qvalue.guid,
          password: md5(body.password),
        };
        //  console.log("11111111111111", ...reqData)

        ResetReq(reqData);
      }
    });
  };

  const ResetReq = async (reqData) => {
    if (form.password === form.confirm_password) {
      setloading(true);
      Emit("resetPassword", reqData);
      GetResponse((response) => {
        setloading(false);
        console.log("$$$$$$$ res->", response);
        if (response.code === 1) {
          setsuccessmsg(response.message);
          seterror("");
        } else {
          seterror(response.message);
        }
      });
    } else {
      seterror("New Password and Confirm Password must be same!");
    }
  };

  const onRestPassword = () => {
    let obj = {
      password: form.password,
      confirm_password: form.confirm_password,
    };

    validateFormData(obj);
  };

  return (
    <div className="loginMain d-md-flex">
      {loading && <Loader />}
      <div className="loginLeft d-flex justify-content-center align-items-center">
        <div
          className="welcomeMsg text-center wow fadeInUp"
          data-wow-delay="0.3s"
        >
          <img src="images/logo.svg" />
        </div>
      </div>
      <div className="signinForm d-flex justify-content-center align-items-center">
        <div className="formMain">
          <h2 className="textWhite">
            LivoH is a live streaming video platform <br></br> Start your
            streaming today.
          </h2>
          <div className="form text-center wow fadeInUp" data-wow-delay="0.3s">
            <div className="field position-relative ">
              <input
                type={showpassword ? "password" : "text"}
                name="password"
                placeholder="Password"
                className="input-text"
                onChange={(e) => changeValuesHandler(e)}
                value={form.password}
              />
              <span onClick={() => setShowpassword(!showpassword)}>
                {" "}
                <i className="far fa-eye position-absolute f-icon"></i>
              </span>
            </div>
            <div className="field position-relative fieldIcon">
              <input
                type={showconfirmpassword ? "password" : "text"}
                name="confirm_password"
                placeholder="Confirm Password"
                className="input-text"
                onChange={(e) => changeValuesHandler(e)}
                value={form.confirm_password}
              />
              <span
                onClick={() => Setshowconfirmpassword(!showconfirmpassword)}
              >
                {" "}
                <i className="far fa-eye position-absolute f-icon"></i>
              </span>
            </div>
            <div>
              {error !== "" ? <Alert color="danger">{error}</Alert> : null}
            </div>
            <div>
              {successmsg !== "" ? (
                <Alert color="success">{successmsg}</Alert>
              ) : null}
            </div>

            {successmsg !== "" ? (
              <button
                type="button"
                className="blueBtn text-center"
                onClick={() => props.history.push(Routes.SIGNIN)}
              >
                Go to SignIn
              </button>
            ) : (
              // {/* <button type="button" className="blueBtn text-center" onClick={() =>
              //   props.history.push({
              //     pathname:"/shopdetail",
              //     state:{
              //         key:form.email
              //      }
              //    } )} >Go to SignIn</button> */}
              <button
                type="button"
                className="blueBtn text-center"
                onClick={onRestPassword}
              >
                Reset Password
              </button>
            )}

            {/* <div className="signupText"> Don't have an account?<button type="button" className="textLink " onClick={() =>
              props.history.push(Routes.SIGNUP)} >Sign Up</button></div>
               <div className="signupText"><button type="button" className="textLink " onClick={() =>
              props.history.push(Routes.FORGOTPWD)} >Forgot Password??</button></div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resetpassword;
