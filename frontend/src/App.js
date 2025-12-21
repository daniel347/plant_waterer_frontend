import './App.css';
import './css/colours.css';
import {Garden} from './garden/garden.js';

function App() {
  return (
    <div className="App">
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet"/>
        <Garden/>
    </div>
  );
}

export default App;
