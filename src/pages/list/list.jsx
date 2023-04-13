import styles from './list.module.scss';
import { consume_api } from '../../utils/consume_api';
import { useState, useEffect } from 'react';
import {FaEye} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import {AiOutlinePlus} from 'react-icons/ai';
import Button from '../../components/button/button';

export default function List(){
  const token = useSelector(state=>state.session.stateSessionToken);
  const [params, setParams] = useState([]);
  const {list} = styles;
  var index = 0;

  const get_lists = async ()=>{
    const request = new consume_api("/student/get-all-list", {}, token);
    setParams( await request.get_petitions());
  }
  
  useEffect(()=>{
    get_lists();
  },[]);

  return(
    <div className={list}>
     {params.map(d=>( 
     <List_item name={d[1]} date={d[2]} l_status={d[3]} number={index+=1}/> 
     ))}
     <Button
      text=""
      type="add"
      Icon={AiOutlinePlus}
     />
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
