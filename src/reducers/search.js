const initProps={
  isActive: false,
  isVisible:false,
  o_filter: [],
  o_backup: []
}

export default function searchReducer(state = initProps, action){
  const {payload, type} = action;
  switch(type){
    case 'ACTION_SET_IS_VISIBLE': 
      return{
	...state,
	isVisible:payload
      }
    case 'ACTION_SET_IS_ACTIVE':
      return{
	...state,
	isActive:payload.isActive
      }
    case 'ACTION_SET_OBACKUP':
      return{
	...state,
	o_backup:payload,
	o_filter:payload
      }
    case 'ACTION_ON_CHANGE_INPUT':

  }
}
