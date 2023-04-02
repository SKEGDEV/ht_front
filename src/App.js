import './App.scss'
import Page_router from './pages/router/routes.jsx';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
    <ToastContainer/>
    <div className="app"> 
    <Page_router/>
    </div>
    </BrowserRouter>
  );
}

export default App;
