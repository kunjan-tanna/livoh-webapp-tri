import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";
import { Emit, GetResponse } from "../../util/connect-socket";
import Userinfo from "../../constants/Dashboard";
import Loader from "../Loader/Loader";
import ViewerDashboard from "../ViewerDashboard/ViewerDashboard";
//import { Link } from "@material-ui/core";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      loading: false,
      openModal: false,
    };
  }

  async componentDidMount() {
    // console.log('this.props@@@@-->', this.props);
    // if (localStorage.getItem('userFilters')) {
    //     let data = JSON.parse(localStorage.getItem('userFilters'));
    //     localStorage.removeItem('userFilters');
    //     await this.setState({
    //         page_no: data.page_no,
    //         limit: data.limit,
    //         searchStr: data.searchStr,
    //     })
    // }
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
      if (res.code === 401) {
        localStorage.clear();
      }
      //this.setState({ data: res });
      // this.setState({ list: res.data.users, total: res.data.total });
    });
  };
  openAddEventModal = () => {
    this.setState({ openModal: true });
  };
  handleClose = () => {
    this.setState({ openModal: false });
  };
  render() {
    return (
      <div>
        <Header />
        {this.state.loading && <Loader />}

        <>
          <div className="dashboardBanner bannerImg">
            <div className="bannerText">
              <div className="container">
                <h1>My Dashboard</h1>
                <h2>host</h2>
              </div>
            </div>
          </div>
          {/* Same For Viewer & Host */}
          <div className="container">
            <div className="userBioDetail">
              <div className="row row-eq-height">
                <div className="col-md-4 bioDetail-4">
                  <label>full name</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.data.full_name || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>company name</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.data.company_name || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>address</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.data.address || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4 mb-md-5">
                  <label>email</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.data.email || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4 mb-md-5">
                  <label>mobile phone</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.data.phone_number || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>default currency</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.data.currency || Userinfo.Userinfo}
                  </span>
                </div>
                <div className="col-md-4 bioDetail-4">
                  <label>primary phone</label>
                  <span style={{ wordBreak: "break-all" }}>
                    {this.state.data.primary_phone_number || Userinfo.Userinfo}
                  </span>
                </div>
              </div>
              {/* <div className="text-right edit-detail"><a href={routes.EDITUSER} className="textLink" title="edit">edit</a></div> */}
              <div className="text-right edit-detail">
                <NavLink to={routes.EDITUSER} className="textLink" title="edit">
                  Edit
                </NavLink>
              </div>
            </div>

            <div className="userMoreOption">
              <div className="row">
                <div className="col-md-4 col-6">
                  <div className="outerBox d-table">
                    <NavLink
                      to={routes.EDITPROFILE}
                      title="Edit Profile"
                      className="outerBoxLink  d-table-cell align-middle"
                    >
                      <i className="fal fa-user-edit iconLink"></i>
                      <span>
                        edit <br />
                        profile
                      </span>
                    </NavLink>
                  </div>
                </div>

                {/* <div className="col-md-4 col-6">
                  <div className="outerBox d-table">
                    <NavLink
                      to={routes.MYEVENT}
                      title="View Events"
                      className="outerBoxLink  d-table-cell align-middle"
                    >
                      <i class="fal fa-calendar-alt iconLink"></i>
                      <span>
                        my <br />
                        events
                      </span>
                    </NavLink>
                  </div>
                </div> */}
                {localStorage.getItem("role") == 2 ||
                localStorage.getItem("role") == 4 ? (
                  <>
                    <div className="col-md-4 col-6">
                      <div className="outerBox d-table">
                        <NavLink
                          to="#"
                          onClick={() => this.openAddEventModal()}
                          title="Create Subscription "
                          className="outerBoxLink  d-table-cell align-middle"
                        >
                          <i class="fa fa-plus iconLink"></i>
                          <span>
                            Create <br />
                            Subscription
                          </span>
                        </NavLink>
                      </div>
                    </div>{" "}
                    <div className="col-md-4 col-6">
                      <div className="outerBox d-table">
                        <NavLink
                          to="#"
                          onClick={() => this.openAddEventModal()}
                          title="Event Statistics"
                          className="outerBoxLink  d-table-cell align-middle"
                        >
                          <i class="fal fa-ticket-alt iconLink"></i>
                          <span>
                            My <br />
                            subscriptions
                          </span>
                        </NavLink>
                      </div>
                    </div>
                  </>
                ) : localStorage.getItem("role") == 3 ? (
                  <>
                    {" "}
                    <div className="col-md-4 col-6">
                      <div className="outerBox d-table">
                        <NavLink
                          to={routes.ADDSUBSCRIPTION}
                          title="Create Subscription "
                          className="outerBoxLink  d-table-cell align-middle"
                        >
                          <i class="fa fa-plus iconLink"></i>
                          <span>
                            Create <br />
                            Subscription
                          </span>
                        </NavLink>
                      </div>
                    </div>{" "}
                    <div className="col-md-4 col-6">
                      <div className="outerBox d-table">
                        <NavLink
                          to={routes.MYSUBSCRIPTION}
                          title="Event Statistics"
                          className="outerBoxLink  d-table-cell align-middle"
                        >
                          <i class="fal fa-ticket-alt iconLink"></i>
                          <span>
                            My <br />
                            subscriptions
                          </span>
                        </NavLink>
                      </div>
                    </div>{" "}
                  </>
                ) : null}

                <div className="col-md-4 col-6">
                  <div className="outerBox d-table">
                    <NavLink
                      to={routes.MAKEPAYMENT}
                      title="Payment Methods"
                      className="outerBoxLink  d-table-cell align-middle"
                    >
                      <i className="fal fa-credit-card iconLink"></i>
                      <span>
                        payment <br />
                        methods
                      </span>
                    </NavLink>
                  </div>
                </div>

                <div className="col-md-4 col-6">
                  <div className="outerBox d-table">
                    <NavLink
                      to={routes.TRANSACTION}
                      title="View Transaction"
                      className="outerBoxLink  d-table-cell align-middle"
                    >
                      <i className="fas fa-exchange-alt iconLink"></i>
                      <span>
                        view <br />
                        transaction
                      </span>
                    </NavLink>
                  </div>
                </div>
                <div className="col-md-4 col-6">
                  <div className="outerBox d-table">
                    <NavLink
                      to={routes.DASHBOARD}
                      title="Referal Options"
                      className="outerBoxLink  d-table-cell align-middle"
                    >
                      <i class="fal fa-bullhorn iconLink"></i>
                      <span>
                        Referal <br />
                        options
                      </span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
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
          </div>
        </>

        {/* <Jointherevolution /> */}
        <Footer />
      </div>
    );
  }
}

export default Dashboard;
