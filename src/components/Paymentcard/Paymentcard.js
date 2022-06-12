import React from "react";
import "./Paymentcard.css";
import paypalcardimg from "../../assets/paypalcardImg.png";
import mastercardimg from "../../assets/mastercardImg.png";
import visacardimg from "../../assets/visacardImg.jpg";

var card_type = "";

const Paymentcard = (props) => {
  //console.log( props.card_type =="Visa")
  if (props.card_brand == "MasterCard") {
    card_type = 0;
  }
  if (props.card_brand == "Paypal") {
    card_type = 1;
  }
  if (props.card_brand == "Visa") {
    card_type = 2;
  }

  const array = [
    { color1: "#808080", color2: "#0f0f0f", img: mastercardimg },
    { color1: "#6F88D0", color2: "#465784", img: paypalcardimg },
    { color1: "#e0d852", color2: "#eab208", img: visacardimg },
  ];

  const mystyle = {
    padding: ".1em 1em",
    color: "white",
    fontSize: "10px",

    borderRadius: "7px",
    background: `linear-gradient(90deg, ${array[card_type].color1} 0%, ${array[card_type].color2} 100%)`,
  };

  const mystyle_img = {
    marginTop: "5px",
  };
  const mystyle_p = {};

  return (
    <div className="cardOuter">
      <div className="front-card" style={mystyle}>
        <div className="card-info">
          <img style={mystyle_img} src={array[card_type].img} alt="" />
          <p id="no">XXXX XXXX XXXX {props.cardnum}</p>
        </div>
      </div>
      <p className="deleteCard" style={mystyle_p} onClick={props.delete}>
        Delete Card
      </p>
      {/* {props && props.showCvv ? (
        <p className="deleteCard" style={mystyle_p} onClick={props.delete}>
          Delete Card
        </p>
      ) : null} */}
    </div>
  );
};

export default Paymentcard;
