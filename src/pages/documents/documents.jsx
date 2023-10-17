import styles from './documents.module.scss';
import Button from '../../components/button/button';
import Select from '../../components/select/select';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { navigation_Actions } from '../../actions/navigationActions';
import { lock_uiAction } from '../../actions/lock_uiActions';
import { consume_api, Api_routes } from '../../utils/consume_api';
import { notify } from '../../utils/notify';
import {BsClipboard2PulseFill, BsClipboard2Fill, BsFileTextFill, BsPersonBadgeFill} from 'react-icons/bs';
import {FaFilePdf} from 'react-icons/fa';
import {MdCancel, MdSkipNext,MdPictureAsPdf} from 'react-icons/md';
import { rptActions } from '../../actions/rptActions';
import { search_Actions } from '../../actions/search';

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
         <button onClick={()=>{navigate(`/Documents/form-to-get-rpt/${btoa("qa")}`);}}>Ir a</button>
       </div>
        <div className={card}>
         <h4>Lista de cotejo</h4>
         <BsClipboard2Fill/>
         <p>  
           Aca puedes generar el formato de lista de cotejo para cada uno de tus listados inscritos en los cursos del año en curso.
         </p>
         <button onClick={()=>{navigate(`/Documents/form-to-get-rpt/${btoa("ct")}`);}}>Ir a</button>
       </div>
       <div className={card}>
         <h4>Cuadro de apreciacion</h4>
         <BsFileTextFill/>
         <p>
           Aca puedes generar el formato de cuadro de apreciacion para cada uno de tus listados inscritos en los cursos del año en curso.
         </p>
         <button onClick={()=>{navigate(`/Documents/form-to-get-rpt/${btoa("ap")}`);}}>Ir a</button>
       </div>
     </div>
    </div>

  )
}

export function Form_toReport(){
  const token = useSelector(state => state.session.stateSessionToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {variant} = useParams();
  const {form_container, form_btn, l_btn, r_btn, identifier} = styles;
  const [params, setParams] = useState({
    year:0,
    listId:0,
    type:atob(variant),
    clistId:0,
    unit_number:0
  });
  const [catalogs, setCatalogs] = useState({
    yearCatalog: [],
    listCatalog: [],
    clistCatalog: [],
    isClistVisible: false,
  });

  const onChangeParams = async (name, value)=>{
    setParams({
      ...params,
      [name]:value
    });

    if(name === "listId" && (atob(variant) === "ct") || atob(variant) === "ap"){
      dispatch(lock_uiAction({action:1, value:true}));
      const request = new consume_api(`${Api_routes.get_clist_for_list}${value}`,{},"");
      const response = await request.get_petitions();
      if(response["msm"]){
	const warning = new notify(response["msm"]); 
	warning.warning();
	return
      }
      setCatalogs({
	...catalogs,
	clistCatalog:response
      });
      setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))}, 250);
    }
  }

  const get_catalogs = async ()=>{
    dispatch(lock_uiAction({action:1, value:true}));
    const year_request = new consume_api(Api_routes.get_classroomYears, {}, token);
    const list_request = new consume_api(Api_routes.get_allList, {}, token);
    const o_year = await year_request.get_petitions();
    const o_list = await list_request.get_petitions();
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

  const Go_toRpt = ()=>{
    if(atob(variant) === "qa" || atob(variant) === "rs"){
      if(params.listId < 1 || params.year < 1){
	const notValidNotify = new notify('Por favor seleccione el año, y el listado a utilizar');
	notValidNotify.warning();
	return;
      }

      dispatch(rptActions({type:1, item:params}));
      navigate('/Documents/student-list-rpt');
    }else{
      if((params.clistId < 1 || params.year < 1 || params.listId < 1 || params.unit_number < 1) && atob(variant) === 'ct'){
	const notValidNotify = new notify('Por favor seleccione el año, listado, curso y unidad a utilizar');
	notValidNotify.warning();
	return;
      }
      if((params.clistId < 1 || params.year < 1 || params.listId < 1) && atob(variant) === 'ap'){
	const notValidNotify = new notify('Por favor seleccione el año, listado y curso a utilizar');
	notValidNotify.warning();
	return;
      }
      dispatch(rptActions({type:4, item:params}));
    }
  }

  useEffect(()=>{
    get_catalogs();
    atob(variant) === "ct" ? setParams({
      ...params,
      isClistVisible:true
    }) : atob(variant) === "ap" ? setParams({
      ...params,
      isClistVisible:true
    }) : setParams({
      ...params,
      isClistVisible:false
    });
  },[]);

  return(
    <div className={form_container}>
    <div className={identifier}>
      <h4>{atob(variant) == "ct" ? `Generar Reporte Listado de Cotejo ` :
	   atob(variant) == "ap" ? `Generar Reporte Cuadro de apreciacion ` : `Formulario de reportes `}<MdPictureAsPdf/></h4>
    </div>
      <Select
       options={catalogs.yearCatalog}
       option_i={0}
       msm={` el año a buscar`}
       set_value={params.year}
       get_value={onChangeParams}
       name='year'
      />
      <Select
       options={catalogs.listCatalog}
       msm={` el listado a buscar`}
       set_value={params.listId}
       get_value={onChangeParams}
       name='listId'
      />
     {params.isClistVisible ? 
      <Select
       options={catalogs.clistCatalog}
       msm={' el curso a buscar'}
       set_value={params.clistId}
       get_value={onChangeParams}
       name='clistId'
      />
      : <></>}
      {atob(variant) === "ct" ? 
          <Select
	    options={[[1,'I BLOQUE'], [2, 'II BLOQUE'], [3, 'III BLOQUE'], [4, 'IV BLOQUE']]}
	    msm={' la unidad a buscar'}
	    set_value={params.unit_number}
	    get_value={onChangeParams}
	    name='unit_number'
	  />
	  : <></>}
      <div className={form_btn}>
        <div className={l_btn}>
          <Button
           Icon={MdCancel}
           text="Cancelar"
           type="danger"
           press_btn={()=>{navigate('/Documents');}}
         />
        </div>
        <div className={r_btn}>
          <Button
           Icon={atob(variant) == "ct" ? FaFilePdf :
	         atob(variant) == "ap" ? FaFilePdf : MdSkipNext}
           text={atob(variant) == "ct" ? "Generar PDF" : 
	         atob(variant) == "ap" ? "Generar PDF" : "Siguiente"}
           type="success"
           press_btn={Go_toRpt}
          />
        </div>
      </div>
    </div>
  )
}

