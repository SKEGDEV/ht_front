import styles from './select.module.scss';

export default function Select(props){
  const {select_style} = styles;
  const {options=[], msm="", value_i=0, option_i=1, name="", get_value, set_value, is_disabled=false} = props

  return( 
    <select
     onChange={(e)=>{get_value(e.target.name, e.target.value);}}
     className={select_style}
     value={set_value}
     name={name}
     disabled={is_disabled}
    >
      <option value={0}>{`Seleccione ${msm}`}</option>
       {options.map(d=>(
       <option key={d[0]} value={d[value_i]}>{d[option_i]}</option>
       ))} 
    </select>
  );
}
