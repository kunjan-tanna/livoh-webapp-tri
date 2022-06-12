import React, { Component } from "react";
import routes from '../../Routes';
import { NavLink } from 'react-router-dom';
import Header from "../header/header";
import Jointherevolution from "../jointherevolution/jointherevolution";
import Footer from "../footer/footer";



class Transaction extends Component {
	constructor(props) {
		super(props);
		this.state = {			
		};
	}
	render() {
		return (
			<div>
      <Header/>  
        <div className="transactionsBanner bannerImg">
         
            <div className="bannerText">
              <div className="container">
                <h1>My Transactions</h1>
                <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et</h2>
              </div>
          </div>
        </div>
        <div className="transactionDetails ">
          <div className="container">
            <div className="row text-center mb-op">
              <div className="col-md-4">
                <div className="transactionBox">
                  <label>Total earnings available</label>
                  <h3>$7,400.00</h3>
                  </div>
              </div>
              <div className="col-md-4">
                <div className="transactionBox">
                  <label>Total withdrawal amount</label>
                  <h3>$400.00</h3>
                  </div>
              </div>
              <div className="col-md-4 ">
                <div className="transactionBox mb-0">
                  <label>last withdrawal date</label>
                  <h3>01/07/2020</h3>
                  </div>
              </div>
            </div>
            <div className="row paymentMode mb-op  row-eq-height">
              <div className="col-md-6">
                <div className="transactionBox">
                  <label>Linked payment systems</label>
                  <div className="paymentOption d-flex">
                    <ul className="paymentOptionUl d-flex ">
                      <li><a href="#"><img alt="" src="./images/card01.png" className="img-fluid" /></a></li>
                      <li><a href="#"><img alt="" src="./images/card01.png" className="img-fluid" /></a></li>                     
                    </ul>
                    <button className="addCard "><i>+</i></button>
                  </div>
                  </div>
              </div>
              <div className="col-md-6">
                 <div className="fundtransferBox transactionBox">
                    <label>Funds Transfer</label>
                    <div className="row transferRow">
                        <div className="col-md-6">
                          <span>Send</span>
                          <div className="amtOuter">
                            <div className="row align-items-center">
                                <div className="col-6">
                                  <h5>400.00</h5>
                                </div>
                                <div className="col-6">
                                  <h6>USD</h6>
                                </div>
                            </div>
                          </div>
                          <div className="fundStatus">Available £7,459.99</div>
                       
                        </div>
                        <div className="col-md-6 pl-4">
                         <div className="rightArrow"></div>
                          <span>Will Receive</span>
                          <div className="amtOuter">
                            <div className="row align-items-center">
                              <div className="col-6">
                                <h5>324.19</h5>
                              </div>
                              <div className="col-6">
                                <h6>GBP</h6>
                              </div>
                          </div>
                          </div>
                          <div className="fundStatus">1 USD = 0.81 GBP</div>
                        </div>
                    </div>
               
                    <div className="fundInfo">
                    <div className="row">
                    <div className="col-md-12 col-lg-8">
                      <div className="fundInfoDiv"><i class="infoIcon"><img alt="" src="./images/info-icon.svg" /> </i> TRANSFER WILL BE RECEIVED ON 29 JUN 2019</div>
                    </div>
                    <div className="col-lg-4 pl-lg-0">
                      <button className="blueSmallBtn ">PROCEED TRANSFER</button>
                    </div>
                    </div>

                  </div>
               
                  </div>
               
              </div>
            </div>
       
       <div className="linkedPaymentTable">
           <div className="transactionBox">
           <label>Linked payment systems</label>

           <div className="paymentTableOuter table-responsive">
             <table className="paymentOuter table">
               <tr>
                 <td><i className="arrow-img"><img alt="" src="./images/pink-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="./images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdPink"><i className="status"><img alt="" src="./images/pending-icon.svg" className="img-fluid" /></i> Pending</td>
                 <td className="text-center pr-0"><button className="moreImg"><img alt="" src="./images/more.svg" /></button></td>
               </tr>
               <tr>
                 <td><i className="arrow-img"><img alt="" src="../images/pink-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="../images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdPink"><i className="status"><img src="../images/pending-icon.svg" className="img-fluid" /></i> Pending</td>
                 <td className="text-center pr-0"><button className="moreImg"><img src="../images/more.svg" /></button></td>
               </tr>
               <tr>
                 <td><i className="arrow-img"><img alt="" src="../images/green-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="../images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdGreen "><i className="status"><img alt="" src="../images/completed-icon.svg" className="img-fluid" /></i> Completed</td>
                 <td className="text-center pr-0"><button className="moreImg"><img alt="" src="../images/more.svg" /></button></td>
               </tr>
               <tr>
                 <td><i className="arrow-img"><img alt="" src="../images/green-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="../images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdGreen "><i className="status"><img alt="" src="../images/completed-icon.svg" className="img-fluid" /></i> Completed</td>
                 <td className="text-center pr-0"><button className="moreImg"><img alt="" src="../images/more.svg" /></button></td>
               </tr>
               <tr>
                 <td><i className="arrow-img"><img alt="" src="../images/green-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="../images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdGreen "><i className="status"><img alt="" src="../images/completed-icon.svg" className="img-fluid" /></i> Completed</td>
                 <td className="text-center pr-0"><button className="moreImg"><img alt="" src="../images/more.svg" /></button></td>
               </tr>
               <tr>
                 <td><i className="arrow-img"><img alt="" src="../images/green-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="../images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdGreen "><i className="status"><img alt="" src="../images/completed-icon.svg" className="img-fluid" /></i> Completed</td>
                 <td className="text-center pr-0"><button className="moreImg"><img alt="" src="../images/more.svg" /></button></td>
               </tr>
               <tr>
                 <td><i className="arrow-img"><img alt="" src="../images/green-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="../images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdGreen "><i className="status"><img alt="" src="../images/completed-icon.svg" className="img-fluid" /></i> Completed</td>
                 <td className="text-center pr-0"><button className="moreImg"><img alt="" src="../images/more.svg" /></button></td>
               </tr>
               <tr>
                 <td><i className="arrow-img"><img alt="" src="../images/green-arrow.svg" /></i></td>
                 <td>Sent to:</td>
                 <td className="text-center"><img alt="" src="../images/mastercard-logo.png" className="img-fluid" /></td>
                 <td>Amount:</td>
                 <td><span>400 USD <br/>324 GBP</span></td>
                 <td>When:</td>
                 <td><span>3:00pm <br/>01 Jul 2019</span></td>
                 <td>Status:</td>
                 <td className="statusTdGreen "><i className="status"><img alt="" src="../images/completed-icon.svg" className="img-fluid" /></i> Completed</td>
                 <td className="text-center pr-0"><button className="moreImg"><img alt="" src="../images/more.svg" /></button></td>
               </tr>
             </table>
           </div>
           </div>
       </div>
        </div>
        </div>
      <Jointherevolution/>    
      <Footer/>       
      </div>
		);
	}
}

export default Transaction;
