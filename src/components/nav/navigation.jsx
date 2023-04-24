import styles from "./navigation.module.scss";
import logo_2 from "../../img/logo_2.png";
import Button from "../button/button.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {AiFillHome} from 'react-icons/ai';
import {FaThList, FaUserAlt} from 'react-icons/fa';
import {SiGoogleclassroom} from 'react-icons/si';
import {MdLocalActivity} from 'react-icons/md';
import {HiDocumentText} from 'react-icons/hi';
import {BiLogOutCircle} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import { useDispatch } from "react-redux";
import { lock_uiAction } from "../../actions/lock_uiActions";
import { sessionUserAction } from "../../actions/sessionAction";
import { consume_api } from "../../utils/consume_api";
import { useNavigate } from "react-router-dom";
import { navigation_Actions } from "../../actions/navigationActions";

export default function Navigation(props) {
	const [home, setHome] = useState("");
	const [lists, setLists] = useState("");
	const [classroom, setClassroom] = useState("");
	const [activities, setActivities] = useState("");
	const [documents, setDocuments] = useState("");
	const [profile, setProfile] = useState("");
	const [btn, setBtn] = useState("");
	const { Component = <></>} = props;
	const name = useSelector(state => state.session.stateName);
	const page = useSelector(state => state.navigation.funcionality);
	const token = useSelector(state => state.session.stateSessionToken);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		top_var,
		user_container,
		principal,
		navigation,
		content,
		activate,
		hide
	} = styles;

	const set_funcionality = () => {
		setHome("");
		setLists("");
		setClassroom("");
		setActivities("");
		setDocuments("");
		setProfile("");
		setBtn("");
		switch (page) {
			case 1:
				setHome(activate);
				setBtn(hide);
				break;
			case 2:
				setLists(activate);
				break;
			case 3:
				setClassroom(activate);
				break;
			case 4:
				setActivities(activate);	
				break;
			case 5:
				setDocuments(activate);	
				setBtn(hide);
				break;
			case 6:
				setProfile(activate);
				setBtn(hide);
				break;
			case 7:
				setLists(activate);
				setBtn(hide);
			break;
			default:
				setHome(activate);
				break;
		}
	};
	const pres_logOut=()=>{
	  dispatch(lock_uiAction({
	    action:2,
	    value:{
	      isOpen:true,
	      message:"Esta seguro de que quiere cerrar session?",
	      type:3,
	      exec:log_out
	    }
	  }));
	}

	const log_out= async()=>{
	  const request = new consume_api("/auth/logout",{},token);
	  await request.post_petitions();
	  dispatch(lock_uiAction({action:1,value:true}));
	  dispatch(sessionUserAction({
	    sessionToken:"",
	    sessionName:"",
	    isLogged:false
	  }));
	  setTimeout(()=>{navigate("/");},1000);
	}
	const go_toCreate = ()=>{
	  if(page ===2){
	    navigate("create-list");
	    dispatch(navigation_Actions(7));
	  }
	}
  useEffect(()=>{set_funcionality();})
	return (
		<>
			<header className={top_var}>
				<img src={logo_2} alt="image not found" />
				<div className={user_container}>
					<h3>Bienvenido: {" "+name}</h3>
				</div>
			</header>
			<div className={principal}>	
				<div className={content}>
				  <Component.type/>
				</div>	
				<Button
				  text=""
				  type="add"
				  Icon={AiOutlinePlus}
				  isHide={btn}
				  press_btn={go_toCreate}
				 />	
				<Button
				  Icon={BiLogOutCircle}
				  text=""
				  type="logout"
				  press_btn={pres_logOut}
				/>	
				<nav className={navigation}>
					<ul>
						<Link to="/Home">
							<li className={home} >
								<button><AiFillHome /><span>Inicio</span></button>
							</li>
						</Link>
						<Link to="/Lists" >
							<li className={lists}> 
								<button><FaThList/><span>Listados</span></button>
							</li>
						</Link>
						<Link to="/Classroms">
							<li className={classroom}>	
								<button><SiGoogleclassroom/><span>Cursos</span></button>
							</li>
						</Link>
						<Link to="/Activities" >
							<li className={activities}>
								<button><MdLocalActivity/><span>Actividades</span></button>
							</li>
						</Link>
						<Link to="/Documents" >
							<li className={documents}>
								<button><HiDocumentText/><span>Documentos</span></button>
							</li>
						</Link>
						<Link to="/Profile" >
							<li className={profile}>
								<button><FaUserAlt/><span>Perfil</span></button>
							</li>
						</Link>
					</ul>
				</nav>
			</div>
		</>
	);
}
