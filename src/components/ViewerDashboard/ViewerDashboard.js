import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import Header from "../header/header";
import Loader from "../Loader/Loader";
import Userinfo from "../../constants/Dashboard";
import { NavLink, Redirect } from "react-router-dom";
import routes from "../../Routes";
import { Emit, GetResponse } from "../../util/connect-socket";

function ViewerDashboard(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const getUserProfile = async () => {
    let req_data = {
      //page_no: this.state.page_no,
      //limit: this.state.limit
    };
    Emit("getUserProfile", req_data);
    GetResponse((res) => {
      setLoading(false);

      if (res.code === 1) {
        setData(res.data);
      }
      if (res.code === 401) {
        localStorage.clear();
      }
      //this.setState({ data: res });
      // this.setState({ list: res.data.users, total: res.data.total });
    });
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getUserProfile();
    }, 500);
  }, []);

  return (
    <div>
      <Header />
      {loading && <Loader />}

      <div className="dashboardBanner bannerImg">
        <div className="bannerText">
          <div className="container">
            <h1>My Dashboard</h1>
            <h2>Viewer</h2>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="userBioDetail">
          <div className="row row-eq-height">
            <div className="col-md-4 bioDetail-4">
              <label>full name</label>
              <span style={{ wordBreak: "break-all" }}>
                {data.full_name || Userinfo.Userinfo}
              </span>
            </div>
            <div className="col-md-4 bioDetail-4">
              <label>company name</label>
              <span style={{ wordBreak: "break-all" }}>
                {data.company_name || Userinfo.Userinfo}
              </span>
            </div>
            <div className="col-md-4 bioDetail-4">
              <label>address</label>
              <span style={{ wordBreak: "break-all" }}>
                {data.address || Userinfo.Userinfo}
              </span>
            </div>
            <div className="col-md-4 bioDetail-4 mb-md-5">
              <label>email</label>
              <span style={{ wordBreak: "break-all" }}>
                {data.email || Userinfo.Userinfo}
              </span>
            </div>
            <div className="col-md-4 bioDetail-4 mb-md-5">
              <label>mobile phone</label>
              <span style={{ wordBreak: "break-all" }}>
                {data.phone_number || Userinfo.Userinfo}
              </span>
            </div>
            <div className="col-md-4 bioDetail-4">
              <label>default currency</label>
              <span style={{ wordBreak: "break-all" }}>
                {data.currency || Userinfo.Userinfo}
              </span>
            </div>
            <div className="col-md-4 bioDetail-4">
              <label>primary phone</label>
              <span style={{ wordBreak: "break-all" }}>
                {data.primary_phone_number || Userinfo.Userinfo}
              </span>
            </div>
          </div>
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
            <div className="col-md-4 col-6">
              <div className="outerBox d-table">
                <NavLink
                  to={routes.WALLET}
                  title="My Wallet"
                  className="outerBoxLink  d-table-cell align-middle"
                >
                  <i class="fal fa-wallet iconLink"></i>
                  <span>
                    My <br />
                    Wallet
                  </span>
                </NavLink>
              </div>
            </div>
            {/* <div className="col-md-4 col-6">
              <div className="outerBox d-table">
                <NavLink
                  to={routes.PAYMENT}
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
            </div> */}

            <div className="col-md-4 col-6">
              <div className="outerBox d-table">
                <NavLink
                  to={routes.UPCOMINGEVENTS}
                  title="Upcoming Shows"
                  className="outerBoxLink  d-table-cell align-middle"
                >
                  <i class="fal fa-calendar-alt iconLink"></i>
                  <span>
                    my upcoming <br />
                    shows
                  </span>
                </NavLink>
              </div>
            </div>
            <div className="col-md-4 col-6">
              <div className="outerBox d-table">
                <NavLink
                  to={routes.SUBSCRIBELIST}
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

            <div className="col-md-4 col-6">
              <div className="outerBox d-table">
                <NavLink
                  to={routes.VIEWERDASHBOARD}
                  title="Referal Options"
                  className="outerBoxLink  d-table-cell align-middle"
                >
                  <i class="fal fa-bullhorn iconLink"></i>
                  <span>
                    Referal <br />
                    codes
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViewerDashboard;
