import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchSessionToken } from '../../App';
import { useHistory } from "react-router-dom";
import Loading from '../Loading/Loading';
import PageTitle from '../PageTitle/PageTitle';
import QuestionCard from '../QuestionCard/QuestionCard';
import AnswersCard from '../AnswersCard/AnswersCard';
import Next from '../Next/Next';
import {render, unmountComponentAtNode} from 'react-dom';
import './Play.css';


export default function Play(){
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [question, setQuestion] = useState({});
  const userCategory = JSON.parse(window.sessionStorage.getItem('userCategory'));
  const userDifficulty = JSON.parse(window.sessionStorage.getItem('userDifficulty'));
  let sessionToken = "";
  
  const renameKey = (object, oldKey, newKey) => {
    Object.defineProperty(object, newKey, Object.getOwnPropertyDescriptor(object, oldKey));
    delete object[oldKey];
    return object;
  }
  

  const propsToSend = {
    'nextQuestion': () => {
      cleanQuestion();
      setAnswered(false);
      setLoaded(false);
      loadQuestion();
    },
    'exit': () => {history.replace('/')},
  }

  const checkSessionToken = () => {
    sessionToken = window.sessionStorage.getItem('triviaSessionToken');
    if(!sessionToken){
      fetchSessionToken();
    }
  }
  
  const fetchQuestion = async () => {
    let url = 'https://opentdb.com/api.php?amount=1&token=' + sessionToken
    if(userCategory && userCategory !== 0){ url += '&category=' + userCategory}
    if(userDifficulty){url += '&difficulty=' + userDifficulty.toLowerCase()}
    axios.get(url)
      .then(res =>{
        const code = res.data.response_code;
        if(code !== 0){
          if(code === 1){
            alert("There are no questions with the selected criteria. Please, change the game configuration.");
            history.replace('/game-configuration/');
          } else if(code === 3 || code===4){
            fetchSessionToken();
            history.replace(history.location);
          } else {
            alert('An error occurred. Sorry for the inconvenience.');
            history.replace('/');
          }
        } else {
          let question = res.data.results[0];
          question = renameKey(question, 'correct_answer', 'correctAnswer');
          question = renameKey(question, 'incorrect_answers', 'incorrectAnswers');
          question.question = decode(question.question);
          question.correctAnswer = decode(question.correctAnswer);
          let choices = [];
          for (const q of question['incorrectAnswers']){
            choices.push(decode(q));
          }
          if(!choices.find(elem => elem===question.correctAnswer)){
            choices.push(question.correctAnswer);
            choices.sort(() => Math.random() - 0.5);
          }
          question['choices'] = choices;
          delete question['incorrectAnswers'];
          setQuestion(question);
          setLoaded(true);
        }
      }).catch(err => {
        console.log(err);
      })
    };

  const decode = (text) =>{
    return text.replace(/(&quot;)/, '"').replace(/(&#039;)/, "'")
  }

  const cleanQuestion = () => {
    let button = document.querySelector('button.correct');
    if (button){
      button.classList.remove('correct');
    } else {
      document.querySelector('button.incorrect').classList.remove('incorrect');
    }
    document.querySelectorAll('button.choice').forEach(item => {
      item.setAttribute("disabled", false);
    });
  }

  const loadQuestion = () =>{
    checkSessionToken();
    fetchQuestion();
  }
  
  useEffect( () => {
    loadQuestion();
  }, []);


  const checkAnswer = (event) => {
    const correctAnswer = JSON.parse(window.sessionStorage.getItem('correctAnswer'));
    if(event.target.value === correctAnswer){
      event.target.classList.add('correct');
    } else {
      event.target.classList.add('incorrect');
    }
    document.querySelectorAll('button.choice').forEach(item => {
      item.setAttribute("disabled", true);
    });
    setAnswered(true);
  }
  
  return (
    <>
      <PageTitle classes="play-title" titleContent="ENJOY!"/>
      {loaded ? 
        <>
          <div className="question-container">
            <QuestionCard question={question.question}/>
            <AnswersCard choices={question.choices} checkAnswer={checkAnswer} />
          </div>
        </> 
        :
        <Loading />
        }
      {answered ?
        <Next {...propsToSend}/>
        :
        <></>
      }
    </>
  )
}