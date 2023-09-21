// rootReducer.js
const initialState = {
  contactList: null,
  error: null,
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_DATA_SUCCESS":
      console.log("Received FETCH_DATA_SUCCESS action");
      return {
        ...state,
        contactList: action.payload,
        error: null,
      };
    case "FETCH_DATA_ERROR":
      console.log("Received FETCH_DATA_ERROR action");
      return {
        ...state,
        contactList: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default contactReducer;
