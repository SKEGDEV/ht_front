import styles from './home.module.scss';
import Button from '../../components/button/button.jsx'
import {Link} from 'react-router-dom';

export default function Home(){
  const {container, card_container, card} = styles

  return(
    <div className={container}>
     <div className={card_container}>
      <div className={card}>
       <h2>Revisar y crear listados</h2> 
       <Link to="/lists"><Button type="primary" text="Ir a"/></Link>
      </div>
      <div className={card}>
       <h2>Revisar y gestionar cursos</h2> 
       <Link to="/classroms"><Button type="primary" text="Ir a"/></Link>
      </div>
      <div className={card}>
       <h2>Revisar y calificar actividades</h2> 
       <Link to="/activities"><Button type="primary" text="Ir a"/></Link>
      </div>
      <div className={card}>
       <h2>Generar y revisar documentos</h2> 
       <Link to="/documents"><Button type="primary" text="Ir a"/></Link>
      </div>
      <div className={card}>
       <h2>Configurar perfil</h2> 
       <Link to="/profile"><Button type="primary" text="Ir a"/></Link>
      </div>
     </div>
    </div>
  )
}
