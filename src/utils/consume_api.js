import axios from 'axios';
import {notify} from './notify.js';

export class consume_api{
  constructor(uri, params, token){
    this.uri = uri;
    this.params = params;
    this.token = token;
  }

  get_petitions = async function(){  
    try{
      const headers = {
	"Content-type": "application/json; charset=utf-8",
	"Authorization": 'Bearer ' + this.token
      };
      const response = await axios.get(process.env.REACT_APP_API_BASE+this.uri, {headers:headers});
      return response.data["data"];
    }catch(error){		
      const {response: {data}} = error;	
      const err_msm = new notify(("Error: "+data["err"]));
      err_msm.error();
      return [];
    } 
  }

  post_petitions = async function(){   
    try{
      const headers = {
	"Content-type": "application/json; charset=utf-8",
	"Authorization": 'Bearer ' + this.token
      };
      const response = await axios.post(process.env.REACT_APP_API_BASE+this.uri, this.params, {headers:headers});
      const {data} = response  
      if(data["token"]){
	localStorage.setItem('name', data["name"]);
	const msm_welcome = new notify(data["msm"]);
	msm_welcome.success();	
	return
      }
      if(data["data"]){
	const msm_generic = new notify(data["msm"]);
	msm_generic.info();
	return data["data"];
      }
      const msm = new notify(data["msm"]);
      msm.info();
      }catch(error){
	const {response: {data}} = error;
	const err_msm = new notify("Error: "+data["err"]);
	err_msm.error();
	return [];
      } 
  }

  put_petitions = function async(){

  }

  delete_petitions = function async(){

  }

}
