import styles from './list.module.scss';
import Button from '../../components/button/button';
import { consume_api, Api_routes } from '../../utils/consume_api';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {FaEye} from 'react-icons/fa';
import {MdMedicalInformation, MdPhoneInTalk, MdClass, MdChecklist} from 'react-icons/md';
import {IoIosSkipBackward} from 'react-icons/io';
import {FaUserEdit} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { lock_uiAction } from '../../actions/lock_uiActions';
import { navigation_Actions } from '../../actions/navigationActions';
import { search_Actions } from '../../actions/search';
import Chart from 'react-google-charts';

export default function List(){
  const token = useSelector(state=>state.session.stateSessionToken);
  const {filter} = useSelector(state => state)
  const {list} = styles;
  const dispatch = useDispatch();

  const get_lists = async ()=>{
    dispatch(lock_uiAction({action:1,value:true}));
    const request = new consume_api(Api_routes.get_allList, {}, token);
    const response = await request.get_petitions();
    if(response["msm"]){
      dispatch(search_Actions({variant:2, item:{item:[],index:1}}));
      dispatch(lock_uiAction({action:1,value:false}));
      return;
    } 
    dispatch(search_Actions({variant:2, item:{item:response,index:1}}));
    setTimeout(()=>{dispatch(lock_uiAction({action:1,value:false}));},500);
  }
  
  useEffect(()=>{
    get_lists();
    dispatch(navigation_Actions(2));
  },[]);

  return(
    <div className={list}>
     {filter.o_filter.map((d, index)=>( 
     <List_item id={d[0]} key={d[0]} name={d[1]} date={new Date(d[2]).toLocaleDateString()} l_status={d[3]} number={index+1}/> 
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
  const {session:{stateSessionToken}, filter} = useSelector(state => state);
  const {list, student_item, indexl, student_info, student_btn, warning, primary} = styles;

  const get_student = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`${Api_routes.get_allStudentOffList}${atob(list_id)}`,{},stateSessionToken);
    const response = await request.get_petitions();
    if(response['msm']){ 
      dispatch(search_Actions({variant:2, item:{item:[],index:1}}));
      dispatch(lock_uiAction({action:1, value:false}));
      navigate('/Lists');
      return;
    }
    dispatch(search_Actions({variant:2, item:{item:response,index:1}}));
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500);
  }

  useEffect(()=>{
    get_student();
    dispatch(navigation_Actions(12));
  },[]);

  return(
    <div className={list}>
    {filter.o_filter.map((d, index)=>(
      <div key={d[0]} className={student_item}>
        <div className={indexl}>
          <h4>{index+1}</h4>
        </div>
        <div className={student_info}>
          <h4>{d[1]}</h4>
          <p>{d[2]}</p>
          <p>{`${new Date(d[3]).toLocaleDateString()}`}</p>
        </div>
        <div className={student_btn}>
          <button className={warning} onClick={()=>{navigate(`/Lists/add-update-student/${list_id}/${btoa(d[0])}`)}}><FaUserEdit/><span>Actualizar</span></button>
          <button className={primary} onClick={()=>{navigate(`/Lists/get-student-file/${btoa(d[0])}/${list_id}`);}}><MdMedicalInformation/><span>Ver Ficha</span></button>
        </div>
      </div>
    ))}
    </div>
  );
}

export function Get_studentFile(){
  const {stateSessionToken} = useSelector(state=>state.session)
  const {s_id, list_id} = useParams();
  const {
	 frm_label,
	 frm_container,
	 frm_header,
	 frm_header_body,
	 frm_body,
	 frm_body_contact, 
	 frm_body_container,
	 frm_footer,
  } = styles;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [student, set_Student] = useState([]);
  const [classroom, set_Classroom]=useState([]);
  const [activities, set_Activities] = useState([]);

  const get_file = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const student_request = new consume_api(`${Api_routes.get_studentFile}${atob(s_id)}`, {}, stateSessionToken);
    const o_response = await student_request.get_petitions();
    if(o_response['msm']!=="success"){
      dispatch(lock_uiAction({action:1, value:false}));
      navigate(`/Lists/get-student/${list_id}`);
      return;
    } 
    set_Student(o_response['o_student']);
    set_Classroom(o_response['o_classroom']);
    set_Activities(o_response['o_activities']);
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 500);
  }

  const get_age=(birthday)=>{
    var date_birthday = new Date(birthday);
    var date_today = new Date();
    var age = date_today.getFullYear() - date_birthday.getFullYear();
    return age;
  }

  useEffect(()=>{
    get_file();
    dispatch(navigation_Actions(7));
  },[]);

  return(
    
    <div className={frm_container}>
    {student.map(d=>(
    <div key={d[0]} className={frm_header}>
      <div className={frm_header_body}>
       <div className={frm_label}><span>{`INFORMACION GENERAL `}</span><MdMedicalInformation/></div>
       <div>
         <h4>{`Nombre: `}</h4>
         <p>{d[0]}</p>
       </div>
       <div>
         <h4>{`Edad: `}</h4>
         <p>{get_age(d[5])}</p>
       </div>
       <div>
         <h4>{`Codigo estudiante: `}</h4>
         <p>{d[1]}</p>
       </div>
       <div>
         <h4>{`Profesor: `}</h4>
         <p>{d[4]}</p>
       </div>
       <div>
         <h4>{`Listado de: `}</h4>
         <p>{d[2]}</p>
       </div>
       <div>
         <h4>{`Creacion de listado: `}</h4>
         <p>{new Date(d[3]).toLocaleDateString()}</p>
       </div>
      </div>
      <div className={frm_body}>
        <div className={frm_body_contact}>
         <div className={frm_label}><span>{`INFORMACION DE CONTACTO `}</span><MdPhoneInTalk/></div>
          {d[6] === "+50200000000" ? <p>Numero telefonico de la madre no disponible</p>:
          <a  href={`tel:${d[6]}`}>{`Numero telefonico de la madre: ${d[6]}`}</a>
	  }
          {d[7] === "+50200000000" ? <p>Numero telefonico del padre no disponible</p>:
          <a  href={`tel:${d[7]}`}>{`Numero telefonico del padre: ${d[7]}`}</a>
	  }
          {d[7] === "+50200000000" ? <p>Numero telefonico extra no disponible</p>:
          <a  href={`tel:${d[8]}`}>{`Numero telefonico extra: ${d[8]}`}</a>
	  }
        </div>
    
        <div className={frm_body_container}>
         <div className={frm_label}><span>{`INFORMACION DE CURSOS `}</span><MdClass/> </div>
         <Component_SClassroom o_classroom={classroom}/>
        </div>
      </div>
    </div>
    ))}
      <div className={frm_footer}>
       <div className={frm_label}><span>{`INFORMACION DE ACTIVIDADES `}</span><MdChecklist/></div>
       <Component_SActivities list_id={list_id} o_activities={activities}/>
      </div>
    </div> 
  )
}

