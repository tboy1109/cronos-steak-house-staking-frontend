


const GrillMark = (props) => {
  const { title } = props;
  return(
    <>
      <div style={{backgroundImage:'url(./assets/img/CardTag.png)',
           backgroundPosition:'center center', 
           backgroundSize:'cover',
           width:'230px',
           height:'50px',
           display:'flex',
           justifyContent:'center',
           alignItems:'center',
           color:'#882100',
           fontSize:'24px',
           fontWeight: 900,
           margin:'0 auto'
      }}>
        {title}
      </div>
    </>
  );
}
export default GrillMark;