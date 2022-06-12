import React, { useState, useEffect } from "react";
import { NavLink, Redirect, withRouter, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Joi from "joi-browser";
import { Emit, GetResponse } from "../../util/connect-socket";
import md5 from "md5";
import { signIn } from "../../actions";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";

import { TwitterLogin } from "react-twitter-login";
import * as socketIo from "../../util/connect-socket";
import * as functions from "../../util/functions";
import { Alert } from "reactstrap";
import Routes from "../../Routes";
import Loader from "../Loader/Loader";
import * as common from "../../util/common";
import { displayLog } from "../../util/functions";

const Signin = (props) => {
  // console.log("props is", props.location.state);
  const [form, setform] = useState({
    email: "",
    password: "",
  });
  const [error, seterror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [showpassword, setShowpassword] = useState("false");
  const [userverified, setUserverified] = useState();
  const [resendsuccessfully, setResendSuccessfully] = useState("");
  const [loading, setloading] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const responseGoogle = (response) => {
    console.log("Google API res ::: ", response.profileObj);
    const eventID = localStorage.getItem("eventId");
    if (response.profileObj) {
      var reqData = {
        sign_up_with: "3",
        social_media_id: response.profileObj.googleId,
      };
      // var reqDatafor0 = {
      //   full_name: response.profileObj.name,
      //   email: response.profileObj.email,
      //   sign_up_with: "3",
      //   social_media_id: response.profileObj.googleId,
      //   social_media_name: response.profileObj.name,
      //   social_media_email: response.profileObj.email,
      // };
    }
    //api call
    socketIo.Emit("checkSocialMediaAccount", reqData);
    setloading(true);
    //getting response
    socketIo.GetResponse((response) => {
      setloading(false);
      console.log("$$$$$$$ res->", response);

      let reqDatafor1 = {
        // "user_id": response.data.user_id.toString(),
        sign_up_with: "3",
        social_media_id: response.data.google_account_id,
        social_media_name: response.data.google_account_name,
      };
      if (eventID) {
        reqDatafor1.selectedEventId = +eventID;
      }

      if (
        response.data.is_registered == 0 ||
        response.data.is_registered == "0"
      ) {
        // socketIo.Emit("signupWithoutEmail", reqDatafor0);
        // setloading(true);
        // socketIo.GetResponse((response) => {
        //   setloading(false);
        //   console.log("$$$$$$$ res->ssssssss", response);

        //   if (response.code) {
        //     localStorage.setItem("AUTH_TOKEN", response.data.auth_token);
        //     localStorage.setItem("email", response.data.email);
        //     localStorage.setItem("user_id", response.data.user_id);
        //     localStorage.setItem("username", response.data.google_account_name);
        //     localStorage.setItem("role", response.data.role);
        //     // props.history.push(Routes.DASHBOARD);
        //     // window.location.reload();
        //     // window.location.reload();
        //     // setTimeout(() => {
        //     //   props.history.push(Routes.DASHBOARD);
        //     // }, 3000);
        //     props.history.push(Routes.VIEWERDASHBOARD);
        //   } else {
        //     seterror(response.message);
        //   }
        // });
        displayLog(
          0,
          "You haven't signup with social media via this account. Please signup with this social media account on LivOH site."
        );
      }

      if (
        response.data.is_registered == 1 ||
        response.data.is_registered == "1"
      ) {
        console.log("registered response is 1");
        socketIo.Emit("connectSocialMediaAccount", reqDatafor1);
        setloading(true);
        socketIo.GetResponse((response) => {
          setloading(false);
          console.log("$$$$$$$ res->oooooooo", response);
          if (response.code == 1) {
            dispatch({
              type: "LOGIN_DATA",
              payload: {
                authToken: response.data.auth_token,
                role: response.data.role,
                email: response.data.email,
                user_id: response.data.user_id,

                username: response.data.google_account_name,
              },
            });
            localStorage.setItem("AUTH_TOKEN", response.data.auth_token);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("user_id", response.data.user_id);
            localStorage.setItem("username", response.data.google_account_name);
            localStorage.setItem("role", response.data.role);
            if (response.data.selectedEventId) {
              props.history.push({
                pathname: "/viewerevent",
                search: `?event_id=${response.data.selectedEventId}`,
              });
            } else {
              props.history.push(Routes.VIEWERDASHBOARD);
            }
            // <Redirect to={routes.DASHBOARD}/>

            // window.location.reload();
            // setTimeout(() => {
            //   props.history.push(Routes.DASHBOARD);
            // }, 3000);
          } else {
            seterror(response.message);
          }
        });
      }
      if (response.code) {
        // props.history.push("/dashboard")
      } else {
        seterror(response.message);
        //displayLog(response.code, response.message);
      }
    });
  };

  const twitterHandler = (err, data) => {
    console.log(err, data);
  };

  const facebookLogin = (response) => {
    let FB = window.FB;
    console.log(FB);
    console.log("fb $response is", response);
    if (FB) {
      FB.getLoginStatus((response) => {
        console.log("response", response);
        if (response.status == "connectedd") {
          let facebookLoginReq = {};
          facebookLoginReq.facebook_id = response.authResponse.userID;
          //props.facebookLoginReq(facebookLoginReq);
        } else {
          console.log("if not connected");
          FB.login(
            (response) => {
              console.log("reponse in login ", response);

              if (response.authResponse) {
                var token = response.authResponse.accessToken;
                try {
                  FB.api("/me", { fields: "id,name,email" }, (userData) => {
                    let facebookLoginReq = {};
                    facebookLoginReq.name = userData.name ? userData.name : "";
                    facebookLoginReq.email = userData.email
                      ? userData.email
                      : "";
                    facebookLoginReq.facebook_id = userData.id
                      ? userData.id
                      : "";
                    console.log("[facebookLoginReq]", facebookLoginReq);
                    //props.facebookLoginReq(facebookLoginReq);
                    //abhishek code start
                    let reqData = {
                      sign_up_with: "2",
                      social_media_id: response.authResponse.userID,
                    };
                    //api call
                    socketIo.Emit("checkSocialMediaAccount", reqData);
                    setloading(true);
                    //getting response
                    socketIo.GetResponse((response) => {
                      setTimeout(() => {
                        setloading(false);
                        console.log("$$$$$$$ res->", response);
                        if (
                          response.code == 1 &&
                          response.data.is_registered !== 0
                        ) {
                          dispatch({
                            type: "LOGIN_DATA",
                            payload: {
                              authToken: response.data.auth_token,
                              role: response.data.role,
                              email: response.data.email,
                              user_id: response.data.user_id,

                              username: response.data.facebook_account_name,
                            },
                          });
                          localStorage.setItem(
                            "AUTH_TOKEN",
                            response.data.auth_token
                          );
                          localStorage.setItem("email", response.data.email);
                          localStorage.setItem(
                            "user_id",
                            response.data.user_id
                          );
                          localStorage.setItem(
                            "username",
                            response.data.facebook_account_name
                          );
                          localStorage.setItem("role", response.data.role);
                          // window.location.reload();
                          // setTimeout(() => {
                          //   props.history.push(Routes.DASHBOARD);
                          // }, 3000);
                          props.history.push(Routes.VIEWERDASHBOARD);
                          // props.history.push(Routes.DASHBOARD);
                          // window.location.reload();
                        }

                        if (
                          response.data.is_registered == 0 ||
                          response.data.is_registered == "0"
                        ) {
                          displayLog(
                            0,
                            "You haven't signup with social media via this account. Please signup with this social media account on LivOH site."
                          );
                        }

                        // let reqDatafor1 = {
                        //   //"user_id": response.data.user_id.toString(),
                        //   "sign_up_with": "2",
                        //   "social_media_id": response.data.facebook_account_id,
                        //   "social_media_name": response.data.facebook_account_name,
                        // }

                        // if (response.data.is_registered == 1 || response.data.is_registered == "1") {
                        //   socketIo.Emit("connectSocialMediaAccount", reqDatafor1);
                        //   socketIo.GetResponse(response => {
                        //     console.log('$$$$$$$ res->', response);
                        //     if (response.code == 1) {
                        //       // props.history.push("/dashboard")
                        //     } else {
                        //       seterror(response.message);
                        //     }
                        //   })
                        // }
                        else if (response.code != 1) {
                          seterror(response.message);
                          //displayLog(response.code, response.message);
                        }
                      }, 1000);
                    });
                    //abhishek code end
                  });
                } catch (err) {
                  console.log("Error in FB-------", err);
                }
              } else {
                console.log("User cancelled login or did not fully authorize.");
              }
            },
            { scope: "public_profile" }
          );
        }
      });
    } else {
      console.log("FB is not found");
    }
  };

  // abhishek code start
  const changeValuesHandler = (e) => {
    seterror("");
    setResendSuccessfully("");
    var name = e.target.name;
    //console.log("121", name);
    if (name == "email") {
      console.log("inside121");

      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
      //form[name] = e.target.value
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    // form[name] = e.target.value.replace(/^\s+/g, '');
    // console.log("form is",form);
    setform({ ...form }, form);
  };

  const validateFormData = (body) => {
    let schema = Joi.object().keys({
      email: Joi.string().trim().email().required(),
      password: Joi.string().trim().min(6).required(),
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
        const eventID = localStorage.getItem("eventId");

        let reqData = {
          email: body.email,
          password: md5(body.password),
        };
        if (eventID) {
          reqData.selectedEventId = +eventID;
        }
        console.log("11111111111111", reqData);
        adminLoginReq(reqData);
        setloading(true);
      }
    });
  };

  const adminLoginReq = async (reqData) => {
    socketIo.Emit("loginWithEmail", reqData);

    socketIo.GetResponse((response) => {
      setTimeout(() => {
        setloading(false);
        console.log("$$$$$$$ res->", response);
        if (response.code === 1) {
          dispatch({
            type: "LOGIN_DATA",
            payload: {
              authToken: response.data.auth_token,
              role: response.data.role,
              email: response.data.email,
              user_id: response.data.user_id,
              profile_picture: response.data.profile_picture,
              username: response.data.username,
              sign_up_with: 1,
            },
          });
          localStorage.setItem("AUTH_TOKEN", response.data.auth_token);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("user_id", response.data.user_id);
          localStorage.setItem(
            "profile_picture",
            response.data.profile_picture
          );
          localStorage.setItem("username", response.data.username);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("sign_up_with", 1);
          displayLog(response.code, response.message);
          // let encryptdata =  common.encrypt()

          // window.location.reload();
          if (response.data.selectedEventId) {
            props.history.push({
              pathname: "/viewerevent",
              search: `?event_id=${response.data.selectedEventId}`,
            });
          } else {
            props.history.push(Routes.VIEWERDASHBOARD);
          }

          setUserverified("true");
        } else if (response.code === 405) {
          setUserverified("false");
          seterror(response.message);
        } else {
          // this.setState({error: response.message});
          seterror(response.message);
          //displayLog(response.code, response.message);
        }
      }, 1000);
    });
  };
  const onClickSignIN = () => {
    let obj = {
      email: form.email,
      password: form.password,
    };

    validateFormData(obj);
  };

  const OnResendHandler = () => {
    let reqData = {
      email: form.email,
    };
    socketIo.Emit("resendEmailToken", reqData);
    setloading(true);

    socketIo.GetResponse((response) => {
      setloading(false);
      console.log("$$$$$$$ res->", response);
      // setResendSuccessfully(response.message)
      setUserverified("true");
      seterror("");
      setResendSuccessfully(response.message);
      if (response.code) {
        // props.history.push("/dashboard")
      } else {
        //seterror(response.message)
        //displayLog(response.code, response.message);
      }
    });
  };
  const enterPressed = (event, input) => {
    var code = event.keyCode || event.which;
    console.log("HELLO---", input);
    if (code === 13) {
      var target = event.target;
      let email = document.getElementById("email");
      let password = document.getElementById("password");

      if (input == "email") {
        password.focus();
      }
      if (input == "password") {
        console.log("HELLO");
        // console.log("FFFFF", code);
        let obj = {
          email: form.email,
          password: form.password,
        };

        validateFormData(obj);
        // validateFormData(email,password);
      }
    }
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
                type="text"
                name="email"
                id="email"
                placeholder="UserName"
                className="input-text"
                onKeyPress={(e) => enterPressed(e, "email")}
                onChange={(e) => changeValuesHandler(e)}
                value={form.email}
              />

              <i className="far fa-user position-absolute f-icon"></i>
            </div>
            <div
              className={
                showpassword
                  ? "field position-relative fieldIcon "
                  : "field position-relative fieldIcon showpassword"
              }
            >
              <input
                type={showpassword ? "password" : "text"}
                name="password"
                id="password"
                placeholder="Password"
                className="input-text"
                onChange={(e) => changeValuesHandler(e)}
                onKeyPress={(e) => enterPressed(e, "password")}
                value={form.password}
              />
              <span onClick={() => setShowpassword(!showpassword)}>
                {" "}
                <i className="far fa-eye position-absolute f-icon passwordIcon showpw"></i>
                <i class="passwordIcon hidepw fas f-icon position-absolute fa-eye-slash"></i>
              </span>
            </div>
            <div>
              {error !== "" ? <Alert color="danger">{error}</Alert> : null}
            </div>
            <div>
              {resendsuccessfully !== "" ? (
                <Alert color="success">{resendsuccessfully}</Alert>
              ) : null}
            </div>
            <div className="control-group rembeberme text-left">
              <label className="control control--checkbox">
                Remember Me
                <input type="checkbox" />
                <div className="control__indicator" />
              </label>
            </div>
            {userverified === "false" ? (
              <button
                type="button"
                className="blueBtn text-center"
                onClick={OnResendHandler}
              >
                Resend Email
              </button>
            ) : (
              <button
                type="button"
                className="blueBtn text-center"
                onClick={onClickSignIN}
              >
                Sign In To Account
              </button>
            )}
            <div className="loginWithSocialIcon">
              <h6 className="textWhite">Login With</h6>
              <ul className="d-flex justify-content-center social-media">
                <li>
                  <a href="#" className="facebook-icon" onClick={facebookLogin}>
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  {/* <a href="#" className="twitter-icon">
                    <i className="fab fa-twitter"></i>
                  </a> */}

                  <TwitterLogin
                    authCallback={twitterHandler}
                    children={
                      <button style={{ background: "transparent" }}>
                        <a href="#" className="twitter-icon">
                          <i className="fab fa-twitter"></i>
                        </a>
                      </button>
                    }
                    consumerKey="Livohofficial"
                    consumerSecret="LivohPword123"
                  />
                </li>
                <li>
                  {/* <a href="#" className="google-icon">
                    <i className="fab fa-google-plus-g"></i>
                  </a> */}

                  <GoogleLogin
                    clientId="929859565170-mlhh0bboh6pvno8d8m9vljhubhe2aufb.apps.googleusercontent.com"
                    render={(renderProps) => (
                      <button
                        style={{ background: "transparent" }}
                        onClick={renderProps.onClick}
                      >
                        {" "}
                        <a href="#" className="google-icon">
                          <i className="fab fa-google-plus-g"></i>
                        </a>
                      </button>
                    )}
                    buttonText="Google Login"
                    onSuccess={responseGoogle}
                    //onFailure={()=>responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </li>
              </ul>
            </div>
            <div className="signupText">
              {" "}
              Don't have an account?
              <button
                type="button"
                className="textLink "
                onClick={() => props.history.push(Routes.CHOOSEACCOUNT)}
              >
                Sign Up
              </button>
            </div>
            <div className="signupText">
              <button
                type="button"
                className="textLink "
                onClick={() => props.history.push(Routes.FORGOTPWD)}
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Signin);
