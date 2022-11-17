
import {useState} from 'react';
import { Link } from "react-router-dom";
import {Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import './Header.css';
const JoinButton = styled(Button)({
  background:'#FDAB45',
  borderRadius:'12px',
  fontFamily: 'Inter',
  fontStyle: 'Medium',
  fontSize: '20px',
  lineHeight: '24px',
  color:'#882100',
  fontWeight:'900',
})
const Header  = () => {
  const [mobile , isMobile] = useState(false);
  const hambugerClick = () => {
    isMobile(true);
    console.log('mobile',mobile);
  }
  const humbugerClose = () => {
    isMobile(false)
  }
  return(
    <>
      <div className="top">
        <div className="topbar">
          <IconButton onClick={hambugerClick}  sx={{display:{md:'none',sm:'block'}}}><MenuIcon sx={{color:'#FDAB45'}} /></IconButton>
          <Link to='/'><img className='top-logo' src='./assets/img/SteakhouseLogo.png' alt='top-logo'></img></Link>
          <div className='menulist'>
            <Link  to="/"  className="menuitem">Grill section</Link>
            <Link to="/NFTS" className="menuitem" >NFT mint</Link>
            <Link to="head_chefs" className="menuitem" >Links</Link>
            <Link to="https://cronos-steakhouse.gitbook.io/the-cronos-steakhouse1/supported-grills/cro" target="_blank" className="menuitem" >Docs</Link>
            <img src='./assets/img/INF.png' alt='inf'/>
          </div>
          <Link to='https://discord.com/invite/fpTgAReDyN' target="_blank">
            <JoinButton >JOIN DISCORD</JoinButton>
          </Link> 
        </div>
      </div>

      <div className="overlay" style={{width:mobile ? '100%' : '0%'}}>
        <div className="closebtn" onClick={humbugerClose}>&times;</div>
        <div className="overlay-content">
          <Link  to="/">Grill section</Link>
          <Link to="/NFTS">NFT mint</Link>
          <Link to="/">Links</Link>
          <Link to="https://cronos-steakhouse.gitbook.io/the-cronos-steakhouse1/supported-grills/cro" target={'_blank'}>Docs</Link>
        </div>
      </div>
    </>
  );
}
export default Header;