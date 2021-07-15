import { useState, useEffect } from "react";
import PageTitle from "../PageTitle/PageTitle";
import './GameConfiguration.css';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Loading from '../Loading/Loading';




export default function GameConfiguration(){
  const history = useHistory();
  const [configuration, setConfiguration] = useState({
    category: '0',
    difficulty: 'Easy',
  });
  const difficulties_choices = ['Easy', 'Medium', 'Hard'];
  //const [difficulty, setDifficulty] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const fetchData = async () => {
      axios.get('https://opentdb.com/api_category.php')
        .then(res=> {
          let finalCategories = [{'id': '0', 'name':'All'}];
          let categories = res.data.trivia_categories.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
          finalCategories = finalCategories.concat(categories);
          setCategories(finalCategories); 
        }).finally(function(){
          setLoading(false); 
        })
    };
    fetchData(); 
  }, []);

  const handleChange = event => {
      setConfiguration({
        ...configuration, 
        [event.target.name]: event.target.value 
      });
  }
  
  const handleSubmit = () => {
    window.sessionStorage.setItem('userCategory', JSON.stringify(configuration.category));
    window.sessionStorage.setItem('userDifficulty', JSON.stringify(configuration.difficulty));
    history.push('/play/');
  }

  return ( 
    <>
      <div className="game-configuration-container">
        <PageTitle classes="game-configuration-title" titleContent="GAME CONFIGURATION"/>
        {loading ? 
          <Loading />
          :
          <>
            <form onSubmit={handleSubmit}>
              <label>
                <p>Choose a category:</p>
                <select value={configuration.category} 
                name="category" onChange={handleChange}> 
                  {categories.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))} 
                </select>
              </label>
              <label>
                <p>Choose a difficulty:</p>
                <select name="difficulty" onChange={handleChange}> 
                  {difficulties_choices.map(item => (<option value={item} key={item}>{item}</option>))} 
                </select>
              </label>
              <button className="play main-button" type="submit">PLAY</button>
            </form>
          </>
        }
      </div>
    </> 
  );
}