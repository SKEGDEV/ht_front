import styles from './loader.module.scss';
import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';

export default function Loader(){
  const {loader_container, loader, activate} = styles;
  const [css_class, setCss_class] = useState("");
  const isActive = useSelector(state=>state.lock_ui.is_loaderOpen);

  const setLock = ()=>{
    if(isActive){
      setCss_class(activate);
      return;
    }
    setCss_class("");
    return;
  }

  useEffect(()=>{
    setLock();
  })


  return(
    <div className={loader_container+" "+css_class}>
     <span className={loader}></span>
    </div>
  )
}
