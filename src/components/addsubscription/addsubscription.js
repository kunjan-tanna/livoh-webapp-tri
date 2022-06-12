import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import { Emit, GetResponse } from "../../util/connect-socket";
import Header from "../header/header";
import Dropzone from "react-dropzone";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import { Alert, Input } from "reactstrap";
import moment from "moment";
import Loader from "../Loader/Loader";
import { displayLog } from "../../util/functions";
import { Event_constant } from "../../util/constant";
import DatePicker from "react-datepicker";
// import { TimePicker } from 'antd';
// import GTimePicker from 'react-gradient-timepicker';

class Addsubscription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      error: "",
      errorField: "",
      successMsg: "",
      loading: false,
    };
  }

  inputChangedHandler = (e) => {
    this.setState({ successMsg: "" });
    let name = e.target.name;
    let form = this.state.formValues;

    form[name] = e.target.value.replace(/^\s+/g, "");

    this.setState({ formValues: form });
  };

  saveEventHandler = () => {
    //console.log("saveProfileclick")
    let obj = {
      name: this.state.formValues.subscription_name,
      period: this.state.formValues.period,
      amount: this.state.formValues.amount,
      description: this.state.formValues.description,
      sub_description: this.state.formValues.sub_desc,
    };
    this.validateFormData(obj);
  };
  validateFormData = (body) => {
    let schema = Joi.object().keys({
      name: Joi.string().trim().required(),
      amount: Joi.string().trim().required().regex(/\d$/),
      period: Joi.string().trim().required(),

      description: Joi.string()
        .trim()
        .max(Event_constant.EVENT_DESCRIPTION_MAX_LENGTH)
        .required(),
      sub_description: Joi.string()
        .trim()
        .max(Event_constant.EVENT_DESCRIPTION_MAX_LENGTH)
        .required(),
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
        let formData = this.state.formValues;
        formData.currency = "gbp";
        const reqData = {
          eventName: "createSubscriptionPlan",
          name: formData.subscription_name,
          period: formData.period,
          currency: formData.currency,
          amount: +formData.amount,
          description: formData.description,
          sub_description: formData.sub_desc,
        };
        // console.log("reqdata", reqdata);
        this.saveEventReq(reqData);
        this.setState({ loading: true });
      }
    });
  };

  saveEventReq = (reqData) => {
    // console.log("REQQQQ", reqData);
    setTimeout(() => {
      Emit("event", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("The res is-->", res);
        displayLog(res.code, res.message);
        if (res.code === 1) {
          this.props.history.push(routes.MYSUBSCRIPTION);
          //this.setState({ successMsg: res.message });
        }
      });
    }, 1000);
  };

  render() {
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}
        <div className="addeventBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              <h1>Create A Subscription</h1>
              <h2>Host</h2>
            </div>
          </div>
        </div>
        <div className="outerProfile">
          <div className="container">
            <div className="eventFrom">
              <h3>SUBSCRIPTION INFORMATION</h3>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Subscription Name"
                  name="subscription_name"
                  value={this.state.formValues.subscription_name}
                  onChange={this.inputChangedHandler}
                />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-input customDate">
                    {/* <Input className="form-input-text"
                      type="date"
                      name="event_date"
                      id="exampleDate"
                      // min="2021-04-13"
                      min={moment().format("YYYY-MM-DD")}
                      // max={moment(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD")}
                      placeholder="event date"
                      onChange={this.inputChangedHandler}
                    /> */}
                    <input
                      type="number"
                      className="form-input-text"
                      placeholder=" Subscription Price"
                      name="amount"
                      value={this.state.formValues.amount}
                      onChange={this.inputChangedHandler}
                    />
                    <i class=" form-icon svg-icon">
                      <img src="./images/price-icon.svg" />{" "}
                    </i>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="custom-select-box ">
                    <select
                      value={this.state.formValues.period}
                      name="period"
                      onChange={this.inputChangedHandler}
                    >
                      <option value="">Enter period</option>
                      <option value="day">day</option>
                      <option value="week">week</option>
                      <option value="month">month</option>
                      <option value="year">year</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-input customTime">
                    <input
                      type="text"
                      className="form-input-text"
                      placeholder="currency"
                      name="currency"
                      readOnly
                      value={"GBP"}
                      // onChange={this.inputChangedHandler}
                    />
                  </div>
                </div>
              </div>

              <div className="form-input textareaFrom">
                <textarea
                  className="form-input-text"
                  style={{ height: "100%" }}
                  placeholder="Description"
                  name="description"
                  value={this.state.formValues.description}
                  onChange={this.inputChangedHandler}
                ></textarea>
              </div>
              {/* <div className="row">
                <div className="col-md-12">
                  <div className="text-left checkBoxOuter">
                    <label className="control control--checkbox">
                      Add peak here
                      <input
                        type="checkbox"
                        checked={this.state.formValues.enable_use_description}
                        name="enable_use_description"
                        onChange={this.inputChangedHandler}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="text-left checkBoxOuter">
                    <label className="control control--checkbox">
                      Add peak here
                      <input
                        type="checkbox"
                        // checked={this.state.formValues.enable_use_description}
                        name="enable_use_description"
                        // onChange={this.inputChangedHandler}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="text-left checkBoxOuter">
                    <label className="control control--checkbox">
                      Add peak here
                      <input
                        type="checkbox"
                        // checked={this.state.formValues.enable_use_description}
                        name="enable_use_description"
                        // onChange={this.inputChangedHandler}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="text-left checkBoxOuter">
                    <label className="control control--checkbox">
                      Add peak here
                      <input
                        type="checkbox"
                        // checked={this.state.formValues.enable_use_description}
                        name="enable_use_description"
                        onChange={this.inputChangedHandler}
                      />
                      <div className="control__indicator" />
                    </label>
                  </div>
                </div>
              </div> */}
              <div className="form-input textareaFrom">
                <textarea
                  className="form-input-text"
                  style={{ height: "100%" }}
                  placeholder="Add Subscription Terms (OPTIONAL)"
                  name="sub_desc"
                  value={this.state.formValues.sub_desc}
                  onChange={this.inputChangedHandler}
                ></textarea>
              </div>
            </div>

            <div className="text-center">
              {this.state.error !== "" ? (
                <Alert color="danger">{this.state.error}</Alert>
              ) : null}

              {this.state.successMsg !== "" ? (
                <Alert color="success">{this.state.successMsg}</Alert>
              ) : null}
            </div>
            <div className="row button-outer">
              <div className="col-6">
                {" "}
                {/* <button type="button" className="pinkBtn text-center">
                  go to soundcheck
                </button> */}
              </div>
              <div className="col-6">
                {" "}
                <button
                  type="button"
                  className="blueinnerBtn text-center"
                  onClick={this.saveEventHandler}
                >
                  Save Subscription option
                </button>
              </div>
            </div>
          </div>
        </div>

        <Jointherevolution />
        <Footer />
      </div>
    );
  }
}

export default Addsubscription;
