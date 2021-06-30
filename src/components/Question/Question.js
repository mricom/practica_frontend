import QuestionCard from '../QuestionCard/QuestionCard';
import AnswersCard from '../AnswersCard/AnswersCard';
import './Question.css';

export default function Question(){
  const checkAnswer = (event) => {
    const correctAnswer = JSON.parse(window.sessionStorage.getItem('correctAnswer'));
    console.log(event.target.value);
    if(event.target.value === correctAnswer){
      event.target.classList.add('correct');
    } else {
      event.target.classList.add('incorrect');
      const correctAnswerButton = document.querySelector('button[value="' + correctAnswer + '"]');
    }
    document.querySelectorAll('button.choice').forEach(item => {
      item.setAttribute("disabled", true);
      item.classList.add('disabled');
    });
  }

  return (
    <>
      <div className="question-container">
        <QuestionCard/>
        <AnswersCard checkAnswer={checkAnswer} />
      </div>
    </>
  )
}