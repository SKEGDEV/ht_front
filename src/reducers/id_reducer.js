
const initProps={
  search_id:0
}

export default function id_Reducer(state=initProps, action){
  const {payload, type} = action
  switch(type){
    case "ACTION_SET_ID":
      return{
	...state,
	search_id:payload
      }
    default:
      return state;
  }

}
