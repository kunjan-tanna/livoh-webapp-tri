import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import { Emit, GetResponse } from "../../util/connect-socket";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import { Alert } from "reactstrap";
import Loader from "../Loader/Loader";
import { displayLog } from "../../util/functions";

class Edituser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      error: "",
      errorField: "",
      successMsg: "",
      loading: false,
    };
  }
  async componentDidMount() {
    this.setState({ loading: true });

    setTimeout(() => {
      this.getUserProfile();
    }, 500);
  }
  getUserProfile = async () => {
    let req_data = {
      //page_no: this.state.page_no,
      //limit: this.state.limit
    };
    Emit("getUserProfile", req_data);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      if (res.code === 1) {
        this.setState({ data: res.data });
      }
    });
  };
  viewProfileHandler = () => {
    this.props.history.push(routes.VIEWERPROFILE);
    //console.log("viewProfileclick")
  };
  saveProfileHandler = () => {
    //console.log("saveProfileclick")
    let obj = {
      //email: this.state.data.email,
      phone_number: this.state.data.phone_number,
      primary_phone_number: this.state.data.primary_phone_number,
      address: this.state.data.address,
      company_name: this.state.data.company_name,
      full_name: this.state.data.full_name,
    };
    console.log("REEE", obj);
    this.validateFormData(obj);
  };
  validateFormData = (body) => {
    let schema = Joi.object().keys({
      full_name: Joi.string().trim().required(),
      company_name: Joi.string().trim().required(),
      address: Joi.string().trim().required(),
      //email: Joi.string().trim().email().required(),
      //phone_number:Joi.string().min(9).regex(/^[0]?[45]\d{0,10}$/),
      phone_number: Joi.string()
        .min(9)
        .max(13)
        .regex(/^[0]?\d{0,13}$/),
      //full_name: Joi.string().trim().required(),
      primary_phone_number: Joi.string()
        .min(9)
        .max(13)
        .regex(/^[0]?\d{0,13}$/),
    });
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        //console.log("error", error.details[0].message);

        if (
          error.details[0].message !== this.state.error ||
          error.details[0].context.key !== this.state.errorField
        ) {
          let errorLog = functions.validateSchema(error);
          this.setState({
            error: errorLog.error,
            errorField: errorLog.errorField,
          });
          this.setState({ successMsg: "" });
          //console.log("error is 63 ", this.state.error);
        }
      } else {
        this.setState({ error: "", errorField: "" });

        //  console.log("11111111111111", ...reqData)
        let reqdata = {
          address: this.state.data.address,
          company_name: this.state.data.company_name,
          email: this.state.data.email,
          full_name: this.state.data.full_name,
          phone_number: this.state.data.phone_number,
          primary_phone_number: this.state.data.primary_phone_number,
        };
        this.saveProfile(reqdata);
        this.setState({ loading: true });
      }
    });
  };
  saveProfile = (reqData) => {
    Emit("editUserProfile", reqData);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      displayLog(res.code, res.message);
      if (res.code === 1) {
        if (localStorage.getItem("role") == 1) {
          setTimeout(() => {
            this.props.history.push(routes.VIEWERDASHBOARD);
          }, 3000);
        } else {
          setTimeout(() => {
            this.props.history.push(routes.DASHBOARD);
          }, 3000);
        }

        //this.setState({successMsg:res.message });
      }
      //this.setState({ data: res });
      // this.setState({ list: res.data.users, total: res.data.total });
    });
  };
  inputChangedHandler = (e) => {
    this.setState({ successMsg: "" });
    let name = e.target.name;
    let form = this.state.data;
    //console.log("121", name);

    if (name == "email") {
      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
      //form[name] = e.target.value
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    // form[name] = e.target.value.replace(/^\s+/g, '');
    // console.log("form is",form);
    this.setState({ data: form });
  };

  render() {
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}
        <div className="dashboardBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              <h1>My User</h1>
              <h2>
                {localStorage.getItem("role") == 1 ? (
                  <h2>Viewer</h2>
                ) : (
                  <h2>Host</h2>
                )}
              </h2>
            </div>
          </div>
        </div>
        <div className="outerProfile">
          <div className="container">
            <div className="editFrom m-0">
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Full Name"
                  value={this.state.data.full_name}
                  name="full_name"
                  onChange={this.inputChangedHandler}
                />
              </div>

              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Company Name"
                  value={this.state.data.company_name}
                  name="company_name"
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Address"
                  value={this.state.data.address}
                  name="address"
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  readOnly="true"
                  type="text"
                  className="form-input-text"
                  placeholder="Email"
                  value={this.state.data.email}
                />
              </div>
              <div className="form-input">
                <input
                  type="number"
                  className="form-input-text"
                  placeholder="Mobile Phone"
                  value={this.state.data.phone_number}
                  name="phone_number"
                  max={10}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  readOnly="true"
                  type="text"
                  className="form-input-text"
                  placeholder="Default Currency"
                  value={this.state.data.currency}
                />
              </div>
              <div className="form-input">
                <input
                  type="number"
                  className="form-input-text"
                  placeholder="Primary Phone"
                  max={10}
                  value={this.state.data.primary_phone_number}
                  name="primary_phone_number"
                  onChange={this.inputChangedHandler}
                />
              </div>

              <div>
                {this.state.error !== "" ? (
                  <Alert color="danger">{this.state.error}</Alert>
                ) : null}
              </div>
              <div>
                {this.state.successMsg !== "" ? (
                  <Alert color="success">{this.state.successMsg}</Alert>
                ) : null}
              </div>

              <div className="row button-outer">
                <div className="col-6">
                  {" "}
                  <button
                    type="button"
                    className="pinkBtn text-center"
                    onClick={this.viewProfileHandler}
                  >
                    view profile{" "}
                  </button>
                </div>
                <div className="col-6">
                  {" "}
                  <button
                    type="button"
                    className="blueinnerBtn text-center"
                    onClick={this.saveProfileHandler}
                  >
                    save profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <Jointherevolution /> */}
        <Footer />
      </div>
    );
  }
}

export default Edituser;
