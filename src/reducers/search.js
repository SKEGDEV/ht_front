const initProps={
  isActive: false,
  search_index:1,
  o_filter: [],
  o_backup: []
}

export default function searchReducer(state = initProps, action){
  const {payload, type} = action;
  switch(type){
    case 'ACTION_SET_IS_VISIBLE': 
      return{
	...state,
	isActive:payload
      }
    case 'ACTION_SET_INIT_OBJECT':
      return{
	...state,
	o_backup:payload.item,
	o_filter:payload.item,
	search_index:payload.index
      }
    case 'ACTION_ON_CHANGE_INPUT':
      if(payload === ""){
	return{
	  ...state,
	  o_filter:state.o_backup
	}
      }
      var searchExp = new RegExp(`${payload}.*`, "i");
      return{
	...state,
	o_filter:state.o_backup.filter(item => searchExp.test(item[state.search_index]))
      }
    default:
      return state;

  }
}
