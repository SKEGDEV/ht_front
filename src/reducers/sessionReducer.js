const initProps = {
  stateSessionToken: '',
  stateName :'',
  isLogged: false
};

export default function sessionReducer(state = initProps, action){
  switch(action.type){
    case 'ACTION_SET_SESSION':
      const {payload: {sessionToken, sessionName, isLogged}} = action
      return{
	...state,
	stateSessionToken:sessionToken,
	stateName:sessionName,
	isLogged:isLogged
      }
    default:
      return state;
  }
}
