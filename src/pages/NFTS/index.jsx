import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Chefz from './section/chefz'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './nfts.css'

const NFTS = () => {
  useEffect(() => {
    document.body.style.backgroundColor='white';
    document.body.style.backgroundImage = "url('./assets/img/Kitchen 1.png')";
  },[])
  return(
    <>
    <Header/>
      <div className='nft_container'>
        <Chefz/>
        <div className='menus'>MENUs</div>
        <div className='nft-menu'>
          <img className='nft-menu-img'  src='./assets/img/steakhouse_nft_menu 1.png' alt='nft' />
        </div>
        <div className='grills'>
          <div className='grills-text'>Go to grill section</div>
          <Link to='/'><div className='grill-button'>Grills</div></Link>
        </div>
      </div>
    <Footer/>
    </>
  );
}

export default NFTS;