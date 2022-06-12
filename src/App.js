import {
  BrowserRouter,
  HashRouter,
  Route,
  Switch,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import React, { useState, useEffect, useLayoutEffect } from "react";
import "alertifyjs/build/css/alertify.css";
import routes from "./Routes";
import { displayLog } from "./util/functions";
import { connect } from "react-redux";

import { NotificationContainer } from "react-notifications";

import Home from "./components/home/home";
import Signin from "./components/signin/signin";
import Signup from "./components/signup/signup";
import Forgotpwd from "./components/forgotpassword/forgotpassword";
import Dashboard from "./components/dashboard/dashboard";
import Header from "./components/header/header";
import Editprofile from "./components/editprofile/editprofile";
import Addevent from "./components/addevent/addevent";
import Liveevent from "./components/liveevent/liveevent";
import Myevent from "./components/myevent/myevent";
import Editevent from "./components/Editevent/Editevent";
import Session from "./components/session/session";
import Transaction from "./components/transaction/transaction";
import Verifyemail from "./components/Verifyemail/Verifyemail";
import Edituser from "./components/edituser/edituser";
import Forgotpassword from "./components/forgotpassword/forgotpassword";
import Resetpassword from "./components/Resetpassword/Resetpassword";
import Termsandconditions from "./components/Termsandconditions/Termsandconditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import Welcome from "./components/Welcome/Welcome";
import MakePayment from "./components/MakePayment/MakePayment";
import UpcomingEvents from "./components/UpcomingEvents/UpcomingEvents";
import Stream from "./components/AgoraVideoCall/index";
import Offer from "./components/offer/offer";
import Viewerprofile from "./components/viewerprofile/viewerprofile";

import Index from "./pages/index";
import Meeting from "./pages/meeting/index1";
import ViewerDashboard from "./components/ViewerDashboard/ViewerDashboard";
import chooseAccount from "./components/chooseAccount/chooseAccount";
import SubscriptionList from "./components/subscriptionList/SubscriptionList";
import Viewevent from "./components/viewEvent/viewevent";
// import PaymentMethod from "./components/PaymentMethod/PaymentMethod";

import wallet from "./components/wallet/wallet";
import Payment from "./components/PaymentMethod1/Payment";
import Addsubscription from "./components/addsubscription/addsubscription";
import MySubscriptions from "./components/Mysubscriptions/MySubscriptions";
import SubscriptionPurchase from "./components/subscribe/subscriptionPurchase";
import ScrollToTop from "./ScrollToTop";
import Vieweventwithoutlogin from "./components/viewEvent/vieweventwithoutlogin";

let authenticated;

function App(props) {
  console.log("PROPPPSS", props);
  // useEffect(() => {
  //   return () => {
  //     window.location.reload();
  //   };
  // });
  // useEffect(() => {
  //   console.log("HELLO");
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        {props?.authToken !== "" ? (
          <>
            {/* Passing thr Role 
            Role 1 - means Viewer side
      Role 2 - Means applied for being host but not approved by admin
Role 3 - Means approved by admin for being host
Role 4 - Means reject by admin for being host
       */}
            {props?.role == 1 ? (
              <Switch>
                <Route
                  path={routes.VIEWERDASHBOARD}
                  component={ViewerDashboard}
                />
                <Route
                  exact
                  path={routes.EDITPROFILE}
                  component={Editprofile}
                />
                <Route path={routes.VIEWERPROFILE} component={Viewerprofile} />
                <Route path={routes.VIEWEREVENT} component={Viewevent} />
                <Route exact path={routes.EDITUSER} component={Edituser} />
                <Route exact path={routes.LIVEEVENT} component={Liveevent} />
                <Route
                  exact
                  path={routes.UPCOMINGEVENTS}
                  component={UpcomingEvents}
                />
                <Route
                  path={routes.SUBSCRIPTIONPURCHASE}
                  component={SubscriptionPurchase}
                />
                <Route
                  path={routes.SUBSCRIBELIST}
                  component={SubscriptionList}
                />
                <Route path={routes.MEETING} component={Meeting} />
                <Route exact path={routes.SESSION} component={Session} />
                <Route exact path={routes.STREAM} component={Stream} />
                <Route exact path="/streamDemo" component={Index} />
                {/* <Route path={routes.PAYMENTMETHOD} component={PaymentMethod} /> */}
                <Route path={routes.PAYMENT} component={Payment} />

                <Route path={routes.WALLET} component={wallet} />
                <Route
                  exact
                  path={routes.TERMSANDCONDITIONS}
                  component={Termsandconditions}
                />
                <Route
                  exact
                  path={routes.PRIVACYPOLICY}
                  component={PrivacyPolicy}
                />
                <Redirect to={routes.VIEWERDASHBOARD} />
              </Switch>
            ) : props?.role == 2 || props?.role == 3 || props?.role == 4 ? (
              <Switch>
                <Route exact path={routes.DASHBOARD} component={Dashboard} />
                <Route
                  exact
                  path={routes.EDITPROFILE}
                  component={Editprofile}
                />
                <Route path={routes.VIEWERPROFILE} component={Viewerprofile} />
                <Route exact path={routes.EDITUSER} component={Edituser} />
                <Route path={routes.VIEWEREVENT} component={Viewevent} />
                <Route
                  path={routes.ADDSUBSCRIPTION}
                  component={Addsubscription}
                />
                <Route exact path={routes.ADDEVENT} component={Addevent} />
                <Route exact path={routes.MYEVENT} component={Myevent} />
                <Route path={routes.EDITEVENT} component={Editevent} />

                <Route exact path={routes.LIVEEVENT} component={Liveevent} />
                <Route
                  path={routes.MYSUBSCRIPTION}
                  component={MySubscriptions}
                />
                <Route path={routes.MAKEPAYMENT} component={MakePayment} />
                <Route path={routes.WALLET} component={wallet} />

                <Route
                  exact
                  path={routes.TRANSACTION}
                  component={Transaction}
                />
                <Route exact path={routes.SESSION} component={Session} />
                <Route exact path={routes.STREAM} component={Stream} />
                <Route exact path="/streamDemo" component={Index} />
                <Route path={routes.MEETING} component={Meeting} />
                <Route path={routes.OFFER} component={Offer} />

                <Route
                  exact
                  path={routes.TERMSANDCONDITIONS}
                  component={Termsandconditions}
                />
                <Route
                  exact
                  path={routes.PRIVACYPOLICY}
                  component={PrivacyPolicy}
                />
                <Redirect to={routes.DASHBOARD} />
              </Switch>
            ) : (
              <Redirect to={routes.DASHBOARD} />
            )}
          </>
        ) : (
          <Switch>
            <Route exact path={routes.HOME} component={Home} />
            <Route exact path={routes.SIGNIN} component={Signin} />
            <Route
              exact
              path={routes.CHOOSEACCOUNT}
              component={chooseAccount}
            />
            <Route
              path={routes.VIEWEREVENTWITHOUTLOGIN}
              component={Vieweventwithoutlogin}
            />
            {/* <Route path={routes.VIEWEREVENT} component={Viewevent} /> */}
            <Route exact path={routes.SIGNUP} component={Signup} />
            <Route exact path={routes.WELCOME} component={Welcome} />
            <Route exact path={routes.FORGOTPWD} component={Forgotpwd} />
            <Route exact path={routes.RESETPWD} component={Resetpassword} />
            <Route exact path={routes.VERIFYEMAIL} component={Verifyemail} />
            <Route
              exact
              path={routes.TERMSANDCONDITIONS}
              component={Termsandconditions}
            />
            <Route
              exact
              path={routes.PRIVACYPOLICY}
              component={PrivacyPolicy}
            />

            <Redirect to={routes.HOME} />
            {/* <Redirect to={routes.SIGNIN} /> */}
          </Switch>
        )}
      </BrowserRouter>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    authToken: state.loginReducer.authToken,
    role: state.loginReducer.role,
  };
};

export default connect(mapStateToProps)(App);
