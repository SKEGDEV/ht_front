import axios from 'axios';

export class consume_api{
  constructor(uri, params, token){
    this.uri = uri;
    this.params = params;
    this.token = token;
  }

  get_petitions = function async(){
    axios.get(uri).then((response)=>{
      if(response != null){
	return  
      }
    });
  }

  post_petitions = function async(){

  }

  put_petitions = function async(){

  }

  delete_petitions = function async(){

  }

}
