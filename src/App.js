import './App.scss'
import Page_router from './pages/router/routes.jsx';
import {BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="app">
     <Page_router/>
    </div>
    </BrowserRouter>
  );
}

export default App;
