import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from './Register';
import Login from './Login';
import Flights from './Flights';
import Hotels from './Hotels';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Register />
        <Login />
        <Flights />
        <Hotels />
      </header>
    </div>
  );
}

export default App;
