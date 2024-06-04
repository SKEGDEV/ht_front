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

export const Api_routes = {
  //ClassroomsRoutes
  get_classroom:'/classroom/get-classrooms/1/',
  get_classroomYears:'/classroom/get-classrooms/2/0',
  get_classroomList: '/classroom/get-clist/',
  get_classroomListStudent:'/classroom/get-all-unit-student/',
  post_createClassroom:'/classroom/create-classroom',
  post_studentToClassroom:'/classroom/student_2_classroom',

  //ActivityRoutes
  get_activities:'/activity/get-activities/',
  get_studentActivities:'/activity/get-activity-students/',
  get_studentActivityInfo:'/activity/get-student-information/',
  put_qualifiedActivity:'/activity/qualified-activity',
  post_createActivity:'/activity/create-activity',
  get_studentStats: '/activity/get-student-stats-per-unit/',

  //StudentRoutes
  get_allList:'/student/get-all-list',
  get_allStudentOffList:'/student/get-all-student/',
  get_studentFile:'/student/get-student-file/',
  get_studentToUpdate:'/student/get-student-2-update/',
  put_updateStudent:'/student/update-student-information',
  post_AddStudentOutList:'/student/create-student-out-list',
  post_createStudentList:'/student/create-student-list',

  //CatalogRoutes
  get_activityTypeCatalog:'/catalogs/get-catalog/4/0',
  get_activitySubTypeCatalog:'/catalogs/get-catalog/5/0',
  get_studentCatalogs:'/student/get-catalogs',
  get_classroomTypeCatalog:'/catalogs/get-catalog/3/0',
  get_createAccountCountryCatalog:'/catalogs/get-catalog/1/0',
  get_createAccountDocumentCatalog:'/catalogs/get-catalog/2/',
  get_clist_for_list:'/catalogs/get-catalog/9/',

  //SessionRoutes
  get_verifySession:'/auth/verify-session',
  post_Signin:'/auth/login',
  post_Signup:'/auth/create-account',
  get_teacher2Update:'/auth/get-teacher-information',
  put_updateTeacher:'/auth/update-teacher-information',
  put_updateTeacherPassword:'/auth/update-teacher-password',

  //rpt Routes
  post_generateReport:'/rpt/generate-report-pdf'
}
