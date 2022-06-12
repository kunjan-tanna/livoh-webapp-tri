import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink, withRouter } from "react-router-dom";
import Leftbar from "../../components/leftbar/leftbar";
import Topbar from "../../components/topbar/topbar";
import Livechat from "../../components/livechat/livechat";
import AgoraVideoCall from "../../components/AgoraVideoCall";
import { AGORA_APP_ID } from "../../agora.config";
import { Emit, GetResponse, LiveCount,chatMessages,chatMessagesOff } from "../../util/connect-socket";
import { displayLog } from "../../util/functions";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import Button from "@material-ui/core/Button";
import Loader from "../../components/Loader/Loader";


const chatData = localStorage.getItem("chat_details");
let chatDataParse = JSON.parse(chatData);
class Meeting extends Component {
  constructor(props) {
    super(props);
    this.videoProfile = "720p_1";
    this.channel = this.props.location.state?.streaming_channel_name;
    this.transcode = "interop";
    //  this.attendeeMode = "video";
    this.attendeeMode = this.props.location.state?.attendeeMode;
    this.baseMode = "avc";
    this.appId = AGORA_APP_ID;
    if (!this.appId) {
      return alert("Get App ID first!");
    }
    this.uid = undefined;

    this.state = {
      zoominout: true,
      mute: true,
      totalViewers: 0,
      showlogout: false,
      eventName: "",
      image: "",
      chat : {},
      abc: [],
      loading:false

    };

    // this.params = queryString.parse(this.props.location.search);
    //this.props.location.state.Event_id
  }
  
