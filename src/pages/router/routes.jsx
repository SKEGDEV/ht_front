import { Routes, Route } from "react-router-dom";
import Login from "../login/login.jsx";
import Navigation from "../../components/nav/navigation.jsx";
import Not_found from "../not_found/not_found.jsx";
import Home from "../home/home.jsx";
import List from "../list/list.jsx";
import {Signin, Signup} from '../login/lg_component.jsx';

export default function Page_router() {
	return (
		<Routes>
			<Route path="/" element={<Login Component={<Signin/>} />} />
			<Route path="/signup" element={<Login Component={<Signup/>} />} />
			<Route path="/Home" element={<Navigation Component={<Home />} />} />
			<Route path="/Lists" element={<Navigation Component={<List/>} active_btn={true}/>}/>
			<Route path="/Classroms" element={<Navigation />} />
			<Route path="/Activities" element={<Navigation />} />
			<Route path="/Documents" element={<Navigation />} />
			<Route path="/Profile" element={<Navigation />} />
			<Route path="*" element={<Not_found />} />
		</Routes>
	);
}
