import './App.css';
import Register from './Register';
import Login from './Login';
import Flights from './Flights';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Register />
        <Login />
        <Flights />
      </header>
    </div>
  );
}

export default App;
