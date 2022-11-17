import {useMemo} from 'react';
import { Typography ,Button} from '@mui/material';
import {styled} from '@mui/material/styles'
import { Outlet, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import './Card.css';

function useQuery() {
	const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const GrillButton  = styled(Button)({
  fontFamily:'inter',

  border:'1px solid black',
  borderRadius:'15px',

  lineHeight:'24px',
  fontSize:'20px',
  fontStyle:'medium',
  textAlign:'center',
  fontWeight:'900',
  margin:'auto',
  marginTop:'225px',
  width:'175px',
  height:'44px'
})

const Card = (props) => {
  const { title , content , name , url, bgColor, btn, fontColor} = props;
  console.log("fontColor:", fontColor)
  let query = useQuery();
	let ref = query.get('ref');
  return(
    <>
      <div className='itemBody' style={{backgroundColor: bgColor}}>
        <div className='itemTag'>
          <Typography className='textShdow cardTitleStyle'>{title}</Typography>
        </div>
        
        <Typography  className='textShdow contentTitleStyle'>{content}</Typography>
        <Typography className='textShdow textname'>{name}</Typography>
        <Link to={ref?(url+`?ref=${ref}`):url} className="underlineNone">
          <GrillButton className="textShdow" sx={{backgroundColor: btn, color: fontColor}} >START GRILL</GrillButton>
        </Link>
        <Outlet/>
      </div>
    </>
  );
}
export default Card;