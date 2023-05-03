import { useDispatch, useSelector } from "react-redux";
import { navigation_Actions } from "../../actions/navigationActions";
import { useEffect, useState } from "react";
import { consume_api } from "../../utils/consume_api";
import styles from './classroom.module.scss';

export default function Classroom(){
  const dispatch = useDispatch();
  const token = useSelector(state=>state.session.stateSessionToken);
  const [classroom, setClassroom] = useState([]);
  const {classroom_container,
	 classroom_item,
	 item_top,
	 item_bottom
	} = styles;

  const get_classrooms = async ()=>{
    const request = new consume_api("/classroom/get-classrooms", {}, token);
    setClassroom(await request.get_petitions());
  }
  
  useEffect(()=>{
    get_classrooms();
    dispatch(navigation_Actions(3));
  },[]);

  return(
    <div className={classroom_container}>
    {classroom.map(d=>(
     <div className={classroom_item}>
       <div className={item_top}>
         <h2>{d[1]}</h2>
       </div>
       <div className={item_bottom}> 
         {
	   d[2] !== "unidad"?
	   <button>1</button>:
	   <>
	   <button>1</button>
	   <button>2</button>
	   <button>3</button>
	   <button>4</button>
	   </>
	 } 
       </div>
     </div>
    ))}
    </div>
  );
}
