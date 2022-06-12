import React, { useState } from "react";
import { Alert } from "reactstrap";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import * as socketIo from "../../util/connect-socket";
import md5 from "md5";
import { NavLink } from "react-router-dom";
import Routes from "../../Routes";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import TwitterLogin from "react-twitter-login";
import { useDispatch } from "react-redux";
const Signup = (props) => {
  const { role } = props.location && props.location.state;

  const [form, setform] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, seterror] = useState("");
  const [errorField, seterrorField] = useState("");
  const [showpassword, setShowpassword] = useState("false");
  const [signupsuccessfully, setsignupsuccessfully] = useState("");
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const responseGoogle = (response) => {
    console.log("Google API res ::: ", response.profileObj);
    const eventID = localStorage.getItem("eventId");
    if (response.profileObj) {
      var reqData = {
        sign_up_with: "3",
        social_media_id: response.profileObj.googleId,
      };
      var reqDatafor0 = {
        full_name: response.profileObj.name,
        email: response.profileObj.email,
        sign_up_with: "3",
        social_media_id: response.profileObj.googleId,
        social_media_name: response.profileObj.name,
        social_media_email: response.profileObj.email,
        role: role,
      };
      if (eventID) {
        reqDatafor0.selectedEventId = +eventID;
      }
      // console.log("RWEQQQ", reqDatafor0);
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
        socketIo.Emit("signupWithoutEmail", reqDatafor0);
        setloading(true);
        socketIo.GetResponse((response) => {
          setloading(false);
          console.log("$$$$$$$ res->Kunajj", response);

          if (response.code) {
            // let data= {
            //   'AUTH_TOKEN': response.data.auth_token,
            //   'email': response.data.email,
            //   'user_id': response.data.user_id,
            //   'username': response.data.google_account_name,
            // }
            // localStorage.setItem('data', data);

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
          } else {
            seterror(response.message);
          }
        });
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
          console.log("$$$$$$$ res->FINALL", response);
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
            // <Redirect to={routes.DASHBOARD}/>
            // window.location.reload();
            // props.history.push(Routes.DASHBOARD);

            if (response.data.selectedEventId) {
              props.history.push({
                pathname: "/viewerevent",
                search: `?event_id=${response.data.selectedEventId}`,
              });
            } else {
              props.history.push(Routes.VIEWERDASHBOARD);
            }
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

  const facebookLogin = (response) => {
    let FB = window.FB;
    console.log(FB);
    console.log("fb $response is", response);
    if (FB) {
      FB.getLoginStatus((response) => {
        console.log("response----------", response);
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
                      setloading(false);
                      console.log("$$$$$$$ res->", response);
                      if (
                        response.code == 1 &&
                        response.data.is_registered !== 0
                      ) {
                        localStorage.setItem(
                          "AUTH_TOKEN",
                          response.data.auth_token
                        );
                        localStorage.setItem("email", response.data.email);
                        localStorage.setItem("user_id", response.data.user_id);
                        localStorage.setItem(
                          "username",
                          response.data.facebook_account_name
                        );
                        localStorage.setItem("role", response.data.role);
                        window.location.reload();
                        props.history.push(Routes.DASHBOARD);
                      }

                      let reqDatafor0 = {
                        full_name: facebookLoginReq.name,
                        //"email": facebookLoginReq.email,
                        sign_up_with: "2",
                        social_media_id: facebookLoginReq.facebook_id,
                        social_media_name: facebookLoginReq.name,
                        // "social_media_email": facebookLoginReq.email,
                      };
                      if (
                        response.data.is_registered == 0 ||
                        response.data.is_registered == "0"
                      ) {
                        socketIo.Emit("signupWithoutEmail", reqDatafor0);
                        setloading(true);
                        socketIo.GetResponse((response) => {
                          setloading(false);
                          console.log("$$$$$$$ res->", response);
                          if (response.code) {
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
                              response.data.google_account_name
                            );
                            localStorage.setItem("role", response.data.role);
                            window.location.reload();
                            props.history.push(Routes.DASHBOARD);
                          } else {
                            seterror(response.message);
                          }
                        });
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

  const changeValuesHandler = (e) => {
    var name = e.target.name;
    //console.log("121", name);
    if (name == "email") {
      console.log("inside121");

      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    // form[name] = e.target.value.replace(/^\s+/g, '');
    // console.log("form is",form);
    setform({ ...form }, form);
  };
  const validateFormData = (body) => {
    let schema = Joi.object().keys({
      username: Joi.string().trim().required(),
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
        //this.setState({ error: '', errorField: '' }
        seterror("");
        console.log(md5(body.password));
        let reqData = {
          username: body.username,
          email: body.email,
          password: md5(body.password),
          sign_up_with: 1,
          role: role,
        };
        // console.log("11111111111111", reqData);
        adminSignupReq(reqData);
        setloading(true);
      }
    });
  };
  const enterPressed = (event, input) => {
    var code = event.keyCode || event.which;

    if (code === 13) {
      var target = event.target;

      let username = document.getElementById("username");
      let email = document.getElementById("email");
      let password = document.getElementById("password");
      console.log("HELLO---", input);
      // if (input == "username") {
      //   email.focus();
      // }
      if (input == "email") {
        password.focus();
      }
      if (input == "password") {
        // console.log("FFFFF", code);
        let obj = {
          username: form.username,
          email: form.email,
          password: form.password,
        };

        validateFormData(obj);

        // validateFormData(email,password);
      }
    }
  };
  const adminSignupReq = async (reqData) => {
    //console.log("data is 90", reqData)
    socketIo.Emit("signupWithEmail", reqData); //api call

    socketIo.GetResponse((response) => {
      setloading(false); //getting response
      console.log("$$$$$$$ res->", response);
      if (response.code) {
        // localStorage.setItem('DUDU_AUTH_TOKEN', response.data.auth_token);
        //localStorage.setItem('USER_ID', response.data.user_id);
        // localStorage.setItem("ACCOUNT-TYPE", response.data.account_type)
        // displayLog(response.code, response.message);
        // this.props.history.push('/admin-panel/dashboard');
        //setsignupsuccessfully(response.message)
        localStorage.setItem("SIGNUP_EMAIL", form.email);
        if (response.data.selectedEventId) {
          props.history.push({
            pathname: "/viewerevent",
            search: `?event_id=${response.data.selectedEventId}`,
          });
        } else {
          props.history.push(Routes.SIGNIN);
        }
      } else {
        // this.setState({error: response.message});
        seterror(response.message);
        //displayLog(response.code, response.message);
      }
    });
  };

  const onClickSignUP = () => {
    let obj = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    validateFormData(obj);
  };
  const authHandler = (err, data) => {
    console.log("fianlll", err, data);
  };
  return (
    <div className="forgotMain loginMain d-md-flex">
      {loading && <Loader />}
      <div className="loginLeft d-flex justify-content-center align-items-center">
        <div
          className="welcomeMsg text-center wow fadeInUp"
          data-wow-delay="0.3s"
        >
          <img src="images/logo.svg" />
        </div>
      </div>
      <div className="signinForm  d-flex justify-content-center align-items-center">
        <div className="formMain">
          <h2 className="textWhite">
            LivoH is a live streaming video platform <br></br> Start your
            streaming today.
          </h2>
          <div className="form text-center wow fadeInUp" data-wow-delay="0.3s">
            <div className="field position-relative fieldIcon">
              <input
                type="text"
                name="username"
                placeholder="UserName"
                className="input-text"
                // onKeyPress={(e) => enterPressed(e, "username")}
                onChange={(e) => changeValuesHandler(e)}
                value={form.username}
              />
              <i className="far fa-user position-absolute f-icon"></i>
            </div>
            <div className="field position-relative fieldIcon">
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="input-text"
                onKeyPress={(e) => enterPressed(e, "email")}
                onChange={(e) => changeValuesHandler(e)}
                value={form.email}
              />

              <i className="far fa-envelope position-absolute f-icon"></i>
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
                placeholder="Create Password"
                className="input-text"
                onKeyPress={(e) => enterPressed(e, "password")}
                onChange={(e) => changeValuesHandler(e)}
                value={form.password}
              />
              <span onClick={() => setShowpassword(!showpassword)}>
                <i className="far fa-eye position-absolute f-icon passwordIcon showpw"></i>
                <i class="passwordIcon hidepw fas f-icon position-absolute fa-eye-slash"></i>
              </span>
            </div>
            <div>
              {error !== "" ? <Alert color="danger">{error}</Alert> : null}
            </div>
            <div>
              {signupsuccessfully !== "" ? (
                <Alert color="success">{signupsuccessfully}</Alert>
              ) : null}
            </div>
            <p className="infotext textWhite">
              By clicking Create An Account, you are indicating that you have
              read and agree to the
              <Link to={Routes.TERMSANDCONDITIONS} target="_blank">
                {" "}
                Terms or Service
              </Link>{" "}
              and{" "}
              <Link to={Routes.PRIVACYPOLICY} target="_blank">
                Privacy Policy
              </Link>
            </p>
            <button
              type="button"
              className="blueBtn text-center"
              onClick={onClickSignUP}
            >
              Create An Account
            </button>
            <div className="loginWithSocialIcon">
              <h6 className="textWhite">Sign Up With</h6>
              <ul className="d-flex justify-content-center social-media">
                <li>
                  <a className="facebook-icon" onClick={facebookLogin}>
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="#" className="twitter-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                {/* <TwitterLogin
                  authCallback={authHandler}
                  consumerKey="CEysNIgZljwDDnIlpHlFrz0F8"
                  consumerSecret="DI7rnRco2t0JoHxtxn5ZE7EN6B7Mqdj5fSQuMAvcW4himq7K3V"
                /> */}
                <li>
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
                    //onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </li>
              </ul>
            </div>
            <div className="signupText">
              Already have an account.
              <button
                type="button"
                className="textLink "
                onClick={() => props.history.push(Routes.SIGNIN)}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
