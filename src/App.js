import './App.scss'
import Page_router from './pages/router/routes.jsx';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/loader/loader';
import Modal from './components/modal/modal';
import RptViewer from './components/modal/RptModal';
//redux
import store from './store';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store';

function App() {
  return ( 
    <Provider store={store}> 
     <PersistGate loading={null} persistor={persistor}> 
      <BrowserRouter>
       <div className="app"> 
        <ToastContainer/> 
        <Modal/>
        <Loader/>
        <RptViewer/>
        <Page_router/>
       </div>
      </BrowserRouter>
     </PersistGate>
    </Provider>
  );
}

export default App;
