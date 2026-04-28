import './css/App.css';
import Home from './pages/home';
import Login from './pages/Login';
import About from './pages/About';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
