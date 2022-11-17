import { useState , useEffect } from 'react';
import { Typography, Stack} from '@mui/material';
import { ethers } from 'ethers';
import axios from 'axios';
import Mark from '../../components/Mark/mark';
import Card from '../../components/Homecard/Card';
import Avatar from '../../components/Avatar/Avatar';
import config from '../../Config/config.json';
import abi from '../../Contracts/Steak.json';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Homepage.css';

const titleStyle = {
  fontFamily: 'Lilita One',
  fontStyle: 'regular',
  fontSize: {md:'40px',sm:'30px',xs:'20px'},
  lineHeight: {md:'46px',sm:'36px',xs:'26px'},
  marginTop:'25px !important',
  marginBottom:'44px',
  color:'white',
  textAlign:'center',
  fontWeight: 400
}

const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
export default function Homepage(){
  const [isMobile,setIsMobile] = useState(false);
  const [croPool, setCroPool] = useState(0);
  const [usdcPool, setUsdcPool] = useState(0);
  const [mmfPool, setMmfPool] = useState(0);
  const [svnPool, setSvnPool] = useState(0);
  const [lotteryPool, setLotteryPool] = useState(0);
  const [thndrPool, setThndrPool] = useState(0);
  const [crogePool, setCrogePool] = useState(0);
  const [vvsPool, setVvsPool] = useState(0);
  const [lionPool, setLionPool] = useState(0);
  const [tonicPool, setTonicPool] = useState(0);
  const [tvl, setTVL] = useState(0);
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }
  const fetchPoolSizes = async () => {
    try {
      let cro_steak = new ethers.Contract(config.cro_steak_contract, abi.abi, readProvider);
      cro_steak.getBalance().then(balance => {
        setCroPool(ethers.utils.formatEther(balance));
      });
      let usdc_steak = new ethers.Contract(config.usdc_steak_contract, abi.abi, readProvider);
      usdc_steak.getBalance().then(balance => {
        setUsdcPool(ethers.utils.formatUnits(balance, 6));
      });
      let mmf_steak = new ethers.Contract(config.mmf_steak_contract, abi.abi, readProvider);
      mmf_steak.getBalance().then(balance => {
        setMmfPool(ethers.utils.formatEther(balance));
      });
      let svn_steak = new ethers.Contract(config.svn_steak_contract, abi.abi, readProvider);
      svn_steak.getBalance().then(balance => {
        setSvnPool(ethers.utils.formatEther(balance));
      });
      let lottery_steak = new ethers.Contract(config.lottery_steak_contract, abi.abi, readProvider);
      lottery_steak.getBalance().then(balance => {
        setLotteryPool(ethers.utils.formatEther(balance));
      })
      let croge_steak = new ethers.Contract(config.croge_steak_contract, abi.abi, readProvider);
      croge_steak.getBalance().then(balance => {
        setCrogePool(ethers.utils.formatUnits(balance, 9));
      })
      let thndr_steak = new ethers.Contract(config.thndr_steak_contract, abi.abi, readProvider);
      thndr_steak.getBalance().then(balance => {
        setThndrPool(ethers.utils.formatEther(balance));
      })
      let vvs_steak = new ethers.Contract(config.vvs_steak_contract, abi.abi, readProvider);
      vvs_steak.getBalance().then(balance => {
        setVvsPool(ethers.utils.formatEther(balance));
      })
      let lion_steak = new ethers.Contract(config.lion_steak_contract, abi.abi, readProvider);
      lion_steak.getBalance().then(balance => {
        setLionPool(ethers.utils.formatEther(balance));
      })
      let tonic_steak = new ethers.Contract(config.tectonic_steak_contract, abi.abi, readProvider);
      tonic_steak.getBalance().then(balance => {
        setTonicPool(ethers.utils.formatEther(balance));
      })
    } catch (err) {
      console.log(err);
    }
  };
  

  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/simple/price?ids=mmfinance%2Csavanna%2Ccrypto-com-chain%2Cusd-coin%2Cvvs-finance%2Ccrogecoin%2Clion-scrub-finance%2Ctectonic&vs_currencies=usd')
      .then(res => {
        console.log('prices: ', res.data);
        const croPrice = res.data["crypto-com-chain"].usd;
        const mmfPrice = res.data["mmfinance"].usd;
        const svnPrice = res.data["savanna"].usd;
        const usdPrice = res.data["usd-coin"].usd;
        const crogePrice = res.data["crogecoin"].usd;
        const vvsPrice = res.data["vvs-finance"].usd;
        const lionPrice = res.data["lion-scrub-finance"].usd;
        const tonicPrice = res.data["tectonic"].usd;
        let tvl = croPool * croPrice + usdcPool*usdPrice + mmfPrice * mmfPool + svnPrice * svnPool + croPrice * lotteryPool + crogePrice * crogePool + vvsPrice * vvsPool + tonicPool * tonicPrice + lionPool * lionPrice;
        console.log('tvl: ', tvl);
        setTVL(tvl);
      })
  }, [croPool, usdcPool, mmfPool, svnPool, lotteryPool, vvsPool, lionPool, tonicPool, crogePool]);

  useEffect(() => {
    window.addEventListener("resize",handleResize);
    fetchPoolSizes();
    document.body.style.backgroundImage='none'
    document.body.style.backgroundColor='#232323';
  }, [])
  return(
    <>
      <Header/>
      <div className='body'>
        <Mark/>
        <Typography sx={titleStyle}>The cronos staking pools with the tastiest daily returns</Typography>
        <div className='grill_steak'>
          <img src='./assets/img/teaser 2.png' alt='teaser' />
          <Stack direction='column' spacing={5} alignItems='center'>
            <Typography sx={{fontSize:{md:'24px',sm:'16px',xs:'12px'},fontFamily: 'Lilita One',marginTop:'15px', fontWeight:400}}>Select a BBQ below to Grill your steak on.</Typography>
            <div className="grill-section" id="grill_section">
            {/* <img src='./assets/img/Component.png' style={{width:'100%'}}></img> */}
            <span className='grill-section-title'>TVL: {Math.round(tvl * 100) / 100} USD</span>
            {/* TVL: 10000000 USD */}
            </div>
          </Stack>
        </div>

        <Stack id='grill_section' direction='row' justifyContent='center' flexWrap='wrap' sx={{mt: 20}}>
          <Card title='MMF GRILL' content={'Pool size: ' + Math.round(mmfPool * 100) / 100 + ' MMF'} name='MMF' url='/MMF' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='CRO GRILL' content={'Pool size: ' + Math.round(croPool * 100) / 100 + ' CRO'} name='CRO' url='/CRO' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='USDC GRILL' content={'Pool size: ' + Math.round(usdcPool * 100) / 100 + ' USDC'} name='USDC' url='/USDC' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='SVN GRILL' content={'Pool size: ' + Math.round(svnPool * 100) / 100 + ' SVN'} name='SVN' url='/SVN' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='CRO Lottery Grill' content={'Pool size: ' + Math.round(lotteryPool * 100) / 100 + ' CRO'} name='CRO' url='/Lottery' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='CROGE GRILL' content={'Pool size: ' + Math.round(crogePool * 100) / 100 + ' CROGE'} name='CROGE' url='/CROGE' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='THNDR Grill' content={'Pool size: ' + Math.round(thndrPool * 100) / 100 + ' THNDR'} name='THNDR' url='/THNDR' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='VVS Grill' content={'Pool size: ' + Math.round(vvsPool * 100) / 100 + ' VVS'} name='VVS' url='/VVS' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='Tonic Grill' content={'Pool size: ' + Math.round(tonicPool * 100) / 100 + ' Tonic'} name='Tonic' url='/TONIC' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          <Card title='LION Grill' content={'Pool size: ' + Math.round(lionPool * 100) / 100 + ' Lion'} name='Lion' url='/LION' bgColor='#800000' btn='#FDAB45' fontColor='#892100' />
          {/* <Card title='Doge' content={'Pool size: ' + Math.round(thndrPool * 100) / 100 + ' Doge'} name='Doge' url='/Doge' bgColor='#8D5AFA' btn='#2E271E' fontColor='white' />
          <Card title='POLY MMF' content={'Pool size: ' + Math.round(thndrPool * 100) / 100 + ' MMF'} name='Poly' url='/POLY' bgColor='#8D5AFA' btn='#2E271E' fontColor='white' /> */}
          <Card title='Doge' content={'Coming Soon'} name='Doge' url='/' bgColor='#8D5AFA' btn='#2E271E' fontColor='white' />
          <Card title='POLY MMF' content={'Coming Soon'} name='Poly' url='/' bgColor='#8D5AFA' btn='#2E271E' fontColor='white' />
        </Stack>
      
          <Stack sx={{marginTop:'248px'}} direction='column' justifyContent='center' spacing={5} alignItems='center'>
            <img className='recipe' src='./assets/img/recipe.png' alt='recipe' />
            <img className='roadmap' src='./assets/img/Roadmapv1 2.png' alt='roadmap' />
          </Stack>
          
         
            <img className='nftimgF' src='./assets/img/TAG Head Chef.png' alt='nftimgf' />
         
          <div>
            <div className='cardBox cardRow-1'>
              <Avatar name='Guy Fieri' content='Flavortown CEO' img='./assets/img/HEAD Fieri.png'/>
            </div>
            <div className='cardBox cardRow-2'>
              <Avatar name='Boyardee' content='Pasta man' img='./assets/img/Boyarde.png'/>
              <Avatar name='Salt Bae' content='SEC Commisioner' img='./assets/img/Chef.png'/>
            </div>
            <div className='cardBox cardRow-3'>
              <Avatar name='Gordon' content='Ramsay the one and only' img='./assets/img/Rata.png'/>
              <Avatar name='MPW' content='Gordons dad' img='./assets/img/image 15.png'/>
              <Avatar name='Rat' content='IRS Accountant' img='./assets/img/Mouse.png'/>
            </div>
            <div className='cardBox cardMobile-1'>
              <Avatar name='Gordon' content='Ramsay the one and only' img='./assets/img/Rata.png'/>
            </div>
            <div className='cardBox cardMobile-2'>
              <Avatar name='MPW' content='Gordons dad' img='./assets/img/image 15.png'/>
              <Avatar name='Rat' content='IRS Accountant' img='./assets/img/Mouse.png'/>
            </div>
          </div>
      </div>
      <Footer/>
    </>
  );
}