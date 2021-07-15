import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import axios from "axios";
import GameConfiguration from "./components/GameConfiguration/GameConfiguration";
import Play from "./components/Play/Play.js";

function App() {
  const [sessionToken, setSessionToken] = useState("");
  const [sessionTokenReloadTrigger, setNewSessionToken] = useState(false);

  const getNewSessionToken = () => {
    setNewSessionToken((prevstate) => !prevstate);
  };

  useEffect(() => {
    const fetchSessionToken = async () => {
      const response = await axios(
        "https://opentdb.com/api_token.php?command=request"
      );
      setSessionToken(response.data.token);
      console.log(response.data.token);
    };
    fetchSessionToken();
  }, [sessionTokenReloadTrigger]);

  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Home}></Route>
        <Route
          exact
          path="/game-configuration/"
          component={GameConfiguration}
        />
        <Route exact path="/play/">
          <Play
            newSessionToken={() => {
              getNewSessionToken();
            }}
            sessionToken={sessionToken}
          />
        </Route>
      </Router>
    </div>
  );
}

export default App;
