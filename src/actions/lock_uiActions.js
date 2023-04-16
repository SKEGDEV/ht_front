
export const lock_uiAction = state =>{
  const {action, value} = state;
  if(action === 1){
    return{
      type: "ACTION_OPEN_CLOSE_LOADER",
      payload:value
    }
  }
  if(action === 2){ 
    return{
      type:"ACTION_OPEN_CLOSE_MODAL",
      payload:value
    }
  }
}
