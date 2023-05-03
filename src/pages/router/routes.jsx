import { Routes, Route } from "react-router-dom";
import Login from "../login/login.jsx";
import Navigation from "../../components/nav/navigation.jsx";
import Not_found from "../not_found/not_found.jsx";
import Home from "../home/home.jsx";
import List from "../list/list.jsx";
import Classroom from "../classroom/classroom.jsx";
import {Signin, Signup} from '../login/lg_component.jsx';
import { Create_list } from "../list/component.jsx";

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
     </Route>
     <Route path="/Activities" element={<Navigation />} />
     <Route path="/Documents" element={<Navigation />} />
     <Route path="/Profile" element={<Navigation />} />
     <Route path="*" element={<Not_found />} />
    </Routes>
  );
}
