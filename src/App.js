import './App.scss'
import Page_router from './pages/router/routes.jsx';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//redux
import store from './store';
import {Provider} from 'react-redux';

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <ToastContainer/>
    <div className="app"> 
    <Page_router/>
    </div>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
