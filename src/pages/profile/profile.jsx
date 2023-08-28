import styles from './profile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { navigation_Actions } from '../../actions/navigationActions';
import { useState, useEffect } from 'react';

export default function Profile(){
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(navigation_Actions(6));
  },[])

  return(
    <div></div>
  )
}
