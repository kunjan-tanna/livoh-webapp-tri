import alertify from "alertifyjs";

export const validateSchema = (error) => {
  console.log("error is", error.details[0].type);
  let msg;
  let key = error.details[0].context.label || error.details[0].context.key;
  if (error.details[0].type.includes("empty")) {
    msg = key.replace(/_/g, " ") + " is required!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("invalid")) {
    msg = key.replace(/_/g, " ") + " need to check";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  }

  //  else if (error.details[0].type.includes('image')) {
  //     msg = key.replace(/_/g, ' ') + ' need to check';
  //     msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  //  }
  else if (error.details[0].type.includes("string.min")) {
    msg =
      key.replace(/_/g, " ") +
      " length must be at least " +
      error.details[0].context.limit +
      " characters long!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("string.max")) {
    msg =
      key.replace(/_/g, " ") +
      " length must be less than or equal to " +
      error.details[0].context.limit +
      " characters long!";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("number.min")) {
    msg =
      key.replace(/_/g, " ") +
      " should be greater than or equal to " +
      error.details[0].context.limit;
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else if (error.details[0].type.includes("number.max")) {
    msg =
      key.replace(/_/g, " ") +
      " should be less than or equal to " +
      error.details[0].context.limit;
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  }
  // else if (error.details[0].type.includes('allowOnly')) {
  //     msg = 'Password and confirm password must be same!';
  //     msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  // }
  else if (error.details[0].type.includes("number.greater")) {
    msg = key.replace(/_/g, " ") + " should be greater than Start Time";
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  } else {
    msg = "Please enter a valid " + key.replace(/_/g, " ") + "!";
  }
  let result = { error: msg, errorField: error.details[0].context.key };
  return result;
};

export const validateImgSize = (imgsize) => {
  let msg;
  let isvalidate;
  if (imgsize > 1) {
    msg = "File size should not be exceed more than 1 MB";
    isvalidate = false;
  } else {
    msg = "";
    isvalidate = true;
  }
  let result = { error: msg, isvalidate: isvalidate };
  return result;
};

export const displayLog = (code, message) => {
  alertify.dismissAll();
  if (code === 1) {
    alertify.success(message);
  } else if (code === 0) {
    alertify.error(message);
  } else if (code === 2) {
    let abc = alertify.warning(message);
    alertify.set("notifier", "position", "top-center");
    abc.delay(60).setContent(message);
  } else {
    alertify.error(message);
  }
};
