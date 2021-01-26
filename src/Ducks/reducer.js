const initialState = {
  username: '',
  profilePic: ''
}

const UPDATE_USER = 'UPDATE_USER',
  LOGOUT = 'LOGOUT';

export function updateUser(userObj) {

  return {
    type: UPDATE_USER,
    payload: userObj
  }
}

export function logout() {
  return {
    type: LOGOUT
  }
}


export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_USER:
      return { ...state, username: payload.username, profilePic: payload.profilePic }

    case LOGOUT:
      return { username: '', profilePic: '' }

    default:
      return state;
  }
}
