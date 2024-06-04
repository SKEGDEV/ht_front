import styles from './not_found.module.scss';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Not_found(){
  const navigate = useNavigate();

  useEffect(()=>{
    navigate('/');
  },[])
  const {not_found} = styles;
  return(
    <div className={not_found}>
    </div>
  )
}
