import './PageTitle.css';

export default function PageTitle(props){
  const classes = props.classes + ' page-title';
  
  return ( 
    <>
      <h2 className={classes}>{props.titleContent}</h2>
    </> 
  );
}