function Component_SClassroom(props){
  const {o_classroom = []} = props;
  const {frm_body_card_container, frm_body_card} = styles;
  
  return(
    <div className={frm_body_card_container}>
    {o_classroom.map(d=>(
      <div key={d[1]} className={frm_body_card}>
       <h4>{d[0]}</h4>
      </div>
    ))}
    </div>
  )
}

function Component_SActivities(props){
  const {o_activities=[], list_id=""} = props;
  const navigate = useNavigate();
  const {frm_fotter_container, frm_footer_information}= styles;
  const [oData, setOData] = useState([]);
  const options = {
    title: "Actividades asignadas al estudiante"
  }

  useEffect(()=>{
    o_activities.map(d=>{
      setOData([
	["Task", ""],
	["Tareas entregadas", d[0]],
	["Tareas no entregadas", d[1]]
      ])
    });
  },[o_activities])
  return(
    <div className={frm_fotter_container}> 
     <div className={frm_footer_information}>
      <Chart
       chartType='PieChart'
       data={oData}
       options={options}
       width={"100%"}
       height={"400px"}
     />
      <p>{`Si desea saber mas del asunto por favor dirijase al apartado de rendimiento por unidad del estudiante`}</p>
     </div> 
    <Button 
    Icon={IoIosSkipBackward}
    text="Regresar"
    type="danger"
    press_btn={()=>{navigate(`/Lists/get-student/${list_id}`);}}
    />
    </div>
  )
}
