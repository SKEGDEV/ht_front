import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { lock_uiAction } from "../../actions/lock_uiActions"
import { rptActions } from "../../actions/rptActions"
import { consume_api, Api_routes } from "../../utils/consume_api"
import { notify } from "../../utils/notify"
import Button from "../button/button"
import {AiFillCloseCircle} from 'react-icons/ai';
import styles from './modal.module.scss';


export default function RptViewer(){
  const {rpt} = useSelector(state => state);
  const {stateSessionToken} = useSelector(state => state.session);
  const [rptBase64, setRptBase64] = useState('');
  const [isOpen, setIsOpen] = useState('');
  const {rpt_container, o_rpt, rpt_footer, rpt_is_open, btn_container} = styles;
  const dispatch = useDispatch();

  const getRptBase64 = async()=>{
    if(!rpt.rpt_isOpen){
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(Api_routes.post_generateReport, rpt, stateSessionToken);
    const oRpt = await request.post_petitions();
    if(oRpt['msm'] !== 'success'){
      dispatch(lock_uiAction({action:1, value:false}));
      dispatch(rptActions({type:3, item:false}));
      const failMessage = new notify(oRpt['msm']);
      failMessage.warning();
      setRptBase64('');
      return
    }
    setRptBase64(oRpt['rpt']); 
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
  }

  const closeModal = ()=>{
    dispatch(rptActions({type:3, item:false}));

  }

  useEffect(()=>{
    getRptBase64();
    rpt.rpt_isOpen ? setIsOpen(rpt_is_open):setIsOpen('');
  },[rpt.rpt_isOpen])
  return(
    <div className={`${rpt_container} ${isOpen}`}>
      <div className={`${o_rpt}`}>
	<object  data={`data:application/pdf;base64,${rptBase64}`} type="application/pdf" width="100%"></object>
      </div>
      <div className={`${rpt_footer}`}>
       <div className={`${btn_container}`}>
         <Button
           Icon={AiFillCloseCircle}
           type="danger" 
           text="Cerrar"
           press_btn={closeModal}
           />
       </div>
      </div>
    </div>
  )
}
