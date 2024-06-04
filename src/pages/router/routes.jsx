import { Routes, Route } from "react-router-dom";
import Login from "../login/login.jsx";
import Navigation from "../../components/nav/navigation.jsx";
import Not_found from "../not_found/not_found.jsx";
import Home from "../home/home.jsx";
import List from "../list/list.jsx";
import { Get_list_student, Get_studentFile } from "../list/list.jsx";
import Classroom from "../classroom/classroom.jsx";
import {Signin, Signup} from '../login/lg_component.jsx';
import { Create_list, Add_update_student } from "../list/component.jsx";
import { Create_classroom, Upload_listing } from "../classroom/component.jsx";
import { Select_clist, Get_clist, Classroom_year, Get_statsStudent } from "../classroom/classroom.jsx";
import Not_session from "../not_found/off_session.jsx";
import Activities from "../activities/activities.jsx";
import { Get_activities, Get_sActivities } from "../activities/activities.jsx";
import { Qualified, Create_activity } from "../activities/component.jsx";
import Documents, {Form_toReport, RptStudent} from "../documents/documents.jsx";
import Profile from "../profile/profile.jsx";

export default function Page_router() {
  return (
    <Routes>
     <Route path="/" element={<Login Component={<Signin/>} />} />
     <Route path="/signup" element={<Login Component={<Signup/>} />} />
     <Route path="/Home" element={<Navigation Component={<Home />} />} />
     <Route path="/Lists" >
       <Route index element={<Navigation Component={<List/>}/>}/>
       <Route path="create-list" element={<Navigation Component={<Create_list/>}/>}/>
       <Route path="get-student/:list_id" element={<Navigation Component={<Get_list_student/>}/>}/>
       <Route path="add-update-student/:list_id/:s_id" element={<Navigation Component={<Add_update_student/>}/>}/>
       <Route path="get-student-file/:s_id/:list_id" element={<Navigation Component={<Get_studentFile/>}/>}/>
     </Route>
     <Route path="/Classroms">
       <Route index element={<Navigation Component={<Classroom_year/>}/>}/>
       <Route path="classroom-list/:year" element={<Navigation Component={<Classroom/>}/>}/>
       <Route path="create-classroom" element={<Navigation Component={<Create_classroom/>}/>}/>
       <Route path="upload-listing" element={<Navigation Component={<Upload_listing/>}/>}/>
       <Route path="select-clist/:clist_number/:search_type" element={<Navigation Component={<Select_clist/>}/>}/>
       <Route path="get-class-list/:clist_number" element={<Navigation Component={<Get_clist/>}/>}/>
       <Route path="get-graph-student/:s_id/:clist_number" element={<Navigation Component={<Get_statsStudent/>}/>}/>
     </Route>
     <Route path="/Activities">
       <Route index element={<Navigation Component={<Classroom_year/>}/>} />
       <Route path="activities-list/:year" element={<Navigation Component={<Activities/>}/>}/>
       <Route path="get-all-activities/:u_number" element={<Navigation Component={<Get_activities/>}/>}/>
       <Route path="get-student-activities/:points" element={<Navigation Component={<Get_sActivities/>}/>}/>
       <Route path="qualified-activity/:student/:type" element={<Navigation Component={<Qualified/>}/>}/>
       <Route path="create-new-activity/:number" element={<Navigation Component={<Create_activity/>}/>}/>
     </Route>
     <Route path="/Documents">
       <Route index element={<Navigation Component={<Documents/>}/>}/>
       <Route path="form-to-get-rpt/:variant" element={<Navigation Component={<Form_toReport/>}/>}/>
       <Route path="student-list-rpt" element={<Navigation Component={<RptStudent/>}/>}/>
     </Route>
     <Route path="/Profile">
       <Route index element={<Navigation Component={<Profile/>}/>}/>
     </Route>
     <Route path="/out-session/:msm" element={<Not_session/>}/>
     <Route path="*" element={<Not_found />} />
    </Routes>
  );
}
