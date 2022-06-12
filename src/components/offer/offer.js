import React, { Component } from "react";
import { Emit, GetResponse } from '../../util/connect-socket';
import routes from '../../Routes';
import { NavLink } from 'react-router-dom';
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import Switch from "react-switch";
import moment from 'moment';
import DatePicker from "react-datepicker";
import Joi from 'joi-browser';
import * as functions from "../../util/functions";
import { displayLog } from "../../util/functions";
import { Alert } from 'reactstrap';



class Offer extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
      formValues: {
        sub_offer_name: '',
        sub_type: "",
        event_date: "",
        start_time: "",
        end_time: "",
      },
      starttime: "",
      endtime: "",
      eventdate: "",
      error: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  inputChangedHandler = (e) => {
    this.setState({ successMsg: "" })
    let name = e.target.name;
    let form = this.state.formValues;
    form[name] = e.target.value.replace(/^\s+/g, '');
    console.log("form data", form)
    this.setState({ formValues: form })
    //console.log("time ", this.state.formValues.end_time.replace(/:/g, ''))
  }

  changeDateTime = (date, name) => {
    let form = this.state.formValues;
    // console.log(name, date)
    if (name == "start_time") {
      form["start_time"] = moment(date).format("HH:mm");
      this.setState({ formValues: form, starttime: date })
    }
    else if (name == "end_time") {
      form["end_time"] = moment(date).format("HH:mm");
      this.setState({ formValues: form, endtime: date })
    }
    else if (name == "event_date") {
      form["event_date"] = moment(date).format("YYYY-MM-DD");
      this.setState({ formValues: form, eventdate: date })
    }
    //console.log("start time", form);
  }

  handleChange(checked) {
    this.setState({ checked });
  }
  SaveOptionHandler = () => {
    console.log("state", this.state)
    let obj = {
      subscription_offer_name: this.state.formValues.sub_offer_name,
      subscription_type: this.state.formValues.sub_type,
      start_date: this.state.formValues.event_date,
      start_time: this.state.formValues.start_time.replace(/:/g, ''),
      end_time: this.state.formValues.end_time.replace(/:/g, ''),
    }
    this.validateFormData(obj);
  }
  validateFormData = (body) => {
    let startTime = +this.state.formValues.start_time.replace(/:/g, '');
    let schema = Joi.object().keys({
      subscription_offer_name: Joi.string().trim().required(),
      subscription_type: Joi.string().trim().required(),
      start_date: Joi.string().trim().required(),
      start_time: Joi.number().required(),
      end_time: Joi.number().greater(startTime).required(),
    })
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        if (error.details[0].message !== this.state.error || error.details[0].context.key !== this.state.errorField) {
          let errorLog = functions.validateSchema(error)
          this.setState({ error: errorLog.error, errorField: errorLog.errorField })
          this.setState({ successMsg: "" })
        }
      }
      else {
        this.setState({ error: "", errorField: "" })

        //  console.log("11111111111111", ...reqData)
        let reqdata = {
          sub_offer_name: this.state.formValues.sub_offer_name,
          sub_type: this.state.formValues.sub_type,
          date: this.state.formValues.event_date,
          start_time: this.state.formValues.start_time,
          end_time: this.state.formValues.end_time,
        }
       // console.log("reqdata", reqdata);
        this.saveEventReq(reqdata);
        this.setState({ loading: true })
      }
    })
  }
  saveEventReq = (reqData) => {
    console.log("reqdata", reqData);
   // Emit('addEditEvent', reqData);
    GetResponse(res => {
      this.setState({ loading: false })
      console.log('The res is-->', res);
      displayLog(res.code, res.message)
      if (res.code === 1) {
        //this.setState({ successMsg: res.message });
      }
    })
  }

  render() {
    return (
      <div>
        <Header />
        <div className="addeventBanner bannerImg">

          <div className="bannerText">
            <div className="container">
              <h1>Offer Options</h1>
              <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et</h2>
            </div>
          </div>

        </div>
        <div className="outerProfile offerOption">
          <div className="container">

            <div className="eventFrom">
              <h3>Subscription</h3>
              <div className="form-input">
                <input type="text" className="form-input-text" placeholder="Subscription offer name"
                  name="sub_offer_name" value={this.state.formValues.sub_offer_name} onChange={this.inputChangedHandler} />
              </div>
              <div className="form-input">
                <input type="text" className="form-input-text" placeholder="Subscription type"
                  name="sub_type" value={this.state.formValues.sub_type} onChange={this.inputChangedHandler} />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-input customDate">
                    <DatePicker
                      className="form-input-text"
                      selected={this.state.eventdate}
                      onChange={date => this.changeDateTime(date, "event_date")}
                      placeholderText="Start Date"
                      minDate={new Date()}
                      showYearDropdown
                    //showMonthDropdown
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-input customTime">
                    <DatePicker
                      className="form-input-text"
                      selected={this.state.starttime}
                      onChange={date => this.changeDateTime(date, "start_time")}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      placeholderText="Start Time"
                      timeCaption="Start Time"
                      dateFormat="h:mm aa"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-input customTime">
                    <DatePicker
                      className="form-input-text"
                      selected={this.state.endtime}
                      onChange={date => this.changeDateTime(date, "end_time")}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      placeholderText="End Time"
                      timeCaption="End Time"
                      dateFormat="h:mm aa"
                    />
                  </div>
                </div>
              </div>

              <div className="reactOpswitch">
                <label>

                  <Switch
                    checked={this.state.checked}
                    onChange={this.handleChange}
                    onColor="#3AB5E5"
                    onHandleColor="#fff"
                    handleDiameter={12}
                    uncheckedIcon={false}
                    checkedIcon={false}

                    height={20}
                    width={40}
                    className="react-switch"
                    id="material-switch"
                  />
                  <span>Show subscription on purchase</span>
                </label>
              </div>
              <div className="text-center">
                {

                  this.state.error !== '' ?
                    <Alert color="danger">
                      {this.state.error}
                    </Alert>
                    : null
                }
              </div>
              <div className="row">
                <div className="col-md-6">
                  <button className="blueBtn blueBtndefault" onClick={this.SaveOptionHandler}>Save options</button>
                </div>
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

export default Offer;
