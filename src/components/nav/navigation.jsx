import styles from "./navigation.module.scss";
import logo_2 from "../../img/logo_2.png";
import Button from "../button/button.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navigation(props) {
	const [home, setHome] = useState("");
	const [lists, setLists] = useState("");
	const [classroom, setClassroom] = useState("");
	const [activities, setActivities] = useState("");
	const [documents, setDocuments] = useState("");
	const [profile, setProfile] = useState("");
	const { Component = <></>} = props;
	const {
		top_var,
		user_container,
		btn,
		principal,
		navigation,
		content,
		activate,
	} = styles;

	const set_funcionality = (funcionality) => {
		setHome("");
		setLists("");
		setClassroom("");
		setActivities("");
		setDocuments("");
		setProfile("");
		switch (funcionality) {
			case "1":
				setHome(activate);
				break;
			case "2":
				setLists(activate);
				break;
			case "3":
				setClassroom(activate);
				break;
			case "4":
				setActivities(activate);
				break;
			case "5":
				setDocuments(activate);
				break;
			case "6":
				setProfile(activate);
				break;
			default:
				setHome(activate);
				break;
		}
 console.log(window.location.pathname);
	};

  useEffect(()=>{set_funcionality("1");},[])
	return (
		<>
			<header className={top_var}>
				<img src={logo_2} alt="image not found" />
				<div className={user_container}>
					<h3>Bienvenido: </h3>
					<div className={btn}>
						<Button type="logout" text="Cerrar sesion" />
					</div>
				</div>
			</header>
			<div className={principal}>
				<nav className={navigation}>
					<ul>
						<Link to="/Home">
							<li className={home} onClick={()=>set_funcionality("1")}>
								<a href="">Inicio</a>
							</li>
						</Link>
						<Link to="/Lists" onClick={()=>set_funcionality("2")}>
							<li className={lists}>
								<a href="">Listados</a>
							</li>
						</Link>
						<Link to="/Classroms" onClick={()=>set_funcionality("3")}>
							<li className={classroom}>
								<a href="">Cursos</a>
							</li>
						</Link>
						<Link to="/Activities" onClick={()=>set_funcionality("4")}>
							<li className={activities}>
								<a href="">Actividades</a>
							</li>
						</Link>
						<Link to="/Documents" onClick={()=>set_funcionality("5")}>
							<li className={documents}>
								<a href="">Documentos</a>
							</li>
						</Link>
						<Link to="/Profile" onClick={()=>set_funcionality("6")}>
							<li className={profile}>
								<a href="">Perfil</a>
							</li>
						</Link>
					</ul>
				</nav>
				<div className={content}>
					<Component.type />
				</div>
			</div>
		</>
	);
}
