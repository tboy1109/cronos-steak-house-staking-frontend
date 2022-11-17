
import {useState} from 'react';
import { Typography, Box, Stack, Button, Slider } from '@mui/material';
import {styled} from '@mui/material/styles';
import { TabPane } from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { connectingWallet } from '../../GlobalState/User';
import WalletConnectButton from '../button/WalletConnectButton';
import style from './Mint.module.css';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import config from '../../Config/config.json';
import abi from '../../Contracts/SteakDAO.json';
const MintButton = styled(Button)({
  background:'#FDAB45',
  borderRadius:'12px',
  fontFamily: 'Inter',
  fontStyle: 'Medium',
  fontSize: '34px',
  lineHeight: '24px',
  color:'#882100',
  fontWeight:'900',
  padding:'6px 10px',
  minWidth:'150px',
  '&:hover':{
    background:'#FDAB45'
  }
})

const PrettoSlider = styled(Slider)({
  color: '#FDAB45',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
const Mint = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(1);
  const [mintValue, setMintValue] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');

  
  const walletAddress = useSelector((state) => {
		return state.user.address;
	});
  const steakDaoContract = useSelector((state) => {
		return state.user.steakDao;
	});

  const handleSlider = (event, newValue) => {
    
    setValue(newValue);
    fetchData();
    console.log("steakDaoContract:::",steakDaoContract);
  }
  
  const fetchData = async () => {
    try{
       
        let readSteakDaoContract = new ethers.Contract(config.mint_contract,abi.abi,readProvider);
        readSteakDaoContract.totalSupply().then((val) => {
        console.log("supply:::",val);
        setTotalSupply(val);
      })
      if (steakDaoContract) {
        steakDaoContract.mintCost(walletAddress).then((val) => {
          console.log("mintVal:::",val);
          setMintValue(ethers.utils.formatEther(val));
       })
      }
    }
    catch(err){
      toast(err?.error?.data.message || err.message, { position: "bottom-left", type: "error" });
    }
  }


  useEffect(() => {
    fetchData();
  },[steakDaoContract])


  const mint = async () => {
    dispatch(connectingWallet({connecting: true}));
    try{
      if( steakDaoContract && walletAddress){
        const totalCost = value * mintValue;
        const cost = ethers.utils.parseEther(totalCost.toString());
        let extra = {
          value: cost,
          gasPrice: ethers.utils.parseUnits('5000', 'gwei')
        };
        let txHandle = await steakDaoContract.mint(value, extra);
			  await txHandle.wait();
			  // await txHandle.wait();
        fetchData();
        toast("Mint Success!", { position: "bottom-left", type: "success" });
      }
    }
    catch(err){
      toast(err?.error?.data.message || err.message, { position: "bottom-left", type: "error" });
      console.log(err);
    }
    dispatch(connectingWallet({connecting: false}));
  }
  return(
    <>
      <Box className={style.container}>
        <Box className={style.introduce}>
          <Typography className={style.fir_text}>Introducing La Brigage de Cuisine</Typography>
          <Typography className={style.fir_text}>Steakhouse DAO</Typography>
        </Box>
        <Box className={style.main}>
          <Box className={style.left}>
            <Stack direction='row' alignItems='center' spacing={1} >
              <Typography className={style.sec_text}>{Math.round(totalSupply)} /</Typography>
              <Typography className={style.sec_text}>200</Typography>
              <Typography className={style.sec_text}>minted</Typography>
            </Stack>
            <img src='./assets/mark.png' className={style.mark}></img>
          </Box>
          <Box className={style.right}>
            <Box sx={{marginTop:'70px'}}>
              <Typography className={style.thi_text}>
              <span style={{fontSize:'13px',marginRight:'10px'}}>&#9679;</span>
                All profits go to the DAO
              </Typography>
              <Typography className={style.thi_text}>
                <span style={{fontSize:'13px',marginRight:'10px'}}>&#9679;</span>
                Take control of the flames</Typography>
              <Typography className={style.thi_text}>
              <span style={{fontSize:'13px',marginRight:'10px'}}>&#9679;</span>
                For the community, by the community
              </Typography>
            </Box>
            <Typography sx={{marginTop:'30px'}} className={style.thi_text}>Every professional kitchen works under a distinct set of rules, also known as la brigade de cuisine. First developed 100 years ago, but in 2022, the Master Chefs of the Steakhouse are taking this system to the next level and turning it into a DAO.</Typography>
            {
              !walletAddress ? 
              <WalletConnectButton variant="contained" sx={{marginTop:'30px',background:'#FDAB45'}}/>
              :
                <Box>
                  <PrettoSlider
                    value={value}
                    onChange={handleSlider}
                    sx={{marginTop:'25px'}}
                    min={1}
                    max={5}
                    step={1}
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    defaultValue={1}
                  />
                  
                  <Stack sx={{marginTop:'25px'}} direction={{xs:'column',sm:'row'}} spacing={3} alignItems='center' justifyContent='center'>
                    <MintButton onClick={mint} sx={{fontSize:{xs:'20px',md:'30px'}}}>MINT NOW</MintButton>
                    <Typography className={style.fir_text}>{Math.round(mintValue*value)} CRO</Typography>
                  </Stack>
                </Box>
              }
            
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default  Mint;