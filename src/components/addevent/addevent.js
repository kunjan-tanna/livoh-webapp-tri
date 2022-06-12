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

class Addevent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //  files: [],
      formValues: {
        event_title: "",
        location: "",
        event_date: "",
        start_time: "",
        end_time: "",
        img: [],
        description: "",

        ticket_type: "",
        ticket_name: "",
        quantity: "",
        service_charge: "",
        price: "",
        ticket_description: "",
        twitter_handle: "",
        instagram_handle: "",
      },
      image_data: "",
      image_name: "",
      error: "",
      fileerror: "",
      errorField: "",
      successMsg: "",
      loading: false,
      starttime: "",
      endtime: "",
      eventdate: "",
    };
  }

  inputChangedHandler = (e) => {
    this.setState({ successMsg: "" });
    let name = e.target.name;
    let form = this.state.formValues;

    if (name == "email") {
      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    // console.log("form data", form);
    // console.log("time ", this.state.formValues.end_time.replace(/:/g, ""));

    this.setState({ formValues: form });
  };

  changestartTime = (date, name) => {
    let form = this.state.formValues;
    // console.log("TIMEZONE", name, moment(date).utc().format("HH:mm"));
    // console.log(moment().format('llll'))
    if (name == "start_time") {
      form["start_time"] = moment(date).format("HH:mm");
      this.setState({ formValues: form, starttime: date });
    } else if (name == "end_time") {
      form["end_time"] = moment(date).format("HH:mm");
      this.setState({ formValues: form, endtime: date });
    } else if (name == "event_date") {
      form["event_date"] = moment(date).format("YYYY-MM-DD");
      this.setState({ formValues: form, eventdate: date });
    }
    console.log("start time", form);
  };
  // setstartTime = (val) => {
  //   let form = this.state.formValues;
  //   form["start_time"] = val.format24;
  //   this.setState({ formValues: form, startDate: val })
  //   console.log("start time", form);
  // }
  saveEventHandler = () => {
    //console.log("saveProfileclick")
    let obj = {
      event_title: this.state.formValues.event_title,
      location: this.state.formValues.location,
      event_date: this.state.formValues.event_date,
      start_time: this.state.formValues.start_time.replace(/:/g, ""),
      end_time: this.state.formValues.end_time.replace(/:/g, ""),
      image: this.state.image_name,
      description: this.state.formValues.description,
      // Ticket_type: this.state.formValues.ticket_type,
      Ticket_name: this.state.formValues.ticket_name,
      Ticket_quantity: this.state.formValues.quantity,
      service_charge: this.state.formValues.service_charge,
      Ticket_price: this.state.formValues.price,
      Ticket_description: this.state.formValues.ticket_description,
    };
    if (this.state.formValues.twitter_handle) {
      obj.twitter_handle = this.state.formValues.twitter_handle;
    }
    if (this.state.formValues.instagram_handle) {
      obj.instagram_handle = this.state.formValues.instagram_handle;
    }

    this.validateFormData(obj);
  };
  validateFormData = (body) => {
    // console.log("start time" , this.state.formValues.start_time.replace(/:/g, ''))
    let startTime = +this.state.formValues.start_time.replace(/:/g, "");
    let schema = Joi.object().keys({
      event_title: Joi.string().trim().required(),
      location: Joi.string().trim().required(),
      event_date: Joi.string().trim().required(),

      start_time: Joi.number().required(),
      end_time: Joi.number().greater(startTime).required(),

      image: Joi.string().trim().required(),
      description: Joi.string()
        .trim()
        .max(Event_constant.EVENT_DESCRIPTION_MAX_LENGTH)
        .required(),
      // Ticket_type: Joi.string().trim().required(),
      Ticket_name: Joi.string().trim().required(),
      Ticket_quantity: Joi.string().trim().required().regex(/\d$/),
      service_charge: Joi.string().trim().required().regex(/\d$/),
      Ticket_price: Joi.string().trim().required().regex(/\d$/),
      Ticket_description: Joi.string()
        .trim()
        .max(Event_constant.EVENT_TICKET_DESCRIPTION_MAX_LENGTH)
        .required(),
      twitter_handle: this.state.formValues.twitter_handle
        ? Joi.string()
            .trim()
            .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
            .required()
        : "",
      instagram_handle: this.state.formValues.instagram_handle
        ? Joi.string()
            .trim()
            .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
            .required()
        : "",
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

        let reqdata = {
          image_name: this.state.image_name,
          image_data: this.state.image_data,
          name: this.state.formValues.event_title,
          location: this.state.formValues.location,
          date: this.state.formValues.event_date,
          start_time: this.state.formValues.start_time,
          end_time: this.state.formValues.end_time,
          description: this.state.formValues.description,
          // ticket_type: +this.state.formValues.ticket_type,
          ticket_name: this.state.formValues.ticket_name,
          quantity: +this.state.formValues.quantity,
          service_charge: +parseFloat(
            this.state.formValues.service_charge
          ).toFixed(0),
          price: +parseFloat(this.state.formValues.price).toFixed(2),
          ticket_description: this.state.formValues.ticket_description,
        };
        if (this.state.formValues.twitter_handle) {
          reqdata.twitter_handle = this.state.formValues.twitter_handle;
        }
        if (this.state.formValues.instagram_handle) {
          reqdata.instagram_handle = this.state.formValues.instagram_handle;
        }
        // console.log("11111111111111", reqdata);

        this.saveEventReq(reqdata);
        this.setState({ loading: true });
      }
    });
  };

  saveEventReq = (reqData) => {
    this.setState({ loading: true });
    setTimeout(() => {
      Emit("addEditEvent", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("The res is-->", res);
        displayLog(res.code, res.message);
        if (res.code === 1) {
          this.props.history.push(routes.MYEVENT);
          //this.setState({ successMsg: res.message });
        }
      });
    }, 1000);
  };
  RemoveImgHandler = () => {
    console.log("remove img");
    let form = this.state.formValues;
    form["img"] = [];
    this.setState({ formValues: form, image_data: "", image_name: "" });
    console.log(this.state.formValues);
  };

  onDrop = (files) => {
    // console.log("FILES ON DROP", files)
    //console.log("FILES ON DROP", files[0])
    let imgvalidate_result = functions.validateImgSize(
      files[0].size / 1024 / 1024
    );
    if (imgvalidate_result.isvalidate) {
      this.setState({
        fileerror: "",
        image_data: files[0],
        image_name: files[0].name,
      });
      let formValues = this.state.formValues;
      formValues["img"] = files;
      this.setState({ formValues: formValues });
      console.log(this.state.formValues);
    } else {
      this.setState({ fileerror: imgvalidate_result.error });
    }
  };
  // loadFile = (event) => {

  //   let imgsrc = window.URL.createObjectURL(event.target.files[0]);
  //   let FileSize = event.target.files[0].size / 1024 / 1024; // in MB
  //   let imgvalidate_result= functions.validateImgSize(FileSize)
  //   console.log(imgvalidate_result)
  //   if (imgvalidate_result.isvalidate) {
  //     //this.setState({ fileError: 'File size must be less then 1 MB' })
  //    // this.setState({error:imgvalidate_result.msg})
  //     alert('File size exceeds 1 MB');
  //   } else {
  //     //this.setState({ imgsrc: imgsrc })
  //     console.log(event)
  //   }
  // }

  render() {
    const files = this.state.formValues.img.map((file) => (
      <li className="imgName" key={file.name}>
        {file.name}{" "}
        <span onClick={this.RemoveImgHandler}>
          <i class="fas fa-times-circle"></i>
        </span>
      </li>
    ));
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}
        <div className="addeventBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              <h1>Create An Event</h1>
              <h2>Host</h2>
            </div>
          </div>
        </div>
        <div className="outerProfile">
          <div className="container">
            <div className="eventFrom">
              <h3>EVENT INFORMATION</h3>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Event Title"
                  name="event_title"
                  value={this.state.formValues.event_title}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="custom-select-box ">
                <select
                  value={this.state.formValues.location}
                  name="location"
                  onChange={this.inputChangedHandler}
                >
                  <option value="">Enter Location</option>
                  <option value="India">India</option>
                  <option value="Us">Us</option>
                  <option value="Australia">Australia</option>
                </select>
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
                    <DatePicker
                      className="form-input-text"
                      selected={this.state.eventdate}
                      onChange={(date) =>
                        this.changestartTime(date, "event_date")
                      }
                      placeholderText="Event Date"
                      minDate={new Date()}
                      showYearDropdown
                      //showMonthDropdown
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-input customTime">
                    {/* <Input className="form-input-text"
                      type="time"
                      name="start_time"
                      value={this.state.formValues.start_time}
                      id="exampleTime"
                      placeholder="Start Time"
                      onChange={this.inputChangedHandler}
                    /> */}

                    {/* <TimePicker
                    //name="start_time"
                     //placeholder="Start Time"
                     use12Hours
                      format="h:mm a"
                     onChange={(time, timeString)=> console.log("t t",time, timeString)}
                     /> */}

                    {/* <GTimePicker
                      time={this.state.formValues.start_time}
                     // theme="Bourbon"
                     theme="Royal"
                      className="timepicker"
                      placeholder="Start Time"
                      onSet={(val)=>this.setstartTime(val)}
                    /> */}

                    <DatePicker
                      className="form-input-text"
                      selected={this.state.starttime}
                      onChange={(date) =>
                        this.changestartTime(date, "start_time")
                      }
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
                    {/* <Input className="form-input-text"
                      type="time"
                      name="end_time"
                      value={this.state.formValues.end_time}
                      id="exampleTime"
                      placeholder="End Time"
                      onChange={this.inputChangedHandler}
                    /> */}

                    <DatePicker
                      className="form-input-text"
                      selected={this.state.endtime}
                      onChange={(date) =>
                        this.changestartTime(date, "end_time")
                      }
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

              <div className="upload-img">
                <h4>UPLOAD IMAGE</h4>
                {/* <label for="drop"> <Dropzone/></label> */}

                <Dropzone onDrop={this.onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input
                          {...getInputProps()}
                          accept="image/png image/jpeg image/jpg"
                        />
                        <p>
                          <img
                            src="images/image-upload.jpg"
                            id="drop"
                            className="img-fluid "
                          />
                        </p>
                      </div>
                      <aside>
                        <ul>{files}</ul>
                      </aside>
                    </section>
                  )}
                </Dropzone>
                <div className="text-center">
                  {this.state.fileerror !== "" ? (
                    <Alert color="danger">{this.state.fileerror}</Alert>
                  ) : null}
                </div>

                {/* <img src="images/image-upload.jpg" id="drop" className="img-fluid" /> */}
              </div>
              <div className="form-input textareaFrom">
                <textarea
                  className="form-input-text"
                  style={{ height: "100%" }}
                  placeholder="Event Description"
                  name="description"
                  value={this.state.formValues.description}
                  onChange={this.inputChangedHandler}
                ></textarea>
              </div>
              {/* <div className="row">
                <div className="col-md-4">
                  <button className="form-input-button">ADD VIDEOS</button>
                </div>
                <div className="col-md-4">
                  <button className="form-input-button">ADD IMAGES</button>
                </div>
                <div className="col-md-4">
                  <button className="form-input-button">ADD MUSIC</button>
                </div>
              </div> */}
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Add a Producer or Presenter"
                />
              </div>
            </div>
            <div className="eventFrom">
              <h3>TICKET INFORMATION</h3>
              {/* <div className="custom-select-box ">
                <select
                  name="ticket_type"
                  value={this.state.formValues.ticket_type}
                  onChange={this.inputChangedHandler}
                >
                  <option value="">Ticket Type</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div> */}
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Ticket Name"
                  name="ticket_name"
                  value={this.state.formValues.ticket_name}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-input">
                    <input
                      type="text"
                      className="form-input-text"
                      placeholder="Quantity"
                      name="quantity"
                      value={this.state.formValues.quantity}
                      onChange={this.inputChangedHandler}
                    />
                    <i class=" form-icon svg-icon">
                      <img src="./images/quantity-icon.svg" />{" "}
                    </i>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-input">
                    <input
                      type="text"
                      className="form-input-text"
                      placeholder="Service Charge"
                      name="service_charge"
                      value={this.state.formValues.service_charge}
                      onChange={this.inputChangedHandler}
                    />
                    <i class=" form-icon svg-icon">
                      <img src="./images/service-icon.svg" />{" "}
                    </i>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-input">
                    <input
                      type="text"
                      className="form-input-text"
                      placeholder="Price"
                      name="price"
                      value={this.state.formValues.price}
                      onChange={this.inputChangedHandler}
                    />
                    <i class=" form-icon svg-icon">
                      <img src="./images/price-icon.svg" />{" "}
                    </i>
                  </div>
                </div>
              </div>
              <div className="form-input textareaFrom">
                <textarea
                  className="form-input-text"
                  placeholder="Ticket Description"
                  style={{ height: "100%" }}
                  name="ticket_description"
                  value={this.state.formValues.ticket_description}
                  onChange={this.inputChangedHandler}
                ></textarea>
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Twitter Handle"
                  name="twitter_handle"
                  value={this.state.formValues.twitter_handle}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input mb-0">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Instagram Handle"
                  name="instagram_handle"
                  value={this.state.formValues.instagram_handle}
                  onChange={this.inputChangedHandler}
                />
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
                  SAVE EVENT LISTING
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

export default Addevent;
