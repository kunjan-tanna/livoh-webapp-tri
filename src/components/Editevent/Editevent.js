import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Redirect } from "react-router-dom";
import { Emit, GetResponse } from "../../util/connect-socket";
import Header from "../header/header";
import Dropzone from "react-dropzone";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import { Alert, Input } from "reactstrap";
import queryString from "query-string";
import moment from "moment";
import Loader from "../Loader/Loader";
import ErrorImage from "../../assets/default.png";
import alertify from "alertifyjs";
import { displayLog } from "../../util/functions";
import { Event_constant } from "../../util/constant";
import DatePicker from "react-datepicker";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";

import "react-datepicker/dist/react-datepicker.css";
import { Link } from "@material-ui/core";

class Editevent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      formValues: {
        name: "",
        location: "",
        date: "",
        start_time: "",
        end_time: "",
        image: "",
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
      img: [],
      image_data: "",
      image_name: "",
      error: "",
      errorevent: "",
      fileerror: "",
      errorField: "",
      successMsg: "",
      starttime: "",
      endtime: "",
      eventdate: "",
      showremove: false,
    };
    this.params = queryString.parse(this.props.location.search);
  }

  componentDidMount() {
    //console.log(this.params)
    let reqData = { event_id: this.params.event_id };
    this.setState({ loading: true });
    setTimeout(() => {
      Emit("getEventDetailsById", reqData);
      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("The res is-->", res);
        if (res.code === 1) {
          this.setState({
            formValues: res.data.events,
            image_name: "Image.png",
            eventdate: new Date(res.data.events.date),
            starttime: new Date(
              `2021-05-31T${res.data.events.start_time}:00.00`
            ),
            endtime: new Date(`2021-05-31T${res.data.events.end_time}:00.00`),
          });
        }
        if (res.code === 401) {
          localStorage.clear();
        }
        if (res.code === 0) {
          // alertify.error(res.message);
          //this.setState({ errorevent: res.message })
          displayLog(res.code, res.message);
          setTimeout(() => {
            window.location.href = routes.MYEVENT;
          }, 2000);
        }
      });
    }, 500);
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
    this.setState({ formValues: form });
  };

  changestartTime = (date, name) => {
    let form = this.state.formValues;
    if (name == "start_time") {
      form["start_time"] = moment(date).format("HH:mm");
      this.setState({ formValues: form, starttime: date });
    } else if (name == "end_time") {
      form["end_time"] = moment(date).format("HH:mm");
      this.setState({ formValues: form, endtime: date });
    } else if (name == "date") {
      form["date"] = moment(date).format("YYYY-MM-DD");
      this.setState({ formValues: form, eventdate: date });
    }
  };

  saveEventHandler = () => {
    let obj = {
      event_title: this.state.formValues.name,
      location: this.state.formValues.location,
      event_date: this.state.formValues.date,
      start_time: this.state.formValues.start_time.replace(/:/g, ""),
      end_time: this.state.formValues.end_time.replace(/:/g, ""),
      image: this.state.image_name,
      description: this.state.formValues.description,
      // Ticket_type: this.state.formValues.ticket_type.toString(),
      Ticket_name: this.state.formValues.ticket_name,
      Ticket_quantity: this.state.formValues.quantity.toString(),
      service_charge: this.state.formValues.service_charge.toString(),
      Ticket_price: this.state.formValues.price.toString(),
      Ticket_description: this.state.formValues.ticket_description,
      twitter_handle: this.state.formValues.twitter_handle,
      instagram_handle: this.state.formValues.instagram_handle,
    };
    this.validateFormData(obj);
  };
  validateFormData = (body) => {
    let startTime = +this.state.formValues.start_time.replace(/:/g, "");
    let schema = Joi.object().keys({
      event_title: Joi.string().trim().required(),
      location: Joi.string().trim().required(),
      event_date: Joi.string().trim().required(),
      // start_time: Joi.string().trim().required(),
      // end_time: Joi.string().trim().required(),
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
      twitter_handle: Joi.string()
        .trim()
        .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
        .required(),
      instagram_handle: Joi.string()
        .trim()
        .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
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
        let reqdata = {
          event_id: this.params.event_id,
          name: this.state.formValues.name,
          location: this.state.formValues.location,
          date: this.state.formValues.date,
          start_time: this.state.formValues.start_time,
          end_time: this.state.formValues.end_time,
          description: this.state.formValues.description,
          // ticket_type: +this.state.formValues.ticket_type,
          ticket_name: this.state.formValues.ticket_name,
          quantity: +this.state.formValues.quantity,
          service_charge: +this.state.formValues.service_charge,
          price: +this.state.formValues.price,
          ticket_description: this.state.formValues.ticket_description,
          twitter_handle: this.state.formValues.twitter_handle,
          instagram_handle: this.state.formValues.instagram_handle,
        };
        if (this.state.image_name != "") {
          reqdata.image_name = this.state.image_name;
        }

        if (this.state.image_data != "") {
          reqdata.image_data = this.state.image_data;
        }

        this.saveEventReq(reqdata);
        this.setState({ loading: true });
      }
    });
  };
  saveEventReq = (reqData) => {
    Emit("addEditEvent", reqData);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      displayLog(res.code, res.message);
      if (res.code === 1) {
        setTimeout(() => {
          this.props.history.push(routes.MYEVENT);
        }, 3000);
        //this.setState({ successMsg: res.message });
      }
      if (res.code === 401) {
        localStorage.clear();
      }
    });
  };
  RemoveImgHandler = () => {
    // this.setState({ img: []})
    this.setState({
      formValues: { ...this.state.formValues, ["image"]: "" },
      image_data: "",
      image_name: "",
    });
    this.setState({ showremove: !this.state.showremove });
  };

  // onDrop = (files) => {
  //     // console.log("FILES ON DROP", files)
  //     //console.log("FILES ON DROP", files[0])
  //     let imgvalidate_result = functions.validateImgSize(files[0].size / 1024 / 1024)
  //     if (imgvalidate_result.isvalidate) {
  //         this.setState({ fileerror: "", image_data: files[0], image_name: files[0].name, img: files })
  //         let imgsrc = window.URL.createObjectURL(files[0]);
  //         let formValues = this.state.formValues;
  //         formValues["image"] = imgsrc;
  //         this.setState({ formValues: formValues })
  //         // console.log(this.state.formValues);
  //     }
  //     else {
  //         this.setState({ fileerror: imgvalidate_result.error })
  //     }
  // };

  loadFile = (event) => {
    let imgsrc = window.URL.createObjectURL(event.target.files[0]);
    let FileSize = event.target.files[0].size / 1024 / 1024; // in MB

    let imgvalidate_result = functions.validateImgSize(FileSize);
    if (imgvalidate_result.isvalidate) {
      this.setState({ fileerror: "" });
      let form = this.state.formValues;
      form["image"] = imgsrc;
      this.setState({ formValues: form });
      this.setState({ image_data: event.target.files[0] });
      this.setState({ image_name: event.target.files[0].name });
    } else {
      this.setState({ fileerror: imgvalidate_result.error });
    }
  };

  render() {
    const files = this.state.img.map((file) => (
      <li key={file.name}>
        {file.name} <span onClick={this.RemoveImgHandler}>X</span>
      </li>
    ));

    return (
      <div>
        {/* { console.log("Dateeeeee" , moment(this.state.formValues.date).format("YYYY-MM-DD"))} */}
        {/* { console.log("Dateeeeee" ,this.state.formValues.date)} */}
        {this.state.loading && <Loader />}
        <Header />

        <div className="addeventBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              <h1>Edit An Event</h1>
              <h2>Host</h2>
            </div>
          </div>
        </div>
        {this.state.errorevent !== "" ? (
          <div className="text-center">
            <Alert color="danger">{this.state.errorevent}</Alert>
          </div>
        ) : null}
        <div className="outerProfile">
          <div className="container">
            <div className="eventFrom">
              <h3>EVENT INFORMATION</h3>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Event Title"
                  name="name"
                  value={this.state.formValues.name}
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
                                            name="date"
                                            id="exampleDate"
                                            // min="2021-04-13"
                                            min={moment().format("YYYY-MM-DD")}
                                            // max={moment(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD")}
                                            value={moment(this.state.formValues.date).format("YYYY-MM-DD")}
                                            placeholder="event date"
                                            onChange={this.inputChangedHandler}
                                        /> */}

                    <DatePicker
                      className="form-input-text"
                      selected={this.state.eventdate}
                      // selected={this.state.formValues.date}
                      // selected={"Fri May 07 2021 00:00:00 GMT+0530 (India Standard Time)"}

                      onChange={(date) => this.changestartTime(date, "date")}
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
                                            placeholder="time placeholder"
                                            onChange={this.inputChangedHandler}
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
                                            placeholder="time placeholder"
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
                      dateFormat="h:mm aa"
                    />
                  </div>
                </div>
              </div>
              <div className="upload-img">
                {/* <img src={this.state.formValues.image || "images/default.png"} className="uploaded_img" /> */}

                <div className="uploadPhotoOuter">
                  <img
                    src={this.state.formValues.image || "images/default.png"}
                    className="editevent_img"
                  />
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/png image/jpeg image/jpg "
                    onChange={this.loadFile}
                    style={{ display: "none" }}
                  />
                  <label
                    className="uploadImg"
                    for="avatar"
                    style={{ cursor: "pointer" }}
                  >
                    Upload Image{" "}
                    <img src="images/upload-icon.svg" className="uploadIcon" />
                  </label>
                  <button
                    type="button"
                    className="blueinnerBtn text-center"
                    onClick={() =>
                      this.setState({ showremove: !this.state.showremove })
                    }
                  >
                    Remove
                  </button>
                </div>

                <Modal
                  isOpen={this.state.showremove}
                  // toggle={() => this.showLogoutModal()}
                >
                  <ModalHeader id="modal-header-css">
                    Are you sure you want to remove the Image?
                  </ModalHeader>
                  <ModalFooter id="modal-footer-css">
                    <Button
                      style={{ backgroundColor: "red" }}
                      variant="contained"
                      className="text-white btn-danger mx-2"
                      onClick={() =>
                        this.setState({ showremove: !this.state.showremove })
                      }
                    >
                      No
                    </Button>
                    <Button
                      style={{ backgroundColor: "#3C16D5" }}
                      className="text-white"
                      variant="contained"
                      onClick={() => this.RemoveImgHandler()}
                    >
                      Yes
                    </Button>
                  </ModalFooter>
                </Modal>

                {/* <h4>UPLOAD IMAGE</h4> */}
                {/* <label for="drop"> <Dropzone/></label> */}

                {/* <Dropzone onDrop={this.onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section >
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <input {...getInputProps()} accept="image/png image/jpeg image/jpg" />
                                                <p>
                                                    <img src="images/image-upload.jpg" id="drop" className="img-fluid" />
                                                </p>
                                            </div>
                                            <aside> */}
                {/* <h4>Files</h4> */}
                {/* <ul>{files}</ul> */}
                {/* </aside>
                                        </section>
                                    )}
                                </Dropzone> */}
                <div>
                  {this.state.fileerror !== "" ? (
                    <Alert color="danger">{this.state.fileerror}</Alert>
                  ) : null}
                </div>

                {/* <img src="images/image-upload.jpg" id="drop" className="img-fluid" /> */}
              </div>
              <div className="form-input textareaFrom">
                <textarea
                  className="form-input-text h-100"
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
              {/* <div className="form-input">
                                <input type="text" className="form-input-text" placeholder="ADD A PRODUCER OR PRESENTER" />
                            </div> */}
            </div>
            <div className="eventFrom">
              <h3>TICKET INFORMATION</h3>
              {/* <div className="custom-select-box ">
                <select
                  name="ticket_type"
                  value={this.state.formValues.ticket_type}
                  onChange={this.inputChangedHandler}
                >
                  <option>TICKET TYPE</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
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
                  className="form-input-text h-100"
                  placeholder="Ticket Description"
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
            <div>
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
                <button
                  type="button"
                  className="pinkBtn text-center"
                  onClick={() =>
                    this.props.history.push({
                      pathname: routes.VIEWEREVENT,
                      search: `?event_id=${this.params.event_id}`,
                    })
                  }
                >
                  View Event
                </button>
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

export default Editevent;
