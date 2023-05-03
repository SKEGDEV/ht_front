import styles from './modal.module.scss';
import {BsCheck2Square, BsInfoCircleFill} from 'react-icons/bs';
import {MdDangerous} from 'react-icons/md';
import {AiFillCloseCircle, AiFillWarning, AiFillCheckCircle} from 'react-icons/ai';
import Button from '../button/button';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { lock_uiAction } from '../../actions/lock_uiActions';

export default function Modal(){
  const {modal_container, info, success, warning, danger, hide} = styles;
  const type = useSelector(state => state.lock_ui.modal_type);
  const isOpen = useSelector(state => state.lock_ui.is_modalOpen);
  const [modal_t, setModal_t] = useState(<Info_modal Icon={BsInfoCircleFill} title="Informacion" type={info}/>);
  const [isHide, setIsHide] = useState("");

  const set_modal= ()=>{
    if(type === 0){
      setModal_t(<Info_modal Icon={BsInfoCircleFill} title="Informacion" type={info}/>);
      return
    }
    if(type === 1){
      setModal_t(<Info_modal Icon={AiFillCheckCircle} title="Completado" type={success}/>);
      return
    }
    if(type === 2){
      setModal_t(<Warning_modal Icon={AiFillWarning} type={warning}/>);
      return
    }
    if(type === 3){ 
      setModal_t(<Warning_modal Icon={MdDangerous} type={danger}/>);
      return
    }
    setModal_t(<Info_modal Icon={BsInfoCircleFill} title="Informacion" type={info}/>);
    return
  }

  const modal_OpenClose = ()=>{
    isOpen? setIsHide(""):setIsHide(hide);
    if(isOpen){
      set_modal();
    }
  }

  useEffect(()=>{
    modal_OpenClose();
  })

  return(
    <div className={modal_container+" "+isHide}> 
    {modal_t}
    </div>
  );
}

function Info_modal(props){
  const {modal, modal_header, modal_body, modal_footerInfo} = styles
  const {Icon, title, type} = props
  const msm = useSelector(state => state.lock_ui.modal_message);
  const dispatch = useDispatch();
  const exec_fn = useSelector(state=> state.lock_ui.modal_fn);
  const close = ()=>{
    dispatch(lock_uiAction({
      action:2,
      value:{
	isOpen:false,
	message:"",
	type:0,
	exec:()=>{}
      }
    }));
  }

  return(
    <div className={modal}>
     <div className={modal_header}>
      <h1>{title}</h1>
      <Icon className={type}/>
     </div>
     <div className={modal_body}>
      <p>{msm}</p>
     </div>
     <div className={modal_footerInfo}>
      <Button 
       Icon={BsCheck2Square}
       text="Aceptar"
       type="primary"
       press_btn={()=>{exec_fn(); close();}}
      />
     </div>
    </div>
  );
}

function Warning_modal(props){
  const {modal, modal_header, modal_body, modal_footerWarning, modalF_left, modalF_right} = styles
  const {Icon, type} = props;
  const msm = useSelector(state => state.lock_ui.modal_message);
  const exec_fn = useSelector(state=> state.lock_ui.modal_fn);
  const dispatch = useDispatch();
  const close = ()=>{
    dispatch(lock_uiAction({
      action:2,
      value:{
	isOpen:false,
	message:"",
	type:0,
	exec:()=>{}
      }
    }));
  }

  return(
    <div className={modal}>
     <div className={modal_header}>
       <Icon className={type}/>
     </div>
     <div className={modal_body}>
      <h4>{msm}</h4>
     </div>
     <div className={modal_footerWarning}>
       <div className={modalF_left}>
         <Button
           Icon={AiFillCloseCircle}
           type="danger"
           text="Cerrar"
           press_btn={close}
         />
       </div>
       <div className={modalF_right}>
         <Button
           Icon={BsCheck2Square}
           type="success"
           text="Aceptar"
           press_btn={()=>{exec_fn();close();}}
         />
       </div>
     </div>
    </div>
  );
}
