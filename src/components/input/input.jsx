import styles from "./input.module.scss";

export default function Input(props) {
  const {input_container, slide_up } = styles;
  const {type, placeholder, lblText, get_value, set_value, name, d_value=""} = props;
  return (
    <div className={input_container}>   
       <input
         className={slide_up}
         type={type}
         placeholder="&nbsp;"
         onChange={(event)=>{get_value(event.target.name, event.target.value);}}
         value={set_value}
         name={name}
         defaultValue={d_value}
         />
       <label>{placeholder}</label>
    </div>
  );
}
