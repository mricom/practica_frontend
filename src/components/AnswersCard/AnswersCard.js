import './AnswersCard.css';

export default function AnswersCard(props) {
  return (
    <>
       <div className="answers-div">
        {props.choices.map((item, index) => (
          <button className="multiple-choice choice" key={index} value={item} onClick={props.checkAnswer}>{item}</button>
        ))}
      </div>
    </>
  );
}
