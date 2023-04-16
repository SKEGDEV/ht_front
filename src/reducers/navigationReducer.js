const initProps={
  funcionality:1
};


export default function funcionalityReducer(state=initProps, action){
  const {type,payload} = action
  switch(type){
    case "ACTION_SET_FUNCTIONALITY":
      return{
	...state,
	funcionality:payload
      };
    default:
      return state;
  }
}
