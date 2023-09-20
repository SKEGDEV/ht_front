import styles from "./input.module.scss";
import { useEffect, useState } from "react";
import tools from '../../utils/tools.js'

export default function Input(props) {
  const {input_container, slide_up, notValid } = styles;
  const {type, placeholder, get_value, set_value, name, d_value="", is_disabled=false, itemValid={validMessage:'', expression:''}} = props;
  const [invalidColor, setInvalidColor] = useState('');
  const oTools = new tools()
  
  const validateInput = (value)=>{
    if(itemValid.expression === ''){
      return;
    }
    if(!oTools.validateRegEx({regExp:itemValid.expression, plainText:value})){
      setInvalidColor(notValid);
      return
    }
    setInvalidColor('');
    return
  }

  return (
    <>
    <div className={`${input_container} ${invalidColor}`}>   
       <input
         className={`${slide_up}`}
         type={type}
         placeholder="&nbsp;"
         onChange={(event)=>{get_value(event.target.name, event.target.value); validateInput(event.target.value);}}
         value={set_value}
         name={name}
         defaultValue={d_value} 
         disabled={is_disabled}
         />
       <label>{placeholder}</label>
    <p>{itemValid.validMessage}</p>
    </div>
    
    </>
  );
}
