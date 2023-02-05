import styles from "./button.module.scss";
import { useState, useEffect } from "react";

export default function Button(props) {
	const [btn_type, setBtn_type] = useState(styles.primary);

	const get_btn_type = () => {
		if (props.type == "danger") {
			setBtn_type(styles.danger);
			return;
		}
		if (props.type == "success") {
			setBtn_type(styles.success);
			return;
		}
		setBtn_type(styles.primary);
	};

	useEffect(() => {
		get_btn_type();
	}, []);

	return (
		<button
			className={styles.button + " " + btn_type}
			onClick={props.press_btn}
		>
			{props.text}
		</button>
	);
}
