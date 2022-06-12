import React, { Component } from 'react';
import routes from '../../Routes';
import { Alert } from 'reactstrap';
import { Emit, GetResponse } from '../../util/connect-socket';
import Loader from "../Loader/Loader";

export class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            error: "",
            successMsg: "",
            loading: false,
        };
    }

    async componentDidMount() {
        let email = localStorage.getItem("SIGNUP_EMAIL")
        this.setState({ email: email })
    }

    OnResendHandler = () => {
        let reqData = {
            "email": this.state.email,
        }
        Emit("resendEmailToken", reqData);
        this.setState({ loading: true })
        GetResponse(response => {
            this.setState({ loading: false })
            console.log('$$$$$$$ res->', response);
            if (response.code === 1) {
                this.setState({ error: "", successmsg: response.message })
            } else {
                this.setState({ error: response.message, successmsg: "" })
            }
        })
    }

    render() {
        return (
            <div className=" verificationOuter d-table h-100">
                {this.state.loading && <Loader/>}



                <div className="d-table-cell align-middle">
                    <div className="verificationDiv">
                        <div className="logoLeft">
                            <a href="#"><img alt="" src="images/logo.svg" /></a>
                        </div>
                        <div className="verificationMassage">
                            <h2>Thanks for signing up</h2>
                            <h4>We have sent a verification link to your email {this.state.email}.</h4>
                            <br />
                            <p> Please check your inbox and click on the link to complete your registration.</p>
                            {

                                this.state.successmsg !== '' ?
                                    <Alert color="success">
                                        {this.state.successmsg}
                                    </Alert>
                                    : null
                            }
                            {this.state.error !== '' ?
                                <Alert color="danger">
                                    {this.state.error}
                                </Alert>
                                : null
                            }

                            <button type="button" className="blueBtn text-center mt-4" onClick={this.OnResendHandler}>Resend Email</button>
                        </div>

                    </div>
                </div>


            </div>
        )
    }
}

export default Welcome;
