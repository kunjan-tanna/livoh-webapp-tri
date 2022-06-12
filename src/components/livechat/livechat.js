import React, { Component } from "react";
import routes from "../../Routes";
import { NavLink } from "react-router-dom";
import { Emit, GetResponse, chatMessages } from "../../util/connect-socket";
import { Scrollbars } from "react-custom-scrollbars";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

class Livechat extends Component {
  constructor(props) {
    super(props);
    this.msgsScrollbars = React.createRef();
    this.state = {
      message: "",
      chat: [],

      showEmojiPicker: false,
    };
  }

  componentDidMount() {
    // // console.log(" STEP 1 inside did mount");
    // chatMessages((res) => {
    //   console.log("res in did kunjna", res);
    //   let comment_id = this.state.chat.findIndex(
    //     (myarray) => myarray.comment_id == res.comment_id
    //   );
    //   console.log("comment_id res kunjan", comment_id);
    //   if (comment_id == -1) {
    //     this.setState({
    //       chat: [...this.state.chat, res],
    //     });
    //     this.msgsScrollbars && this.msgsScrollbars.current.scrollToBottom();
    //   }
    //   // this.setState({
    //   // 	chat: [...this.state.chat, res ]
    //   // })
    // });
  }

  chatHandler = () => {
    let reqData = {
      streaming_id: this.props.event_id,
      streaming_channel_name: `stream-livoh-${this.props.event_id}`,
      comment: this.state.message,
    };

    Emit("commentStreaming", reqData);
    GetResponse((res) => {
      console.log("The res is-->CHATHANDLE", res);
      if (res.code === 1) {
        // this.setState({
        //   chat: [...this.state.chat, res],
        // });
        // setTimeout(() => {
        //   chatMessages((res) => {
        //     let abc = this.state.abc;
        //     abc.push({
        //       ...res,
        //     });
        //     localStorage.setItem("chat_details", JSON.stringify(abc));
        //   });
        // }, 3000);
      }
      this.setState({ message: "" });
    });
  };
  inputChangeHandler = (e) => {
    this.setState({ message: e.target.value });
  };
  addEmoji = (emoji) => {
    const { message } = this.state;
    const text = `${message}${emoji.native}`;
    this.setState({ message: text, showEmojiPicker: false });
  };
  toggleEmojiPicker = () => {
    this.setState({
      showEmojiPicker: !this.state.showEmojiPicker,
    });
  };
  render() {
    const { chatDetails } = this.props;
    // console.log("FINALL", this.state.chat);
    // let chats_details = "chats_details";
    // chats_details = this.state.chat.map((chat, index) => (
    //   <div className="liveChatstrin" key={index}>
    //     <div
    //       className={
    //         chat.user_id == localStorage.getItem("user_id")
    //           ? "commentOuter mine"
    //           : "commentOuter notmine"
    //       }
    //     >
    //       <div className="commentImg">
    //         <img
    //           src={
    //             chat.profile_picture.includes("null")
    //               ? "images/default.png"
    //               : chat.profile_picture
    //           }
    //         />
    //       </div>
    //       <div className="commentText">
    //         <label>{chat.username}</label>
    //         <p>{chat.comment}</p>
    //       </div>
    //     </div>
    //   </div>
    // ));

    return (
      <div
        className={
          this.props.show
            ? "liveChat showchat hidechatmobile"
            : "liveChat hidechat showchatmobile"
        }
      >
        <button
          className="backArrow d-md-none d-block"
          onClick={this.props.ZoomInOutHandler}
        >
          <i class="fas fa-arrow-circle-left"></i>
        </button>

        <div className="topBaruserPhoto d-flex align-items-center justify-content-end">
          <div className="userOption">
            {/* <label>{localStorage.getItem("username")}</label> */}
            <label>
              {localStorage.getItem("username") &&
              localStorage.getItem("username").includes("null")
                ? ""
                : localStorage.getItem("username")}
            </label>
          </div>
          <div className="userPic">
            <img
              src={
                localStorage.getItem("profile_picture") &&
                localStorage.getItem("profile_picture") != "null"
                  ? localStorage.getItem("profile_picture")
                  : "images/default.png"
              }
              className="img-fluid"
            />
          </div>
          <a href="#" className="logoutClass d-md-none d-block">
            <i class="fas fa-sign-out-alt"></i>
          </a>
        </div>
        <div className="liveChatListing">
          <Scrollbars
            className="scrollLiveChat"
            onScroll={this.handleScroll}
            onScrollFrame={this.handleScrollFrame}
            onScrollStart={this.handleScrollStart}
            onScrollStop={this.handleScrollStop}
            onUpdate={this.handleUpdate}
            renderView={this.renderView}
            renderTrackHorizontal={this.renderTrackHorizontal}
            renderTrackVertical={this.renderTrackVertical}
            renderThumbHorizontal={this.renderThumbHorizontal}
            renderThumbVertical={this.renderThumbVertical}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            ref={this.msgsScrollbars}
            thumbMinSize={30}
            universal={true}
            {...this.props}
          >
            <div className="liveChatstrin">
              <div
                className={
                  chatDetails.user_id == localStorage.getItem("user_id")
                    ? "commentOuter mine"
                    : "commentOuter notmine"
                }
              >
                <div className="commentImg">
                  <img
                    src={
                      chatDetails.profile_picture
                        ? chatDetails.profile_picture
                        : "images/default.png"
                    }
                  />
                </div>
                <div className="commentText">
                  <label>{chatDetails.username}</label>
                  <p>{chatDetails.comment}</p>
                </div>
              </div>
            </div>
            {/* {chats_details} */}
            {/* <div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div>
						<div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div>
						<div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div>
						<div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div>
						<div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div>
						<div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div>
						<div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div>
						<div className="liveChatstrin">
							<div className="commentOuter">
								<div className="commentImg">
									<img src="./images/img01.png" />
								</div>
								<div className="commentText">
									<label>Borja Valero</label>
									<p>I can’t wait for the breakout session</p>
								</div>
							</div>
						</div> */}
          </Scrollbars>
        </div>
        <div className="commentBox">
          <form className="message-form">
            {this.state.showEmojiPicker ? (
              <button type="button" onClick={() => this.toggleEmojiPicker()}>
                <i className="fal fa-chevron-down iconLink"></i>
              </button>
            ) : (
              <button type="button" onClick={() => this.toggleEmojiPicker()}>
                <i className="fal fa-smile iconLink"></i>
              </button>
            )}

            <textarea
              type="text"
              placeholder="send a message"
              name="message"
              value={this.state.message}
              onChange={this.inputChangeHandler}
            ></textarea>
          </form>
          {this.state.showEmojiPicker ? (
            <Picker onSelect={this.addEmoji} />
          ) : null}

          {/* <span>
              <Picker onSelect={this.addEmoji} />
            </span> */}

          <div className="comment-bottom">
            <a href="#" className="setting-icon">
              <i class="fas fa-cog"></i>
            </a>
            <button className="blueSmallBtn" onClick={this.chatHandler}>
              CHAT
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Livechat;
