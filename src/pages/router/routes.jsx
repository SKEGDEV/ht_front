import { Routes, Route } from "react-router-dom";
import Login from "../login/login.jsx";
import Navigation from "../../components/nav/navigation.jsx";
import Not_found from "../not_found/not_found.jsx";
import Home from "../home/home.jsx";
import List from "../list/list.jsx";
import Classroom from "../classroom/classroom.jsx";
import {Signin, Signup} from '../login/lg_component.jsx';
import { Create_list } from "../list/component.jsx";
import { Create_classroom, Upload_listing } from "../classroom/component.jsx";
import { Select_clist, Get_clist } from "../classroom/classroom.jsx";

export default function Page_router() {
  return (
    <Routes>
     <Route path="/" element={<Login Component={<Signin/>} />} />
     <Route path="/signup" element={<Login Component={<Signup/>} />} />
     <Route path="/Home" element={<Navigation Component={<Home />} />} />
     <Route path="/Lists" >
       <Route index element={<Navigation Component={<List/>}/>}/>
       <Route path="create-list" element={<Navigation Component={<Create_list/>}/>}/>
     </Route>
     <Route path="/Classroms">
       <Route index element={<Navigation Component={<Classroom/>}/>}/>
       <Route path="create-classroom" element={<Navigation Component={<Create_classroom/>}/>}/>
       <Route path="upload-listing" element={<Navigation Component={<Upload_listing/>}/>}/>
       <Route path="select-clist/:clist_number" element={<Navigation Component={<Select_clist/>}/>}/>
       <Route path="get-class-list/:clist_number" element={<Navigation Component={<Get_clist/>}/>}/>
     </Route>
     <Route path="/Activities" element={<Navigation />} />
     <Route path="/Documents" element={<Navigation />} />
     <Route path="/Profile" element={<Navigation />} />
     <Route path="*" element={<Not_found />} />
    </Routes>
  );
}
