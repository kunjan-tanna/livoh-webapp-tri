import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import { Emit, GetResponse } from "../../util/connect-socket";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import Loader from "../Loader/Loader";
import Userinfo from "../../constants/Dashboard";

import Joi from "joi-browser";
import * as functions from "../../util/functions";
import { displayLog } from "../../util/functions";
import { Alert } from "reactstrap";
import { Event_constant } from "../../util/constant";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";

class Viewerprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        profile_picture: "",
        viewer_name: "",
        bio: "",
        facebook_url: "",
        twitter_handler: "",
        instagram_handler: "",
      },
      buffer: "", // image buffer data
      image_name: "",
      showremove: "",
      loading: false,
    };
  }
  componentDidMount() {
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
    await Emit("getOrganizerDetails", req_data);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->kunj", res);
      if (res.code === 1) {
        this.setState({ formValues: res.data });
        // localStorage.setItem("profile_picture", res.data.profile_picture)
      }
    });
  };

  render() {
    const username = localStorage.getItem("username");
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}
        <div className="dashboardBanner bannerImg">
          <div className="bannerText">
            <div className="container">
              {localStorage.getItem("username") !== null ? (
                <h1> {username.toLocaleUpperCase()}</h1>
              ) : (
                <h1>Test</h1>
              )}

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
            {/* <img src="images/img01.jpg" alt="" className="img-fluid" /> */}

            <div className="uploadPhotoOuter viewProfilePhotoBack">
              <img
                src={
                  this.state.formValues.profile_picture || "images/default.png"
                }
                className="uploaded_img"
                style={{ width: "160px !important", height: "170px" }}
              />
              <button
                type="button"
                className="blueinnerBtn text-center"
                onClick={() => this.props.history.push(routes.VIEWERDASHBOARD)}
              >
                Back
              </button>

              {/* <input
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
              </button> */}
            </div>
            <div className="userBioDetail">
              <div className="row row-eq-height">
                <div className="col-md-4 bioDetail-4">
                  <label>full name</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.full_name || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>company name</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.company_name || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>description</label>
                  <span style={{ wordBreak: "break-all" }} className="ellipsis">
                    {this.state.formValues.description || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>Facebook URL</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.facebook_url || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4 mb-md-5">
                  <label>Twitter Handler</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.twitter_handler || Userinfo.Userinfo}
                  </span>
                </div>

                <div className="col-md-4 bioDetail-4">
                  <label>Instagram Handler</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.formValues.instagram_handler ||
                      Userinfo.Userinfo}
                  </span>
                </div>
              </div>
              {/* <div className="text-right edit-detail">
            <NavLink to={routes.EDITUSER} className="textLink" title="edit">
              Edit
            </NavLink>
          </div> */}
            </div>
            {/* <div className="editFrom">
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="viewer name"
                  name="viewer_name"
                  readOnly
                  value={this.state.formValues.company_name}
                  // onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input textareaFrom">
                <textarea
                  className="form-input-text"
                  placeholder="bio"
                  name="bio"
                  readOnly
                  value={this.state.formValues.description}
                  // onChange={this.inputChangedHandler}
                ></textarea>
              </div>

              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="Facebook url"
                  readOnly
                  name="facebook_url"
                  value={this.state.formValues.facebook_url}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="twitter handle"
                  readOnly
                  name="twitter_handler"
                  value={this.state.formValues.twitter_handler}
                  onChange={this.inputChangedHandler}
                />
              </div>
              <div className="form-input">
                <input
                  type="text"
                  className="form-input-text"
                  placeholder="instagram handle"
                  readOnly
                  name="instagram_handler"
                  value={this.state.formValues.instagram_handler}
                  onChange={this.inputChangedHandler}
                />
              </div>

         
            </div> */}
          </div>
        </div>

        <Jointherevolution />
        <Footer />
      </div>
    );
  }
}

export default Viewerprofile;
