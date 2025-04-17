import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Flights from './Flights';
import Hotels from './Hotels';
import Activities from './Activities';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/Flights" element={<Flights />} />
            <Route path="/Hotels" element={<Hotels />} />
            <Route path="/Activities" element={<Activities />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
