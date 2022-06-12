export const initialState = {
  authToken: "",
  role: null,
  email: "",
  user_id: null,
  profile_picture: "",
  username: "",
  sign_up_with: 1,
};

//To Store the Actions
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_DATA":
      return Object.assign({}, state, {
        authToken: action.payload.authToken,
        role: action.payload.role,
        email: action.payload.email,
        user_id: action.payload.user_id,
        profile_picture: action.payload.profile_picture,
        username: action.payload.username,
        sign_up_with: 1,
      });

    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};
export default loginReducer;
