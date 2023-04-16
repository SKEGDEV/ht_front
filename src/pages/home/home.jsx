import styles from './home.module.scss';
import {IoMdSchool} from 'react-icons/io';
import {MdClass,MdLocalActivity} from 'react-icons/md'
import {HiDocument} from 'react-icons/hi'
import {FaUserCog} from 'react-icons/fa'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { lock_uiAction } from '../../actions/lock_uiActions';
import { navigation_Actions } from '../../actions/navigationActions';

export default function Home(){
  const {container, card_container, card} = styles
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(lock_uiAction({action:1,value:false}));
    dispatch(navigation_Actions(1));
  },[])

  return(
    <div className={container}>
     <div className={card_container}>
       <div className={card}>
         <h4>Listados</h4>
         <IoMdSchool/>
         <p>En esta seccion puedes crear listados de alumnos
            para poder asignarlos a tus cursos y a su vez asignarles
            actividades.
         </p>
         <button>Empezar</button>
       </div>
        <div className={card}>
         <h4>Cursos</h4>
         <MdClass/>
         <p>En esta seccion puedes gestionar tus cursos, como agregarlos a tus listados o crear actividades para que puedan ser calificadas consecuentemente.  
         </p>
         <button>Empezar</button>
       </div>
       <div className={card}>
         <h4>Actividades</h4>
         <MdLocalActivity/>
         <p>En esta seccion puedes revisar el historial de actividades creadas, como asignarle una nota a tus alumnos, y de igual forma si es necesario quitarles
          puntaje de las actividades y muchas cosas mas.
         </p>
         <button>Empezar</button>
       </div>
       <div className={card}>
         <h4>Documentos</h4>
         <HiDocument/>
         <p>En esta seccion puedes generar tus documentos referentes a tus actividades y alumnos, tales como boletas de calificaciones, 
         cuadros de apreciacion, y mucho mas.
         </p>
         <button>Empezar</button>
       </div>
       <div className={card}>
         <h4>Perfil</h4>
         <FaUserCog/>
         <p>En esta seccion puedes actualizar tu informacion personal, como nombres, apellidos, contraseña asi como cancelar tu cuenta si asi lo deseas.
         </p>
         <button>Empezar</button>
       </div>
     </div>
    </div>
  )
}
