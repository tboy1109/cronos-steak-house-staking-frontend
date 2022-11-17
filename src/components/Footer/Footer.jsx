
import { Typography, Stack, useMediaQuery } from '@mui/material';
import { Link as ScrollLink } from 'react-scroll';
import {Link} from 'react-router-dom';
import './Footer.css';

const footerTitleStyle = {
  color:'white',
  fontFamily:'inter',
  fontSize:'20px',
  textAlign:'left',
  paddingBottom:'10px',
  width:'100%'
}

const Footer = () => {
  const mobile = useMediaQuery('(max-width: 395px)');
  return(
    <>
      <div className='footer-body'>
        <div className='footerRect'>
          <img className='footer-img' src='./assets/img/Flames.png' alt='footer' />
          <div className='bgcolor'>
            <div className='main'>
              <div className='textAilgnLeft'>
                <Typography className="textStroke" sx={footerTitleStyle}>Socials</Typography>
                <Stack direction='row' sx={{paddingLeft:'30px'}} spacing={3} alignItems='center' justifyContent='center'>
                  <Link to='https://t.me/CronosSteakhouse' target="_blank"><img src='./assets/img/Telegram.png' alt='telegram' /></Link>
                  <Link to='https://twitter.com/CronoSteakHouse' target="_blank"><img src='./assets/img/Twitter.png' style={{width:'43px', height:'33px'}} alt='twitter' /></Link>
                  <Link to='https://discord.gg/fpTgAReDyN' target="_blank"><img src='./assets/img/discord.png' alt='discord' /></Link>
                </Stack>
              </div>
              <div className='footer-right'>
                <div style={{marginTop:'30px'}}>
                  <Typography className="textStroke" sx={footerTitleStyle}>Navigation</Typography>
                  <Stack className='res' direction='row' spacing={1.5} >
                    <Typography  sx={{fontSize:'14px',color:'white'}}>&#9679;</Typography>
                    <ScrollLink to="grill_section" spy={true} smooth={true}>
                      <Typography className='textStroke footerListStyle' >Grill Section</Typography>
                    </ScrollLink>
                  </Stack>
                  <Stack className='res' direction='row' spacing={1.5} >
                    <Typography  sx={{fontSize:'14px',color:'white'}}>&#9679;</Typography>
                    <Link to="/" >
                      <Typography className='textStroke footerListStyle' >Home</Typography>
                    </Link>
                  </Stack>
                  <Stack className='res' direction='row' spacing={1.5} >
                    <Typography  sx={{fontSize:'14px',color:'white'}}>&#9679;</Typography>
                    <Link to="/NFTS" >
                      <Typography className='textStroke footerListStyle'>NFT mint</Typography>
                    </Link>
                  </Stack>
                </div>
                <div style={{marginTop:'30px'}}>
                  <Typography className="textStroke" sx={footerTitleStyle}>Partners</Typography>
                  <Stack direction={!mobile ? 'row' : 'column'} alignItems='center' justifyContent={'center'} spacing={!mobile ? 3 : 3}>
                    <img src='./assets/img/Jungle.png' alt='jungle'/>
                    <img src='./assets/img/Cromorphs.png' alt='cromorphs'/>
                    <img src='./assets/img/Nobud.png' alt='nobud' />
                  </Stack>
                </div>

                <div className='footer-group' style={{marginTop:'30px'}}>
                  <div className="textStroke" style={footerTitleStyle}>Docs</div>
                  <Link to="https://cronos-steakhouse.gitbook.io/the-cronos-steakhouse1/supported-grills/cro" target="_blank">
                    <img style={{marginTop:'-10px'}} src='./assets/img/gitbook 1.png' alt='gitbook' />
                  </Link>
                </div>

                <div className='footer-group' style={{marginTop:'10px'}}>
                  <div className="textStroke" style={footerTitleStyle}>Audits</div>
                  <Link to="https://cronos-steakhouse.gitbook.io/the-cronos-steakhouse1/supported-grills/cro" target="_blank">
                    <img src='./assets/img/INF.png' alt='audits' />
                  </Link>
                </div>
              </div>   
            </div>
            <div style={{maxWidth:'1750px',margin:'auto'}}>
              <Typography className='versionStyle'> © 2022 - CronosSteakhouse. All rights reserved.</Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Footer;