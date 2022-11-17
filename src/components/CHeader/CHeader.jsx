import * as React from 'react';
import WalletConnectButton from '../Button/WalletConnectButton.jsx';
import { Link } from "react-router-dom";
import './CHeader.css';
const Header  = () => {
  return(
    <>
      <div className="top">
        <div className="topbar">
          <Link to="/"><img src='./assets/meat.png' alt='meat' /></Link>
          <div className="menulist1">
            <Link to="/">Homepage</Link>
          </div>
          <WalletConnectButton 
            className='wallet-btn'
            variant="contained" size='medium' 
            style={{
              background:'#FDAB45',
              borderRadius:'12px',
              fontFamily: 'Inter',
              fontStyle: 'Medium',
              fontSize: {md:'20px',xs:'15px'},
              lineHeight: '24px',
              // marginRight:'60px',
              color:'#882100',
              fontWeight:'900',
              width: {md:'160px',xs:'120px'}
            }} />
        </div>
      </div>
    </>
  );
}
export default Header;