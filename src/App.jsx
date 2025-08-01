import './App.css';
import 'react-image-crop/dist/ReactCrop.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./components/Login";
import Logout from './components/Logout';
import Home from "./components/Home";
import Navigation from './components/navigation';

function App() {
    return  <BrowserRouter>
        <Navigation></Navigation>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
        </Routes>
    </BrowserRouter>
}

export default App;

