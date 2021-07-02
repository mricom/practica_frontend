import './Next.css';

export default function Next(props) {
  return (
    <>
      <div className="next-div">
        <button  className="next main-button" onClick={props.nextQuestion}>NEXT</button>
        <button  className="exit main-button" onClick={props.exit}>EXIT</button>
      </div>
    </>
  );
}