  componentDidMount() {
    LiveCount((res) => {
      this.setState({ totalViewers: res });
    });
   
      chatMessages((res) => {
       
        // let abc = this.state.abc;
  
        // abc.push({
        //   ...res,
        // });
        // console.log("CHAT RES---", abc);
        // // setTimeout(() => {
        // //   localStorage.setItem("chat_details", JSON.stringify(abc));
        // // }, 1000);
        this.setState({ chat: res });
      });
    
    setTimeout (() => {
  //Get the Event Details By ID
  let reqData = { event_id: this.props.location.state?.Event_id };
  Emit("getEventDetailsById", reqData);
  GetResponse((res) => {
    console.log("The res is-->------------", res);
    if (res.code === 1) {
      this.setState({
        eventName: res.data && res.data.events.name || "hi",
        image: res.data &&  res.data.events.image || "hhh",
      });
    }

    if (res.code === 0) {
      displayLog(res.code, res.message);
    }
  });
    },1000)

  
    // { localStorage.getItem("role") == 1 && this.userjoinagain() }
  }

//   componentWillUnmount() {
   
//     chatMessagesOff((res)=>{
//       console.log("RESSS---",res)
//     })
//  }
  userjoinagain = () => {
    let req_data = {
      streaming_id: this.props.location.state.Event_id,
      streaming_channel_name: `stream-livoh-${this.props.location.state.Event_id}`,
    };
    Emit("addInSocketRoom", req_data);
    this.setState({ loading: true });
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->KUNJJ", res);
      displayLog(res.code, res.message);
    });
  };
  endEventHandler = () => {
    let req_data = {
      event_id: this.props.location.state.Event_id,
      is_live: 2,
    };
    this.setState({ loading: true});
    setTimeout(() => {
      Emit("startStopEvent", req_data);

      GetResponse((res) => {
        this.setState({ loading: false });
        console.log("The res is-->Event", res);
        displayLog(res.code, res.message);
        if (res.code == 1) {
  
          this.props.history.push(routes.MYEVENT);
          // window.location.reload();
        }
      });
    }, 1000);
  
  
    
  };
  leftEventHandler = () => {
    let req_data = {
      streaming_id: this.props.location.state?.Event_id,
      streaming_channel_name: `stream-livoh-${this.props.location.state.Event_id}`,
    };
    Emit("leaveStreaming", req_data);
    GetResponse((res) => {
      this.setState({ loading: false });
      console.log("The res is-->", res);
      displayLog(res.code, res.message);
      if (res.code == 1) {
        this.props.history.push(routes.UPCOMINGEVENTS);
      }
    });
  };
  ZoomInOutHandler = () => {
    this.setState({ zoominout: !this.state.zoominout });
  };
  VolumeHandler = () => {
    this.setState({ mute: !this.state.mute });
  };
  

  render() {
    // console.log("FINNAA--------l;l", this.state.chat);
    return (
      <div
        className={
          this.state.zoominout
            ? "liveEventOuter showlive"
            : "liveEventOuter hidelive"
        }
      >
         {this.state.loading && <Loader />}
        <Leftbar />
        <Topbar
          totalViewers={this.state.totalViewers}
          showlivecount={this.state.zoominout}
          eventName={this.state.eventName}
          image={this.state.image}
          attendeeMode={this.attendeeMode}
        />

        <div className="topOuterButton d-flex  align-items-center">
        {/* {this.attendeeMode === "video"?(
     <div className="d-none">
     <button className="greenSmallBtn ml-0">follow</button>
     <button className="blueSmallBtn">subscribe</button>
     </div>
 ): (
  <div className="d-flex">
  <button className="greenSmallBtn ml-0">follow</button>
  <button className="blueSmallBtn">subscribe</button>
  </div>
 )} */}
          {this.props.showlivecount && (
            <label>
              <i class="far fa-eye"></i>
              {this.props.totalViewers}
            </label>
          )}
        </div>

        <div className="eventVideo">
          <AgoraVideoCall
            videoProfile={this.videoProfile}
            channel={this.channel}
            transcode={this.transcode}
            attendeeMode={this.attendeeMode}
            baseMode={this.baseMode}
            appId={this.appId}
            uid={this.uid}
            event_id={this.props.location.state?.Event_id}
            // mute={this.state.mute}
            leftEventHandler={this.leftEventHandler}
            endEventHandler={this.endEventHandler}
            totalViewers={this.state.totalViewers}
            ZoomInOutHandler={this.ZoomInOutHandler}
          />
        </div>

        <Livechat
          event_id={this.props.location.state?.Event_id}
          show={this.state.zoominout}
          ZoomInOut
          chatDetails={this.state.chat}
          ZoomInOutHandler={this.ZoomInOutHandler}
        />

        <Modal
          isOpen={this.state.showlogout}
          toggle={() => this.showLogoutModal()}
        
        >
          <ModalHeader id="modal-header-css">
            Are you sure you want to logout?
            <button
              type="button"
              className="close_btn"
              aria-label="Close"
              onClick={() =>
                this.setState({ showlogout: !this.state.showlogout })
              }
            ></button>
          </ModalHeader>
          <ModalFooter id="modal-footer-css">
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              className="text-white btn-danger mx-2"
              onClick={() =>
                this.setState({ showlogout: !this.state.showlogout })
              }
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

        {/* <div className="centerButton">
                    <div className="middleBtn">

                        {this.attendeeMode == "audience" ?
                            <>
                                <button className="pinkSmallBtn">OFFERING  <i class="offering-icon">	<img src="./images/offering.svg" /></i></button>
                                <button className="pinkSmallBtn text-center" onClick={this.leftEventHandler}>Left Event</button>
                            </> : null}
                        {this.attendeeMode == "video" ?
                            <button className="pinkSmallBtn text-center" onClick={this.endEventHandler}>End Event</button>
                            : null}

                    </div>
                    <div className="rightBtn">
                        <div className="topOuterButton">
                            <label><i class="far fa-eye"></i>{this.state.totalViewers}</label>
                           
                        </div>
                        <button className="iconsLeftMenu" ><img src="./images/volume-icon.svg" alt="" onClick={this.VolumeHandler} /> </button>
                        <button className="iconsLeftMenu expandScreen" onClick={this.ZoomInOutHandler}><img src="./images/full-screen-icon.svg" alt="" /> </button>
                        <button className="iconsLeftMenu compressScreen" onClick={this.ZoomInOutHandler}><img src="./images/expand-icon.svg" alt="" /> </button>

                    </div>
                </div> */}
      </div>
    );
  }
}

export default withRouter(Meeting);
