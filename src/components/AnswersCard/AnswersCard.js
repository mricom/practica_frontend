import './AnswersCard.css';

export default function AnswersCard(props) {
  const choices = JSON.parse(window.sessionStorage.incorrectAnswers);
  console.log(props);
  return (
    <>
      <div className="answers-div">
        {choices.map((item, index) => (
          <button className="multiple-choice choice" key={index} value={item} onClick={props.checkAnswer}>{item}</button>
        ))}
      </div>
    </>
  );
}