export function RptStudent (){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {rpt, session, filter} = useSelector(state => state)
  const {s_container, s_item, item_l, item_r} = styles;

  const Get_students = async ()=>{
    if(rpt.rpt_listId < 1 || rpt.rpt_year < 1){
      const listNotFound = new notify('No se ha seleccionado ningun listado o año, por favor intentelo de nuevo');
      listNotFound.warning();
      return;
    }
    dispatch(lock_uiAction({action:1, value:true}));
    const request = new consume_api(`${Api_routes.get_allStudentOffList}${rpt.rpt_listId}`,{}, session.stateSessionToken);
    const o_Student = await request.get_petitions();
    if(o_Student['msm']){
      const errorNotify = new notify('Ocurrio un error durante la obtension del listado');
      errorNotify.error();
      dispatch(lock_uiAction({action:1, value:false}));
      navigate('/Documents');
      return;
    }
    dispatch(search_Actions({variant:2, item:{item:o_Student, index:1}}));
    setTimeout(()=>{dispatch(lock_uiAction({action:1, value:false}))},500)
  }

  const Open_RptModal = (s_id)=>{
    const params = {
      studentId:s_id,
      isOpen:true
    }
    dispatch(rptActions({type:2, item:params}));
    dispatch(rptActions)
  }

  useEffect(()=>{
    Get_students();
    dispatch(navigation_Actions(14));
  },[])
  return(
    <div className={s_container}> 
    {filter.o_filter.map((d, index)=>(
      <div key={index} className={s_item}>
        <div className={item_l}>
          <h4>{d[1]}</h4>
          <p>{d[2]}</p>
        </div>
        <div className={item_r}>
          <Button
           Icon={FaFilePdf}
           text='Generar'
           press_btn={()=>{Open_RptModal(d[0])}}
         />
        </div>
      </div>
    ))}
    </div>
  );
}
