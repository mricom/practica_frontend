import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './components/Home/Home';
import axios from 'axios';
import GameConfiguration from './components/GameConfiguration/GameConfiguration';
import Play from './components/Play/Play.js';

const fetchSessionToken = async() => {
  const response = await axios('https://opentdb.com/api_token.php?command=request');
  window.localStorage.setItem('triviaSessionToken', response.data.token);
}

function App() {
  useEffect( () => {
    if(!window.localStorage.triviaSessionToken){
      fetchSessionToken();
    }
  });

  return (
    <div className="App">
      <Router>
        <Route exact path='/' component={Home}></Route>
        <Route strict path='/game-configuration/' component={GameConfiguration}></Route>
        <Route strict path='/play/' component={Play}></Route>
      </Router>
    </div>
  );
}

export default App;

export {
  fetchSessionToken
}