import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import { Emit, GetResponse } from "../../util/connect-socket";
import { Alert } from "reactstrap";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import Loader from "../Loader/Loader";
import { displayLog } from "../../util/functions";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";
import ErrorImage from "../../assets/default.png";
import Switch from "@material-ui/core/Switch";
import { Event_constant } from "../../util/constant";
// import Switch from "react-switch";

class Editprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        image_data: "",
        profile_picture: "",
        company_name: "",
        description: "",
        enable_use_description: 0,
        web_site_url: "",
        facebook_url: "",
        twitter_handler: "",
        instagram_handler: "",
        notification_on: 0,
      },

      buffer: "",
      image_name: "",
      error: "",
      errorField: "",
      successMsg: "",
      fileError: "",
      loading: false,
      showremove: "",
      removeImg: null,
      showImg: null,
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
    Emit("getOrganizerDetails", req_data);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->kkkkdhhdhd", res);
      if (res.code === 1) {
        this.setState({ formValues: res.data });
        // localStorage.setItem("profile_picture", res.data.profile_picture)
      }
    });
  };
  loadFile = (event) => {
    // this.setState({ loading: true });
    let imgsrc = window.URL.createObjectURL(event.target.files[0]);

    let FileSize = event.target.files[0].size / 1024 / 1024; // in MB

    let imgvalidate_result = functions.validateImgSize(FileSize);
    if (imgvalidate_result.isvalidate) {
      this.setState({ fileError: "" });
      let form = this.state.formValues;
      form["profile_picture"] = imgsrc;
      form["image_data"] = event.target.files[0];
      this.setState({ formValues: form });
      //console.log(this.state.formValues);
      // console.log("buuffff", event.target.files[0]);
      this.setState({ buffer: event.target.files[0] });
      this.setState({ image_name: event.target.files[0].name });
    } else {
      this.setState({ fileError: imgvalidate_result.error });
    }
    console.log("image state", this.state);
  };

  saveProfileHandler = () => {
    let obj = {
      organizer_name: this.state.formValues.company_name,
      bio: this.state.formValues.description,
      //checkbox: this.state.formValues.enable_use_description?true:false,
      website_url: this.state.formValues.web_site_url,
      facebook_url: this.state.formValues.facebook_url,
      twitter_handler: this.state.formValues.twitter_handler,
      instagram_handler: this.state.formValues.instagram_handler,
    };
    // console.log("saveProfileclick", obj);
    this.validateFormData(obj);
  };
  validateFormData = (body) => {
    let schema = Joi.object().keys({
      organizer_name: Joi.string().trim().required(),
      bio: Joi.string()
        .trim()
        .max(Event_constant.EVENT_DESCRIPTION_MAX_LENGTH)
        .required(),
      // checkbox: Joi.boolean().invalid(false),
      website_url: Joi.string()
        .trim()
        .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
        .required(),
      facebook_url: Joi.string()
        .trim()
        .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
        .required(),
      twitter_handler: Joi.string()
        .trim()
        .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
        .required(),
      instagram_handler: Joi.string()
        .trim()
        .max(Event_constant.INSTA_TWEETER_MAXLENGTH)
        .required(),
    });
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        // console.log(error)
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
          // image_name: this.state.image_name,
          // image_data: this.state.buffer,
          company_name: this.state.formValues.company_name,
          description: this.state.formValues.description,
          enable_use_description: this.state.formValues.enable_use_description
            ? 1
            : 0,
          web_site_url: this.state.formValues.web_site_url,
          facebook_url: this.state.formValues.facebook_url,
          twitter_handler: this.state.formValues.twitter_handler,
          instagram_handler: this.state.formValues.instagram_handler,
          notification_on: this.state.formValues.notification_on ? 1 : 0,
        };
        if (this.state.image_name) {
          reqdata.image_name = this.state.image_name;
        }
        if (this.state.buffer) {
          reqdata.image_data = this.state.buffer;
        }

        this.saveProfile(reqdata);

        // this.setState({ loading: true });
      }
    });
  };
  removeImage = () => {
    console.log("REMOO", this.state.showImg);
    let reqData = {};
    Emit("removeProfileImage", reqData);
    GetResponse((res) => {
      this.setState({ loading: false });
      displayLog(res.code, res.message);
      if (res.code === 1) {
        if (res.data.profile_picture == null) {
          this.setState({ showImg: res.data.profile_picture });
        }
      }
    });
  };
  saveProfile = (reqData) => {
    this.setState({ loading: true });
    setTimeout(() => {
      Emit("editOrganizerImage", reqData);
      GetResponse((res) => {
        // this.setState({ loading: false });
        console.log("The res is-->kkkkk", res);
        displayLog(res.code, res.message);
        if (res.code === 1) {
          if (res.data.profile_picture) {
            this.setState({ showImg: res.data.profile_picture });
            localStorage.setItem("profile_picture", res.data.profile_picture);
          }
          if (this.state.showImg == null) {
            localStorage.setItem("profile_picture", null);
          }
          if (localStorage.getItem("role") == 1) {
            setTimeout(() => {
              this.props.history.push(routes.VIEWERDASHBOARD);
            }, 3000);
          } else {
            setTimeout(() => {
              this.props.history.push(routes.DASHBOARD);
            }, 3000);
            //this.setState({ successMsg: res.message });
          }
          //this.getUserProfile();
        }
      });
    }, 1000);
  };
  inputChangedHandler = (e) => {
    this.setState({ successMsg: "" });
    let name = e.target.name;
    let form = this.state.formValues;

    if (name == "email") {
      form[name] = e.target.value.replace(/^\s+|\s+$/gm, "");
    } else if (name == "enable_use_description") {
      form[name] = !form[name];
    } else {
      form[name] = e.target.value.replace(/^\s+/g, "");
    }
    console.log("form is", form);
    this.setState({ formValues: form });
  };

  switchChangedHandler = (e) => {
    var formValues = this.state.formValues;
    var name = e.target.name;
    formValues[name] = !this.state.formValues.notification_on;
    this.setState({ formValues: formValues }, () => {
      console.log(this.state.formValues);
    });
  };
  RemoveImgHandler = () => {
    this.setState({
      formValues: { ...this.state.formValues, ["profile_picture"]: "" },
      buffer: "",
      image_name: "",
      loading: true,
    });

    this.setState({ showremove: !this.state.showremove });
    this.removeImage();
  };
  viewProfileHandler = () => {
    this.props.history.push(routes.VIEWERPROFILE);
    //console.log("viewProfileclick")
  };
  render() {
    return (
      <div>
        <Header profileImg={this.state.formValues.profile_picture} />
        {this.state.loading && <Loader />}
        <div className="dashboardBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              <h1>Edit Profile</h1>
              {localStorage.getItem("role") == 1 ? (
                <h2>Viewer</h2>
              ) : (
                <h2>Host</h2>
              )}
            </div>
          </div>
        </div>
        <div className="outerProfile">
          <div className="container">
            {/* <img src="images/img01.jpg" className="img-fluid" /> */}

            <div className="uploadPhotoOuter">
              <img
                src={
                  this.state.formValues.profile_picture || "images/default.png"
                }
                className="uploaded_img"
                // style={{ width: "160px !important", height: "170px" }}
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
                onClick={() => {
                  this.state.formValues.profile_picture
                    ? this.setState({
                        showremove: !this.state.showremove,
                        loading: false,
                      })
                    : displayLog(0, "Please Upload Image");
                }}
              >
                Remove
              </button>
            </div>

            <Modal
              isOpen={this.state.showremove}
              // toggle={() => this.showLogoutModal()}
            >
              <ModalHeader id="modal-header-css">
                Are you sure you want to remove the image?
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

            <div>
              {this.state.fileError !== "" ? (
                <Alert color="danger">{this.state.fileError}</Alert>
              ) : null}
            </div>

            <div className="editFrom">
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Organizer Name"
                  name="company_name"
                  value={this.state.formValues.company_name}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input textareaFrom">
                <textarea
                  className="form-input-text"
                  placeholder="Bio"
                  name="description"
                  value={this.state.formValues.description}
                  onChange={this.inputChangedHandler}
                ></textarea>
              </div>

              <div className="text-left checkBoxOuter">
                <label className="control control--checkbox">
                  use description on events page
                  <input
                    type="checkbox"
                    checked={this.state.formValues.enable_use_description}
                    name="enable_use_description"
                    onChange={this.inputChangedHandler}
                  />
                  <div className="control__indicator" />
                </label>
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Website url"
                  name="web_site_url"
                  value={this.state.formValues.web_site_url}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Facebook url"
                  name="facebook_url"
                  value={this.state.formValues.facebook_url}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Twitter Handle"
                  name="twitter_handler"
                  value={this.state.formValues.twitter_handler}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Instagram Handle"
                  name="instagram_handler"
                  value={this.state.formValues.instagram_handler}
                  onChange={this.inputChangedHandler}
                />
              </div>

              <div className="text-left checkBoxOuter">
                <label className="control control--checkbox">
                  Allow Notification
                  <input
                    type="checkbox"
                    checked={this.state.formValues.notification_on}
                    name="notification_on"
                    onChange={this.switchChangedHandler}
                  />
                  <div className="control__indicator" />
                </label>
              </div>
              {/* <label>
                  Allow Notification
                </label>
                <label class="switch">
                  <input type="checkbox" checked={this.state.formValues.notification_on} name="notification_on" onChange={this.switchChangedHandler} />
                  <span class="slider round"></span>
                </label> */}

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
                  <button
                    type="button"
                    className="pinkBtn text-center"
                    onClick={this.viewProfileHandler}
                  >
                    view profile
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

export default Editprofile;
