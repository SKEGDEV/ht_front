
export const sessionUserAction = state => {
  const {sessionToken, sessionName, isLogged} = state;
  return{
    type : "ACTION_SET_SESSION",
    payload:{
      sessionToken: sessionToken,
      sessionName: sessionName,
      isLogged:isLogged
    }
  }
}
