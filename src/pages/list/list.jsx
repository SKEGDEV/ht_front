import styles from './list.module.scss';
import { consume_api } from '../../utils/consume_api';
import { useState, useEffect } from 'react';
import {FaEye} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { lock_uiAction } from '../../actions/lock_uiActions';
import { navigation_Actions } from '../../actions/navigationActions';

export default function List(){
  const token = useSelector(state=>state.session.stateSessionToken);
  const [params, setParams] = useState([]);
  const {list} = styles;
  const dispatch = useDispatch();
  var index = 0;

  const get_lists = async ()=>{
    dispatch(lock_uiAction({action:1,value:true}));
    const request = new consume_api("/student/get-all-list", {}, token);
    const response = await request.get_petitions();
    if(response["msm"]){
      setParams([]);
      dispatch(lock_uiAction({action:1,value:false}));
      return;
    }
    setParams(response);
    setTimeout(()=>{dispatch(lock_uiAction({action:1,value:false}));},1000)
  }
  
  useEffect(()=>{
    get_lists();
    dispatch(navigation_Actions(2));
  },[]);

  return(
    <div className={list}>
     {params.map(d=>( 
     <List_item key={d[0]} name={d[1]} date={new Date(d[2]).toLocaleDateString()} l_status={d[3]} number={index+=1}/> 
     ))}
    </div>
  )
}

function List_item(props){
  const {list_item, list_number, list_info, list_btn} = styles;
  const {name, date, l_status, number} = props;

  return(
    <div className={list_item}>
     <div className={list_number}>
      <h1>{number}</h1>
     </div>
     <div className={list_info}>
      <h4>{name}</h4>
      <p>{date+" "+l_status}</p>
     </div>
     <div className={list_btn}>
      <button><FaEye/><span>Revisar</span></button>
     </div>
    </div>
  )
}
