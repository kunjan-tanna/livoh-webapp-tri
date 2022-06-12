import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <footer>
        <div className="container">
          <div className="row  align-items-center">
            <div className="col-lg-4 col-md-12 text-center d-md-none d-none  d-lg-block">
              <p>
                Copyright © {new Date().getFullYear()} LivOH. All rights
                reserved
              </p>
            </div>
            <div className="col-md-6">
              <ul className="d-flex footerLink m-0  justify-content-lg-center ">
                <li>
                  <a
                    href={routes.TERMSANDCONDITIONS}
                    title="Terms & Conditions"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>|</li>
                <li>
                  <a href={routes.PRIVACYPOLICY} title="Privacy Policy">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <ul className="d-flex justify-content-end social-media text-center ">
                <li>
                  <a
                    href="#"
                    className="facebook-icon"
                    target="_blank"
                    href={"https://www.facebook.com/livohofficial"}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="twitter-icon"
                    target="_blank"
                    href={"https://twitter.com/LivOhOfficial"}
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="google-icon"
                    target="_blank"
                    href={"https://instagram.com/LivOhOfficial"}
                  >
                    <i className="fab fa-instagram"></i>

                    {/* <i className="fab fa-google-plus-g"></i> */}
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-12 text-center d-md-block d-lg-none copyrightDiv">
              <p>
                Copyright © {new Date().getFullYear()} LivOH. All rights
                reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
