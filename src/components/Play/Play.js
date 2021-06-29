import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Play(){
  const [question, setQuestion] = useState([]);

  useEffect( () => {
    const sessionToken = window.localStorage.getItem('triviaSessionToken');
    if(!sessionToken){

    }
    const fetchData = async () => {
      const response = await axios('https://opentdb.com/api_token.php?amount=1&token=' + sessionToken);
      if(response.result_code != 0){
        console.log('error', response.result_code );
      } else {
        setQuestion(response.results);
      }
    };
    fetchData(); 
  }, []);

  return (
    <>

    </>
  )
}