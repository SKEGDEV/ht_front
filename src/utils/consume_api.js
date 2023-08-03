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
      const {data} = response
      if(data["isEmpty"] || data["isUnique"]){
	return data
      }
      if(data["auth"]){
	return data;
      }
      if(data["data"]){
	return data["data"];
      }
      return data;
    }catch(error){		
      const {response: {data}} = error;
      if(data["msm"] === "Authorization"){
	return data;
      }
      if(data["err"]){
	const err_msm = new notify(("Error: "+data["err"]));
	err_msm.error();
	return[];
      } 
      const err_internal = new notify("Error: "+error.message);
      err_internal.error();
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
	return data;
      }
      if(data.data){
	return data;
      } 
      return data;
      }catch(error){		
	const {response: {data}} = error;
	if(data["err"]){
	  const err_msm = new notify("Error: "+data["err"]);
	  err_msm.error();
	  return {};
	}	
	const err_internal = new notify("Error: "+error.message);
	err_internal.error();
	return {};
      } 
  }

  put_petitions = async function(){
    try{
      const headers = {
	"Content-type": "application/json; charset=utf-8",
	"Authorization": 'Bearer ' + this.token
      }
      const response = await axios.put(process.env.REACT_APP_API_BASE+this.uri, this.params, {headers:headers});
      const {data} = response
      if(data["isValid"]){
	return data;
      }
      if(data["msm"]){
	return data["msm"]
      }
      return "Success"
    }catch(e){
      const {response: {data}} = e
      if(data["err"]){
	const err_msm = new notify(`Error: ${data["err"]}`);
	err_msm.error();
	return "";
      }
      const err_internal = new notify(`Error: ${e.message}`);
      err_internal.err_msm();
      return "";
    }
  }

  delete_petitions = function async(){

  }

}
