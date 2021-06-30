import ReactLoading from "react-loading";
import './Loading.css';

export default function Question(props){
  return (
    <>
      <div className="loading-div">
        <ReactLoading type={'spokes'} color="#5ac75d" />
      </div>
    </>
  )
}