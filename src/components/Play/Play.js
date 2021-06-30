import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchSessionToken } from '../../App';
import { useHistory } from "react-router-dom";
import Question from '../Question/Question';
import Loading from '../Loading/Loading';
import PageTitle from '../PageTitle/PageTitle';


export default function Play(){
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const userCategory = JSON.parse(window.sessionStorage.getItem('userCategory'));
  const userDifficulty = JSON.parse(window.sessionStorage.getItem('userDifficulty'));

  
  const renameKey = (object, oldKey, newKey) => {
    Object.defineProperty(object, newKey,
    Object.getOwnPropertyDescriptor(object, oldKey));
    delete object[oldKey];
    return object;
  }

  useEffect( () => {
    const sessionToken = window.localStorage.getItem('triviaSessionToken');
    if(!sessionToken){
      fetchSessionToken();
    }
    const fetchData = async () => {
      let url = 'https://opentdb.com/api.php?amount=1&token=' + sessionToken
      if(userCategory && userCategory !== 0){ url += '&category=' + userCategory}
      if(userDifficulty){url += '&difficulty=' + userDifficulty.toLowerCase()}
      const response = axios.get(url)
        .then(res =>{
          const code = res.data.response_code;
          if(code !== 0){
            if(code === 1){
              alert("There are no questions with the selected criteria. Please, change the game configuration.");
              history.push('/game-configuration/');
            } else if(code === 3 || code===4){
              fetchSessionToken();
              history.push(history.location);
            } else {
              alert('An error occurred. Sorry for the inconvenience.');
              history.push('/');
            }
          } else {
            let question = res.data.results[0];
            question = renameKey(question, 'correct_answer', 'correctAnswer');
            question = renameKey(question, 'incorrect_answers', 'incorrectAnswers');
            let choices = question.incorrectAnswers;
            if(!question.incorrectAnswers.find(elem => elem===question.correctAnswer)){
              choices.push(question.correctAnswer);
              choices.sort(() => Math.random() - 0.5);
            }
            for(const prop in question){
              window.sessionStorage.setItem(prop,JSON.stringify(question[prop]));
            }
          }
        }). finally(function(){
          setLoading(false);
        });
    };
    fetchData(); 
    return () => window.sessionStorage.clear();
  }, []);


  return (
    <>
      <PageTitle classes="play-title" titleContent="ENJOY!"/>
      {loading ? 
        <Loading />
          :
          <>
            <Question></Question>
          </>
        }
    </>
  )
}