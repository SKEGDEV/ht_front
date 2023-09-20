const initProps={
  rpt_isOpen:false,
  rpt_listId:0,
  rpt_student_id:0,
  rpt_year:0,
  rpt_type:''
}

export default function RptReducer(state=initProps, action){
  const {payload, type} = action;
  switch(type){
    case 'ACTION_UPLOAD_STEP_1':
      return{
	...state,
	rpt_year:payload.year,
	rpt_listId:payload.listId,
	rpt_type:payload.type
      }
    case 'ACTION_UPLOAD_step_2':
      return{
	...state,
	rpt_student_id:payload.studentId,
	rpt_isOpen:payload.isOpen
      }
    case 'ACTION_OPEN_CLOSE_MODAL':
      return{
	...state,
	rpt_isOpen:payload
      }
    default:
      return state;
  }
}
