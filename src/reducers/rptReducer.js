const initProps={
  rpt_isOpen:false,
  rpt_listId:0,
  rpt_student_id:0,
  rpt_year:0,
  rpt_type:'',
  rpt_unit_number:0,
  rpt_clist_id:0
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
    case 'ACTION_OPEN_CLOSE_MODAL_RPT':
      return{
	...state,
	rpt_isOpen:payload
      }
    case 'ACTION_UPLOAD_RPT_CT_AP':
      return{
	...state,
	rpt_isOpen:true,
	rpt_listId:payload.listId,
	rpt_type:payload.type,
	rpt_year:payload.year,
	rpt_unit_number:payload.unit_number,
	rpt_clist_id:payload.clistId
      }
    default:
      return state;
  }
}
