
export const rptActions = state =>{
  const {type, item}= state
  switch(type){
    case 1:
      return{
	type:'ACTION_UPLOAD_STEP_1',
	payload:item
      }
    case 2:
      return{
	type:'ACTION_UPLOAD_step_2',
	payload:item
      }
    case 3:
      return{
	type:'ACTION_OPEN_CLOSE_MODAL_RPT',
	payload:item
      }
    case 4:
      return{
	type:'ACTION_UPLOAD_RPT_CT_AP',
	payload:item
      }
  }
}
