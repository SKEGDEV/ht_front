import styles from './documents.module.scss';
import Button from '../../components/button/button';
import Select from '../../components/select/select';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { navigation_Actions } from '../../actions/navigationActions';
import { lock_uiAction } from '../../actions/lock_uiActions';
import { consume_api } from '../../utils/consume_api';
import { notify } from '../../utils/notify';
import {BsClipboard2PulseFill, BsClipboard2Fill, BsFileTextFill, BsPersonBadgeFill} from 'react-icons/bs';

export default function Documents(){
  const {container, card_container, card} = styles;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(navigation_Actions(5));
  },[]);

  return(
    <div className={container}>
     <div className={card_container}>
       <div className={card}>
         <h4>Calificaciones</h4>
         <BsClipboard2PulseFill/>
         <p>
           Aca puedes generar las calificaciones de tus alumnos, estos se generan por cada año estudiantil y para cada uno de tus listados
           agregados a los cursos del año en curso.
         </p>
         <button onClick={()=>{navigate(`/Lists`);}}>Ir a</button>
       </div>
        <div className={card}>
         <h4>Lista de cotejo</h4>
         <BsClipboard2Fill/>
         <p>  
           Aca puedes generar el formato de lista de cotejo para cada uno de tus listados inscritos en los cursos del año en curso.
         </p>
         <button onClick={()=>{navigate(`/Classroms`);}}>Ir a</button>
       </div>
       <div className={card}>
         <h4>Cuadro de apreciacion</h4>
         <BsFileTextFill/>
         <p>
           Aca puedes generar el formato de cuadro de apreciacion para cada uno de tus listados inscritos en los cursos del año en curso.
         </p>
         <button onClick={()=>{navigate(`/Activities`);}}>Ir a</button>
       </div>
       <div className={card}>
         <h4>Ficha de alumno</h4>
         <BsPersonBadgeFill/>
         <p>
           Esta seccion te permite generar una ficha para cada uno de tus alumnos, en donde se detalla informacion de las actividades que el estudiante
           ha entregado y su rendimiento en las mismas.
         </p>
         <button onClick={()=>{navigate(`/Documents`);}}>Ir a</button>
       </div>
     </div>
    </div>

  )
}

export function Form_toReport(){
  const token = useSelector(state => state.session.stateSessionToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {form_container, form_btn, l_btn, r_btn} = styles;
  const [catalogs, setCatalogs] = useState({
    yearCatalog: [],
    listCatalog: []
  });

  const get_catalogs = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const year_request = new consume_api(`/classroom/get-classrooms/2/0`, {}, token);
    const list_request = new consume_api(`/student/get-all-list`, {}, token);
    const o_year = year_request.get_petitions();
    const o_list = list_request.get_petitions();
    if(o_year["msm"] || o_list["msm"]){ 
      var warning_notify;
      o_list["msm"] ? warning_notify = new notify(o_list["msm"]): warning_notify = new notify(o_year["msm"])
      warning_notify.warning();
      dispatch(lock_uiAction({action:1, value:false}));
      navigate(`/Documents`);
      return;
    }
    setCatalogs({
      ...catalogs,
      yearCatalog:o_year,
      listCatalog:o_list
    });
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},250);
  }

  useEffect(()=>{
    get_catalogs();
  },[]);

  return(
    <div className={form_container}>
      <Select
       options={catalogs.yearCatalog}
      />
      <Select
       options={catalogs.listCatalog}
      />
      <div className={form_btn}>
        <div className={l_btn}>
          <Button/>
        </div>
        <div className={r_btn}>
          <Button/>
        </div>
      </div>
    </div>
  )
}
