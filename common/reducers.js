import {
  SET_USER_PENDING,
  SET_USER_SUCCESS,
  SET_USER_FAILURE,
  GET_USER,
  SEARCH_SUCCESS,
  SEARCH_PENDING,
  CURRENT_MSGING,
  USER_LOGOUT,
  FRIEND_STATUS,
} from "./types";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

export const setUser = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PENDING:
      return {
        ...state,
        isLoading: true,
      };
      break;
    case SET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
      break;
    case USER_LOGOUT:
      return {
        ...state,
        isLoading: false,
        user: null,
      };
    case SET_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

      break;
    case FRIEND_STATUS:
      let ind = action.payload.me.friends.findIndex(
        (f) => f._id === action.payload.friend
      );
      if (ind >= 0) {
        let user = action.payload.me;
        user.friends[ind].status = status;
        return {
          ...state,
          user: user,
          isLoading: false,
        };
      } else {
        return {
          ...state,
          user: action.payload.me,
          isLoading: false,
        };
      }
    default:
      return state;
  }
};
const initialPeople = {
  people: [],
  isLoading: false,
};

export const searchPeople = (state = initialPeople, action) => {
  switch (action.type) {
    case SEARCH_PENDING:
      return {
        ...state,
        isLoading: true,
      };
      break;
    case SEARCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        people: action.payload,
      };
      break;

    default:
      return state;
  }
};

const initialMessagingState = {
  info: null,
};

export const setCurrentMessaging = (state = initialMessagingState, action) => {
  switch (action.type) {
    case CURRENT_MSGING:
      return {
        ...state,
        info: action.payload,
      };
      break;
    default:
      return state;
  }
};
