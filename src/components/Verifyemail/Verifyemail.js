import React, { useState, useEffect } from 'react';
import * as socketIo from "../../util/connect-socket";
import queryString from 'query-string'
import { Alert } from 'reactstrap';
import Routes from '../../Routes';
import Loader from "../Loader/Loader";

const Verifyemail = (props) => {
  const [error, seterror] = useState("");
  const [verified, setVerified] = useState();
  const [responseData, setResponse] = useState({});
  const [callverifyapi, setCallverifyapi] = useState(false);
  const [email, setEmail] = useState();
  //const [resendsuccessfully, setResendSuccessfully] = useState("");
  const [message, setmessage] = useState("")
  const [loading, setloading] = useState(false);


  const adminLoginReq = async (reqData) => {
    //console.log("data is 90", reqData)
    socketIo.Emit("verifyEmailToken", reqData);  //api call

    socketIo.GetResponse(response => {
      setloading(false)    //getting response
      console.log('$$$$$$$ res->', response);
      setEmail(response.data)
      if (response.code === 1) {
        setCallverifyapi(true);
        setVerified(1);
        setResponse(response.data[0]);

        setmessage(response.message);
        // props.history.push("/dashboard")
      } else {
        setCallverifyapi(true);
        setVerified(0);
        seterror(response.message)
        //displayLog(response.code, response.message);
      }
    })
  }

  const value = queryString.parse(props.history.location.search);
  const token = value.token;
  let reqData = {
    "token": token
  }

  useEffect(() => {
    adminLoginReq(reqData);
    setloading(true)  
  }, [])

  // const OnResendHandler= ()=>{
  //   let reqData = {
  //     "email": email,
  //   }
  //   socketIo.Emit("resendEmailToken", reqData);  

  //   socketIo.GetResponse(response => {  
  //     console.log('$$$$$$$ res->', response);
  //     setResendSuccessfully(response.message)
  //     if (response.code) {

  //       // props.history.push("/dashboard")
  //     } else {
  //      seterror(response.message)
  //       //displayLog(response.code, response.message);
  //     }
  //   })
  // }
  //console.log("response is",response)
  console.log("verified is", verified)
  console.log("callverifyapi is", callverifyapi)
  console.log("responseData ======================================",responseData);
  return (
    <div className="h-100">
       {loading&& <Loader/>}
      {callverifyapi ?
        <span className="verifyEmailSpan"> {verified == 1 ?
          <div className="verificationOuter  d-table h-100">
            <div className="d-table-cell align-middle">
              <div className="verificationDiv">
                <div className="logoLeft">
                  <a href="#"><img alt="" src="images/logo.svg" /></a>
                </div>
                <div className="verificationMassage">
                  <p style={{textTransform: 'capitalize'}}>Hi {responseData?.username ? responseData.username : 'there'},</p>                  
                  <p>Thanks for signing up.<br />
                    {message}</p>
                  <p>Best Wishes,<br />
                Team LivOh</p>
                  <button type="button" className="blueBtn text-center mt-4" onClick={() => props.history.push(Routes.SIGNIN)} >Go to Sign In</button>
                </div>

              </div>
            </div>
          </div>

          :

          <div className="verificationOuter ">
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="verificationDiv">
                <div className="logoLeft">
                  <a href="#"><img alt="" src="images/logo.svg" /></a>
                </div>
                <div className="verificationMassage">
                  <p>Hi There,</p>
                  <p>Thanks for signing up.<br />
                It seems you are not verified or your link has been expired.</p>
                  <p>Best Wishes,<br />
                Team LivOh</p>
                  {/* <button type="button" class=" text-center defaultBtn" onClick={OnResendHandler}>Resend</button> */}
                </div>
                {/* <div>
              {

                resendsuccessfully !== '' ?
                  <Alert color="success">
                    {resendsuccessfully}
                  </Alert>
                  : null
              }
            </div> */}
              </div>
            </div>
          </div>
        }</span> : null}
    </div>
  )
}

export default Verifyemail;

