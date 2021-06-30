import './QuestionCard.css';

export default function QuestionCard(){
  return (
    <>
      <div className="question-card">
        <p>{JSON.parse(window.sessionStorage.getItem('question'))}</p>
      </div>
    </>
  )
}