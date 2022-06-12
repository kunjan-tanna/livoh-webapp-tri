import React, { Component } from "react";
import routes from '../../Routes';
import { NavLink } from 'react-router-dom';
import Leftbar from "../leftbar/leftbar";

import Livechat from "../livechat/livechat";



class Session extends Component {
	constructor(props) {
		super(props);
		this.state = {			
		};
	}
	render() {
		return (
			<div className="sessionOuter">
				<h1>session</h1>
      	<Leftbar/>
        <Livechat/>
        <div className="eventVideo">
				<img src="./images/img02.jpg" className="img-fluid" />
			</div>
      <div className="centerButton   ">
      <button className="videoOptionMenu "><img src="./images/menu-icon.svg" /></button>
        <div className="videoOptionOuter">
		   <button className="videoOption"><img src="./images/video-icon.svg" /></button>
       <button className="videoOption"><img src="./images/audio-icon.svg" /></button>
       <button className="videoOption"><img src="./images/chat-icon.svg" /></button>
       <button className="videoOption"><img src="./images/call-icon.svg" /></button>
       </div>
       <div className="videoPhoto">
         <img src="./images/img03.jpg" className="imgfluid" />
       </div>
    
			</div>
      </div>
		);
	}
}

export default Session ;
