import styles from "./button.module.scss";
import { useState, useEffect } from "react";


export default function Button(props) {
	const [btn_type, setBtn_type] = useState(styles.primary);
	const { type, press_btn, text, Icon=<></> } = props;
	const { danger, success, logout, primary, button, signin, add } = styles;

	const get_btn_type = () => {
		if (type === "danger") {
			setBtn_type(danger);
			return;
		}
		if (type === "success") {
			setBtn_type(success);
			return;
		}
		if (type === "logout") {
			setBtn_type(logout);
			return;
		}
		if(type === "signin"){
		  setBtn_type(signin);
		  return;
		}
		if(type === "add"){
		  setBtn_type(add);
		  return;
		}
		setBtn_type(primary);
	};

	useEffect(() => {
		get_btn_type();
	}, []);

	return (
		<button className={button + " " + btn_type} onClick={press_btn}>			
			<span>{text}</span>
			<Icon/>
		</button>
	);
}
