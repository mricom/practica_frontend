import { useHistory } from "react-router-dom";
import './Home.css';


export default function Home(){
  const history = useHistory();
  function configureGame() {
    history.push("/game-configuration/categories/");
  }

  return ( 
    <>
      <div className="home-container">
        <h1><span className="open">OPEN</span><span className="trivia"
        >TRIVIA</span></h1>
        <button className="start-button" onClick={configureGame}>START</button>
      </div>
    </> 
  );
}