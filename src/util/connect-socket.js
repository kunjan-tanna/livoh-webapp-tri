import openSocket from "socket.io-client";
import store from "./store";
import { displayLog } from "./functions";
import config from "./config";
import Promise from "promise";

var socket;
if (process.env.NODE_ENV === "production") {
  // socket = openSocket("http://18.134.216.87:5000/");
  socket = openSocket("https://api.livoh.com:8443/");
  // socket = openSocket("https://00a1a09432c2.ngrok.io");
  // socket = openSocket("http://livoh.com:5000/");
} else {
  //socket = openSocket("http://18.134.216.87:5000/");
  socket = openSocket("https://api.livoh.com:8443/");
  //socket = openSocket("https://00a1a09432c2.ngrok.io");
  //socket = openSocket("http://livoh.com:5000/");
}

export const Emit = (MethodName, body, header) => {
  console.log("body(data) is", body);
  console.log("method name is", MethodName);
  store.dispatch({
    type: "START_LOADER",
  });
  let headers;
  if (header) {
    headers = header;
  } else {
    headers = {
      // 'content-type': 'multipart/form-data' ,
      language: "en",
      auth_token: localStorage.getItem("AUTH_TOKEN")
        ? localStorage.getItem("AUTH_TOKEN")
        : config.AUTHORIZATION,
      //"auth_token": config.AUTHORIZATION,
      web_app_version: "1.0.0",
    };
  }
  // headers["auth_token"]=localStorage.getItem('AUTH_TOKEN')?localStorage.getItem('AUTH_TOKEN'):config.AUTHORIZATION;
  let data = {
    body: body,
    headers: headers,
  };
  socket.emit(MethodName, data);
  //Disconnect()
};
export const GetResponse = (cb) => {
  socket.once("response", (message) => {
    console.log("STEP 1", message);
    store.dispatch({
      type: "STOP_LOADER",
    });
    if (message.code === 0) {
      // displayLog(0, message.message)
    } else if (
      message.code === 1 &&
      message.message &&
      message.message.length > 0
    ) {
      // displayLog(1, message.message)
    } else if (message.code === 401) {
      // localStorage.clear();
      // displayLog(0, "Session is Expired");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
    } else if (message.code === 403) {
      localStorage.clear();
      displayLog(0, "Account Block");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    // else {
    //   displayLog(0, "Network error")
    //   localStorage.removeItem('DUDU_AUTH_TOKEN');
    //   localStorage.removeItem('USER');

    // }
    cb(message);
  });
};

export const GetResponsePromise = () => {
  // var promise = new Promise(function (resolve, reject) {
  return new Promise((resolve, reject) => {
    socket.once("response", (message) => {
      console.log("in getRes", message);
      store.dispatch({
        type: "STOP_LOADER",
      });
      if (message.code === 0) {
        // displayLog(0, message.message)
      } else if (
        message.code === 1 &&
        message.message &&
        message.message.length > 0
      ) {
        // displayLog(1, message.message)
      } else if (message.code === 401) {
        localStorage.clear();
        displayLog(0, "Session is Expired");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (message.code === 403) {
        localStorage.clear();
        displayLog(0, "Account Block");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      // else {
      //   displayLog(0, "Network error")
      //   localStorage.removeItem('DUDU_AUTH_TOKEN');
      //   localStorage.removeItem('USER');

      // }
      resolve(message);
      //cb(message);
    });
  });
};

export const chatMessages = (msg) => {
  // console.log("call chk---------kkk");
  socket.on("response", function (res) {
    // console.log("response ON$$$$", res)

    if (res.method_name === "commentStreaming") {
      console.log("comment is:::", res);
    }
    if (res.method_name === "streamingCommented") {
      console.log("msg is:::kkk", res);
      msg(res.data);
    }
  });
};

export const LiveCount = (count) => {
  socket.on("response", function (res) {
    console.log("response ON$$$$", res);
    if (res.method_name === "streamingJoined") {
      console.log("count is:::", res.data.no_of_viewers);
      count(res.data.no_of_viewers);
    }
    if (res.method_name === "streamingLeft") {
      console.log("count is:::", res.data.no_of_viewers);
      count(res.data.no_of_viewers);
    }
  });
};

export const HostMic = (mic) => {
  socket.on("response", function (res) {
    //console.log("response ON$$$$", res)
    if (res.method_name === "micStatusChanged") {
      console.log("mic is:::", res.data.is_mic_on);
      mic(res.data.is_mic_on);
    }
  });
};

export const Disconnect = () => {
  socket.disconnect();
};
