import styles from './list.module.scss';
import { consume_api } from '../../utils/consume_api';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {FaEye} from 'react-icons/fa';
import {MdMedicalInformation} from 'react-icons/md';
import {FaUserEdit} from 'react-icons/fa';
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
     <List_item id={d[0]} key={d[0]} name={d[1]} date={new Date(d[2]).toLocaleDateString()} l_status={d[3]} number={index+=1}/> 
     ))}
    </div>
  )
}

function List_item(props){
  const {list_item, list_number, list_info, list_btn} = styles;
  const {id, name, date, l_status, number} = props;
  const navigate = useNavigate();

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
      <button onClick={()=>{navigate(`get-student/${btoa(id)}`);}}><FaEye/><span>Revisar</span></button>
     </div>
    </div>
  )
}

export function Get_list_student(){
  const {list_id} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {session:{stateSessionToken}} = useSelector(state => state);
  const {list, student_item, index, student_info, student_btn, warning, primary} = styles;
  const [student, setStudent] = useState([]);
  var number = 0;

  const get_student = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`/student/get-all-student/${atob(list_id)}`,{},stateSessionToken);
    const response = await request.get_petitions();
    if(response['msm']){
      setStudent([]);
      dispatch(lock_uiAction({action:1, value:false}));
      navigate('/Lists');
      return;
    }
    setStudent(response);
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
  }

  useEffect(()=>{
    get_student();
    dispatch(navigation_Actions(12));
  },[]);

  return(
    <div className={list}>
    {student.map(d=>(
      <div key={d[0]} className={student_item}>
        <div className={index}>
          <h4>{number+=1}</h4>
        </div>
        <div className={student_info}>
          <h4>{d[1]}</h4>
          <p>{d[2]}</p>
          <p>{`${new Date(d[3]).toLocaleDateString()}`}</p>
        </div>
        <div className={student_btn}>
          <button className={warning} onClick={()=>{navigate(`/Lists/add-update-student/${list_id}/${btoa(d[0])}`)}}><FaUserEdit/><span>Actualizar</span></button>
          <button className={primary}><MdMedicalInformation/><span>Ver Ficha</span></button>
        </div>
      </div>
    ))}
    </div>
  );
}
