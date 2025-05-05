import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Navbar';
import Register from './Register';
import Login from './Login';
import Flights from './Flights';
import Hotels from './Hotels';
import LoadMap from './LoadMap';
import Itinerary from './Itinerary';
import TravelPreferences from './TravelPreferences';
import UserRecommendations from './userRecommendations';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/Flights" element={<Flights />} />
            <Route path="/Hotels" element={<Hotels />} />
            <Route path="/Activities" element={<LoadMap />} />
            <Route path="/" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Itinerary" element={<Itinerary />}/>
            <Route path='/travelPreferences' element={<TravelPreferences />}/>
            <Route path='/userRecommendations' element={<UserRecommendations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
