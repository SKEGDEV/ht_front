const initProps={
  is_loaderOpen:false,
  is_modalOpen:false,
  modal_message:"",
  modal_type:0,
  modal_fn:()=>{}
  
}

export default function lock_UIReducer(state=initProps, action){
  const {payload} = action
  switch(action.type){
    case 'ACTION_OPEN_CLOSE_LOADER':
      return{
	...state,
	is_loaderOpen:payload
      };
    case 'ACTION_OPEN_CLOSE_MODAL':
      const {exec, isOpen, message, type}=payload;
      return{
	...state,	
	is_modalOpen:isOpen,
	modal_message:message,
	modal_type:type,
	modal_fn:exec	
      };
    default:
      return state;
  }
}
