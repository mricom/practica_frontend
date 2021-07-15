import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Loading/Loading";
import PageTitle from "../PageTitle/PageTitle";
import QuestionCard from "../QuestionCard/QuestionCard";
import "./Play.css";
import { Redirect } from "react-router";

function useMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

export default function Play(props) {
  const [loaded, setLoaded] = useState(false);
  const [clickedButton, saveClickedButton] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [reloadTrigger, reloadQuestion] = useState(true); //This state just triggers the reload of the question
  const [question, setQuestion] = useState({});
  const [redirectUrl, setRedirectURL] = useState("");
  const isMounted = useMounted();

  const userCategory = JSON.parse(
    window.sessionStorage.getItem("userCategory")
  );
  const userDifficulty = JSON.parse(
    window.sessionStorage.getItem("userDifficulty")
  );
  const sessionToken = props.sessionToken;

  const renameKey = (object, oldKey, newKey) => {
    Object.defineProperty(
      object,
      newKey,
      Object.getOwnPropertyDescriptor(object, oldKey)
    );
    delete object[oldKey];
    return object;
  };

  const decode = (text) => {
    return text.replaceAll(/(&quot;)/g, '"').replaceAll(/(&#039;)/g, "'");
  };

  const propsToSend = {
    nextQuestion: () => {
      reloadQuestion((prevstate) => !prevstate);
    },
    exit: () => {
      setRedirectURL("/");
    },
  };

  const handleNextOnClick = () => {
    reloadQuestion((prevstate) => !prevstate);
  };
  const handleExitOnClick = () => {
    setRedirectURL("/");
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      let url = "https://opentdb.com/api.php?amount=1&token=" + sessionToken;
      if (userCategory && userCategory !== 0) {
        url += "&category=" + userCategory;
      }
      if (userDifficulty) {
        url += "&difficulty=" + userDifficulty.toLowerCase();
      }
      axios
        .get(url)
        .then((res) => {
          const code = res.data.response_code;
          if (code !== 0) {
            if (code === 1) {
              alert(
                "There are no questions with the selected criteria. Please, change the game configuration."
              );
              setRedirectURL('/game-configuration/');
            } else if (code === 3 || code === 4) {
              alert("There has been a problem with the token. Please, try again.");
              setRedirectURL('/');
            } else {
              alert("An error occurred. Sorry for the inconvenience.");
              setRedirectURL('/');
            }
          } else {
            let question = res.data.results[0];
            question = renameKey(question, "correct_answer", "correctAnswer");
            question = renameKey(
              question,
              "incorrect_answers",
              "incorrectAnswers"
            );
            question.question = decode(question.question);
            question.correctAnswer = decode(question.correctAnswer);
            let choices = [];
            for (const q of question.incorrectAnswers) {
              choices.push({ value: decode(q), status: "neutral" });
            }
            if (!choices.find((elem) => elem === question.correctAnswer)) {
              choices.push({
                value: decode(question.correctAnswer),
                status: "neutral",
              });
              choices.sort(() => Math.random() - 0.5);
            }
            question["choices"] = choices;
            delete question["incorrectAnswers"];
            setQuestion(question);
            setLoaded(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchQuestion();
    setAnswered(false);
    setLoaded(false);
  }, [reloadTrigger]);

  const checkAnswer = (event) => {
    setAnswered(true);
    saveClickedButton(event.target.getAttribute("buttonid"));
    console.log(event.target.getAttribute("buttonid"));
  };

  useEffect(() => {
    if (isMounted) {
      console.log(question.choices);
      let choices = [...question.choices];
      console.log(choices);
      for (let i = 0; i < choices.length; i++) {
        if (choices[i].value === question.correctAnswer) {
          choices[i].status = "correct";
        } else if (i === parseInt(clickedButton)) {
          console.log("incorrect");
          choices[i].status = "incorrect";
        }
      }
      setQuestion((prevState) => ({ ...prevState, choices }));
    }
  }, [clickedButton]);

  return (
    <>
      {redirectUrl === "" ? (
        <div className="play">
          <PageTitle classes="play-title" titleContent="ENJOY!" />
          {loaded ? (
            <>
              <div className="question-container">
                <QuestionCard question={question.question} />
                <div className="answers-div">
                  {question.choices.map((item, index) => (
                    <button
                      className={"multiple-choice choices ".concat(item.status)}
                      key={index}
                      buttonid={index}
                      value={item.value}
                      onClick={(event) => {
                        checkAnswer(event);
                      }}
                      disabled={answered ? true : false}
                    >
                      {item.value}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Loading />
          )}
          {answered ? (
            <div className="next-div">
              <button className="next main-button" onClick={handleNextOnClick}>
                NEXT
              </button>
              <button className="exit main-button" onClick={handleExitOnClick}>
                EXIT
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <Redirect to={redirectUrl} />
      )}
    </>
  );
}

//   const propsToSend = {
//     'nextQuestion': () => {reloadQuestion(prevstate => !prevstate);
//     },
//     'exit': () => {setRedirectURL('/');}
//   }

//   const getNewSessionToken = () => {
//     props.newSessionToken();
//   }

//   const sessionToken = props.sessionToken;

//   useEffect( () => {
//     const fetchQuestion = async () => {
//       let url = 'https://opentdb.com/api.php?amount=1&token=' + sessionToken
//       if(userCategory && userCategory !== 0){ url += '&category=' + userCategory}
//       if(userDifficulty){url += '&difficulty=' + userDifficulty.toLowerCase()}
//       axios.get(url)
//         .then(res =>{
//           const code = res.data.response_code;
//           if(code !== 0){
//             if(code === 1){
//               alert("There are no questions with the selected criteria. Please, change the game configuration.");
//               setRedirectURL('/game-configuration/');
//             } else if(code === 3 || code===4){
//               getNewSessionToken();
//               reloadQuestion(prevstate => !prevstate);
//             } else {
//               alert('An error occurred. Sorry for the inconvenience.');
//               setRedirectURL('/');
//             }
//           } else {
//             let question = res.data.results[0];
//             question = renameKey(question, 'correct_answer', 'correctAnswer');
//             question = renameKey(question, 'incorrect_answers', 'incorrectAnswers');
//             question.question = decode(question.question);
//             question.correctAnswer = decode(question.correctAnswer);
//             let choices = [];
//             for (const q of question['incorrectAnswers']){
//               choices.push(decode(q));
//             }
//             if(!choices.find(elem => elem===question.correctAnswer)){
//               choices.push(question.correctAnswer);
//               choices.sort(() => Math.random() - 0.5);
//             }
//             question['choices'] = choices;
//             delete question['incorrectAnswers'];
//             setQuestion(question);
//             setLoaded(true);
//           }
//         }).catch(err => {
//           console.log(err);
//         })
//       };
//       fetchQuestion();
//   }, [reloadTrigger, reloadTrigger]);

//   useEffect(() => {
//     if (redirectUrl !== ''){
//       render(<Redirect to={redirectUrl}/>, document.querySelector('.'))
//       return () => {
//         setRedirectURL('');
//       }
//     }
//   }, [redirectUrl])

//   const checkAnswer = (event) => {
//     const correctAnswer = JSON.parse(window.sessionStorage.getItem('correctAnswer'));
//     if(event.target.value === correctAnswer){
//       event.target.classList.add('correct');
//     } else {
//       event.target.classList.add('incorrect');
//     }
//     document.querySelectorAll('button.choice').forEach(item => {
//       item.setAttribute("disabled", true);
//     });
//     setAnswered(true);
//   }

// return (
//   <>
//     <div className="play">
//       <PageTitle classes="play-title" titleContent="ENJOY!"/>
//       {loaded ?
//         <>
//           <div className="question-container">
//             <QuestionCard question={question.question}/>
//             <AnswersCard choices={question.choices} checkAnswer={() => {checkAnswer()}} />
//           </div>
//         </>
//         :
//         <Loading />
//         }
//       {answered ?
//         <Next {...propsToSend}/>
//         :
//         <></>
//       }
//     </div>
//   </>
// )
