import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, Link, withRouter, Router } from "react-router-dom";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog/DeleteConfirmationDialog";
import Joi from "joi-browser";
import * as functions from "../../util/functions";
import md5 from "md5";
import { Emit, GetResponse } from "../../util/connect-socket";
import { displayLog } from "../../util/functions";
import $ from "jquery";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  FormGroup,
  Input,
  Label,
  Alert,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
  DropdownItem,
} from "reactstrap";
import Button from "@material-ui/core/Button";
const style = {
  nav: {
    color: "#fff",
    textTransform: "uppercase",
    cursor: "pointer",
  },
};
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalisopen: false,
      showHostModal: false,
      show: false,
      showlogout: false,
      formValues: {
        current_password: "",
        new_password: "",
        confirm_password: "",
      },
      error: "",
      errorField: "",
      successmsg: "",
      loading: false,
      openModal: false,
      openHeader: false,
      openMobMenu: true,
      openSubMenu: false,
    };
  }
  // componentDidMount() {
  //   window.scrollTo(0, 0);
  // }
  logoutPopup = () => {
    console.log("logout clcik");
    this.refs.deleteConfirmationDialog.open();
  };
  logout = () => {
    // localStorage.getItem('user_type') == AppConfig.superAdminType ? this.props.history.push('/login') : this.props.history.push('/carrier/login')
    // this.refs.deleteConfirmationDialog.close();
    localStorage.clear();
    window.location.reload();
    // this.props.history.push(routes.SIGNIN);
  };
  // showModal = () => {
  // 	console.log("chnge clcik")
  // 	this.setState({modalisopen:true});
  // }

  // modal start
  toggle = () => {
    this.setState({
      langDropdownOpen: !this.state.langDropdownOpen,
    });
  };
  onChangeHandler = (e) => {
    var formValues = this.state.formValues;
    var name = e.target.name;

    formValues[name] = e.target.value;
    this.setState({ formValues: formValues }, () => {
      // console.log(this.state.formValues);
    });
  };

  onPressChangePwd = async () => {
    let obj = {
      current_password: this.state.formValues.current_password,
      new_password: this.state.formValues.new_password,
      confirm_new_password: this.state.formValues.confirm_password,
      ///user_id: localStorage.getItem('user_id')
    };

    this.validateFormData(obj);
  };
  // onPressChangePwd = async () => {
  // 	console.log('hhhhhhhhhhhhhhhhhhhhh');
  // 	let schema = Joi.object().keys({
  // 		current_password: Joi.string().strict().trim().min(6).label('Current Password').required(),
  // 		new_password: Joi.string().strict().trim().min(6).label('New Password').required(),
  // 		//confirm_password: Joi.string().strict().trim().min(6).label('Confirm Password').required(),
  // 		confirm_password: Joi.string()
  // 		.valid(this.state.formValues.new_password)
  // 		.required()
  // 		.label('confirm_password')
  // 		.error(
  // 			errors => 'Password and Confirm Password must be same!'
  // 		),
  // 	})
  // 	//this.setState({ error: await validateSchema(this.state.formValues, schema) });
  // 	let errorLog = functions.validateSchema(error)
  // 	if (!this.state.error.status) {
  // 		if (String(this.state.formValues.new_password) !== String(this.state.formValues.confirm_password)) {
  // 	//		displayLog(0, "New password and confirm password must be same.");
  // 		} else {
  // 			let data = {
  // 				old_password: this.state.formValues.current_password,
  // 				new_password: this.state.formValues.new_password,
  // 				confirm_new_password: this.state.formValues.confirm_password,
  // 				user_id: localStorage.getItem('user_id')
  // 			}
  // 	//		const response = await apiCall('POST', 'changePassword', data);
  // 	//		displayLog(response.code, response.message);
  // 			localStorage.clear();
  // 			window.location.reload();
  // 			//this.props.history.push('/signin');
  // 		}
  // 	} else {
  // 		console.log('\n\n 333333333333333333333-->', this.state.error);
  // 	//	displayLog(0, this.state.error.message);
  // 	}
  // }
  // inputChangeHandler = (e) => {
  // 	//this.setState({ form: formValueChangeHandler(e, this.state.form) });
  // }

  validateFormData = async (body) => {
    console.log("bosy==============", body);

    let schema = Joi.object().keys({
      current_password: Joi.string().trim().required(),
      new_password: Joi.string().trim().required().min(6),
      confirm_new_password: Joi.string().trim().required().min(6),
      // confirm_new_password: Joi.string()
      // 	.valid(this.state.formValues.new_password)
      // 	.required()
      // 	.label('confirm_password')
      // 	.error(
      // 		error => 'New Password and Confirm Password must be same!'
      // 	),
    });
    Joi.validate(body, schema, (error, value) => {
      if (error) {
        console.log("\n\n error=-->", error);
        if (
          error.details[0].message !== this.state.error ||
          error.details[0].context.key !== this.state.errorField
        ) {
          //let errorLog = validateSchema(error)
          let errorLog = functions.validateSchema(error);
          console.log("\n\n error=- ghghgh ->", errorLog);
          this.setState({
            error: errorLog.error,
            errorField: errorLog.errorField,
          });
        }
      } else {
        this.setState({ error: "", errorField: "" }, () => {
          this.changePwd();
        });
      }
    });
  };
  changePwd = async () => {
    if (
      this.state.formValues.new_password.trim() ===
      this.state.formValues.confirm_password.trim()
    ) {
      let reqData = {
        old_password: md5(this.state.formValues.current_password.trim()),
        new_password: md5(this.state.formValues.new_password.trim()),
        //confirm_password: this.state.formValues.confirm_password.trim(),
        // calledFor: localStorage.getItem('user_type')
      };
      //api
      Emit("changePassword", reqData);
      this.setState({ loading: true });
      //getting response
      GetResponse((response) => {
        this.setState({ loading: false });
        console.log("$$$$$$$ res->", response);
        if (response.code == 1) {
          displayLog(response.code, response.message);
          this.showChangePassModal();
          //	this.setState({ successmsg: response.message })
        }
        if (response.code == 0) {
          this.setState({ error: response.message });
        }
      });
    } else {
      this.setState({
        error: "New Password and Confirm Password must be same!",
      });
    }
    //this.showModal()
  };
  enterPressed = (event) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      this.onPressChangePwd();
    }
  };

  showHostModal = () => {
    this.setState({
      showHostModal: !this.state.showHostModal,
      error: "",
      successmsg: "",
    });
  };
  showChangePassModal = () => {
    // console.log("OPEN MODAL", this.state.openSubMenu);

    this.setState({
      show: !this.state.show,
      formValues: {
        current_password: "",
        new_password: "",
        confirm_password: "",
      },
      error: "",
      successmsg: "",
    });
  };

  showLogoutModal = () => {
    this.setState({
      showlogout: !this.state.showlogout,
      formValues: {
        current_password: "",
        new_password: "",
        confirm_password: "",
      },
      error: "",
      successmsg: "",
    });
  };
  BecomeHost = () => {
    this.setState({ loading: true, successmsg: "", error: "" });
    let reqData = {};
    //api
    Emit("toBecomeaHost", reqData);
    GetResponse((response) => {
      this.setState({ loading: false });
      this.showHostModal();
      displayLog(response.code, response.message);
      console.log("$$$$$$$ res->", response);
      if (response.code == 1) {
        //this.setState({ successmsg: response.message })
      }
      if (response.code == 0) {
        this.setState({ error: response.message });
      }
    });
  };
  openAddEventModal = () => {
    this.setState({ openModal: true });
  };
  handleClose = () => {
    this.setState({ openModal: false });
  };
  toggleMenu = () => {
    this.setState({ openHeader: true }, () => {
      $("body").toggleClass("menu-open");
    });
  };
  openMobMenu = () => {
    $("body").removeClass("menu-open");
  };
  openMobSubMenu = () => {
    this.setState({ openSubMenu: true }, () => {
      $("body").toggleClass("menu-open");
    });
  };
  closeMenuOpen = () => {
    this.setState({ openSubMenu: false }, () => {
      $("body").removeClass("menu-open");
    });
  };
  render() {
    // console.log("HELLO", this.state.openSubMenu);
    return (
      <header>
        <div className="row align-items-center">
          <div className="logoLeft col-md-2 col-3">
            {localStorage.getItem("role") == 1 ? (
              <Link to={routes.VIEWERDASHBOARD}>
                <img src="images/logo.svg" />
              </Link>
            ) : null}
            {localStorage.getItem("role") == 2 ||
            localStorage.getItem("role") == 3 ||
            localStorage.getItem("role") == 4 ? (
              <Link to={routes.DASHBOARD}>
                <img src="images/logo.svg" />
              </Link>
            ) : null}

            {/* <a href={routes.DASHBOARD}><img src="images/logo.svg" /></a> */}
          </div>
          <div className="col-md-10 col-9 d-flex justify-content-end align-items-center">
            <div className="navigation" onClick={() => this.openMobMenu()}>
              <ul className=" text-right">
                {/* <Link to={routes.UPCOMINGEVENTS}>MY SHOWS!!!</Link> */}

                {localStorage.getItem("role") == 1 ? (
                  <>
                    <li
                      onClick={() =>
                        this.props.history.push(routes.UPCOMINGEVENTS)
                      }
                    >
                      <span style={style.nav}>My SHOWS</span>
                      {/* <Link to={routes.UPCOMINGEVENTS}>MY SHOWS</Link> */}
                    </li>
                    <li
                      onClick={() =>
                        this.props.history.push(routes.SUBSCRIBELIST)
                      }
                    >
                      <span style={style.nav}>MY SUBSCRIPTION</span>
                      {/* <Link to={routes.SUBSCRIBELIST}>MY SUBSCRIPTION</Link> */}
                    </li>
                  </>
                ) : null}

                {localStorage.getItem("role") == 2 ||
                localStorage.getItem("role") == 3 ? (
                  <>
                    <li onClick={() => this.props.history.push(routes.MYEVENT)}>
                      <span style={style.nav}>MY EVENTS</span>
                      {/* <Link to={routes.MYEVENT}>MY EVENTS</Link> */}
                    </li>
                  </>
                ) : null}

                <li onClick={() => this.openMobSubMenu()}>
                  <a title="My Account" style={{ color: "white" }}>
                    MY ACCOUNT
                    <img
                      src="images/arrow.svg"
                      width="18px"
                      // className="arrowImg"
                      // style={{ marginLeft: "5px" }}
                    />
                  </a>

                  <div className="subMenu">
                    <ul>
                      {localStorage.getItem("role") == 1 ? (
                        <>
                          <li
                            onClick={() =>
                              this.props.history.push("/viewerDashboard")
                            }
                          >
                            Dashboard
                          </li>
                        </>
                      ) : localStorage.getItem("role") == 2 ||
                        localStorage.getItem("role") == 3 ||
                        localStorage.getItem("role") == 4 ? (
                        <>
                          <li
                            onClick={() =>
                              this.props.history.push("/dashboard")
                            }
                          >
                            Dashboard
                          </li>
                        </>
                      ) : null}

                      {localStorage.getItem("role") == 2 ||
                      localStorage.getItem("role") == 4 ? (
                        <li onClick={() => this.openAddEventModal()}>
                          Add Event
                        </li>
                      ) : localStorage.getItem("role") == 3 ? (
                        <li
                          onClick={() => this.props.history.push("/addevent")}
                        >
                          Add Event
                        </li>
                      ) : null}

                      {localStorage.getItem("sign_up_with") == 1 ? (
                        <li onClick={this.showChangePassModal}>
                          Change Password
                        </li>
                      ) : null}
                      <li onClick={this.showLogoutModal}> Logout</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <Modal
                isOpen={this.state.showHostModal}
                toggle={() => this.showHostModal()}
              >
                <ModalHeader id="modal-header-css">
                  Want to become Host?
                </ModalHeader>
                {this.state.error !== "" ? (
                  <Col md="12">
                    <Alert color="danger">{this.state.error}</Alert>
                  </Col>
                ) : null}
                {this.state.successmsg !== "" ? (
                  <Col md="12">
                    <Alert color="success">{this.state.successmsg}</Alert>
                  </Col>
                ) : null}
                <ModalFooter id="modal-footer-css">
                  <Button
                    style={{ backgroundColor: "red" }}
                    variant="contained"
                    className="text-white btn-danger mx-2"
                    onClick={this.showHostModal}
                  >
                    No
                  </Button>
                  <Button
                    style={{ backgroundColor: "#3C16D5" }}
                    className="text-white"
                    variant="contained"
                    onClick={() => this.BecomeHost()}
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </Modal>

              <Modal
                isOpen={this.state.show}
                toggle={() => this.showChangePassModal()}
              >
                <ModalHeader id="modal-header-css">Change Password</ModalHeader>
                <ModalBody className="pb-0">
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Input
                          onKeyPress={(e) => this.enterPressed(e)}
                          type="password"
                          id="current_password"
                          onChange={(e) => this.onChangeHandler(e)}
                          value={this.state.formValues.current_password}
                          placeholder="Enter Current Password"
                          name="current_password"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Input
                          onKeyPress={(e) => this.enterPressed(e)}
                          type="password"
                          id="new_password"
                          onChange={(e) => this.onChangeHandler(e)}
                          value={this.state.formValues.new_password}
                          placeholder="Enter New Password"
                          name="new_password"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Input
                          onKeyPress={(e) => this.enterPressed(e)}
                          type="password"
                          id="confirm_password"
                          onChange={(e) => this.onChangeHandler(e)}
                          value={this.state.formValues.confirm_password}
                          placeholder="Confirm Password"
                          name="confirm_password"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {this.state.error !== "" ? (
                    <Col md="12">
                      <Alert color="danger">{this.state.error}</Alert>
                    </Col>
                  ) : null}
                  {this.state.successmsg !== "" ? (
                    <Col md="12">
                      <Alert color="success">{this.state.successmsg}</Alert>
                    </Col>
                  ) : null}
                </ModalBody>

                <ModalFooter id="modal-footer-css">
                  <Button
                    style={{ backgroundColor: "red" }}
                    variant="contained"
                    className="text-white btn-danger mx-2"
                    onClick={this.showChangePassModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ backgroundColor: "#3C16D5" }}
                    className="text-white"
                    variant="contained"
                    onClick={() => this.onPressChangePwd()}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </Modal>

              <Modal
                isOpen={this.state.showlogout}
                toggle={() => this.showLogoutModal()}

                // style={{ maxWidth: "700px", width: "100%" }}
                // className="custom-modal-style"
              >
                <ModalHeader id="modal-header-css">
                  Are you sure you want to logout?
                  {/* <button
                    type="button"
                    className="close_btn"
                    aria-label="Close"
                    onClick={() =>
                      this.setState({ showlogout: !this.state.showlogout })
                    }
                  ></button> */}
                </ModalHeader>
                <ModalFooter id="modal-footer-css">
                  <Button
                    style={{ backgroundColor: "red" }}
                    variant="contained"
                    className="text-white btn-danger mx-2"
                    onClick={this.showLogoutModal}
                  >
                    No
                  </Button>
                  <Button
                    style={{ backgroundColor: "#3C16D5" }}
                    className="text-white"
                    variant="contained"
                    onClick={() => this.logout()}
                  >
                    Yes
                  </Button>
                </ModalFooter>
              </Modal>
              {/* Open Modal for Not Approval For Host */}
              <Modal
                isOpen={this.state.openModal}
                toggle={() => this.handleClose()}
              >
                <ModalHeader toggle={() => this.handleClose()}>
                  {localStorage.getItem("role") == 4
                    ? "Sorry!  your request as a host has been rejected. You can no longer create the event"
                    : null}
                  {localStorage.getItem("role") == 2
                    ? "We are still reviewing your profile. Once we review and approve, you can create the events"
                    : null}
                  {/* {localStorage.getItem("role") == 4 ? "Sorry!  your request as a host has been rejected. You can no longer create the event": " We are still reviewing your profile. Once we review and
                  approve, you can create the events"} */}
                </ModalHeader>
                <ModalFooter id="modal-footer-css">
                  <Button
                    style={{ backgroundColor: "red" }}
                    variant="contained"
                    className="text-white btn-danger mx-2"
                    onClick={this.handleClose}
                  >
                    Okay
                  </Button>
                  {/* <Button
                    style={{ backgroundColor: "#3C16D5" }}
                    className="text-white"
                    variant="contained"
                    onClick={() => this.logout()}
                  >
                    Yes
                  </Button> */}
                </ModalFooter>
              </Modal>
              {/* <DeleteConfirmationDialog
								ref="deleteConfirmationDialog"
								title="Are you sure you want to logout?"
								// message="This will delete user permanently."
								onConfirm={() => this.logout()}
							/> */}
            </div>
            <div className="userPhoto">
              <img
                src={
                  localStorage.getItem("profile_picture") &&
                  localStorage.getItem("profile_picture") != "null"
                    ? localStorage.getItem("profile_picture")
                    : "images/default.png"
                }
              />
            </div>
            <div
              className="nav-icon d-block d-md-none"
              onClick={() => this.toggleMenu()}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(Header);
