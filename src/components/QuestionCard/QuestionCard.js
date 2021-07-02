import './QuestionCard.css';

export default function QuestionCard(props){
  return (
    <>
      <div className="question-card">
        <p>{props.question}</p>
      </div>
    </>
  )
}