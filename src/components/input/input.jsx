import style from "./input.module.scss";

export default function Input(props) {
	return (
		<div className={style.input_container}>
			<span>
				<input
					className={style.slide_up}
					type={props.type}
					placeholder={props.placeholder}
				/>
				<label>{props.lblText}</label>
			</span>
		</div>
	);
}
