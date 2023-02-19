import styles from "./input.module.scss";

export default function Input(props) {
	const { input_container, slide_up } = styles;
	const { type, placeholder, lblText } = props;
	return (
		<div className={input_container}>
			<span>
				<input className={slide_up} type={type} placeholder={placeholder} />
				<label>{lblText}</label>
			</span>
		</div>
	);
}
