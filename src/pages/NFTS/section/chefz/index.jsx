import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { Stack, Button, Slider, FormControl, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import WalletConnectButton from '../../../../components/Button/WalletConnectButton';
import { connectingWallet } from '../../../../GlobalState/User';
import '../style/chefz.css';
import config from '../../../../Config/config.json';
import abi from '../../../../Contracts/SteakDAO.json';

const tokenAddresses = {
  mmf: '0x97749c9B61F878a880DfE312d2594AE07AEd7656',
  svn: '0x654bAc3eC77d6dB497892478f854cF6e8245DcA9',
  usdc: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
  lion: '0x49fB98F9b4a3183Cd88e7a115144fdf00fa6fB95',
  weth: '0xe44Fd7fCb2b1581822D0c862B68222998a0c299a'
};


const tokenMintPrice = {
  mmf: 1000,
  svn: 1000,
  usdc: 30,
  lion: 1200,
  weth: 0.02
};

const menuItemStyle = {
  width:'150px',
  height:'58px',
  marginTop:'2px',
  background: '#D87370',
  border: '5px solid #000000',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '22px',
  color: '#EBC894',
  textAlign:'left !important',
  textShadow: '2px 0 black, -2px 0 black, 0 2px black, 0 -2px black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black',
}

const CustomMenuItem = styled(MenuItem)({
  '&:hover':{
    background:'white'
  },
  width:'150px',
  height:'58px',
  marginTop:'2px',
  background: '#D87370',
  border: '5px solid #000000',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '22px',
  color: '#EBC894',
  textAlign:'left !important',
  textShadow: '2px 0 black, -2px 0 black, 0 2px black, 0 -2px black, 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black',
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
    backgroundColor: '#D87370',
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

const Chefz = () => {

  const dispatch = useDispatch();

  const [coin, setCoin] = useState('cro');
  const [value, setValue] = useState(1);
  const [totalSupply, setTotalSupply] = useState('0');
  const [mintValue, setMintValue] = useState('0');
  const [whitelisted, setWhitelisted] = useState(false);
  const [mintPrice, setMintPrice] = useState(200);

  useEffect(() => {
    if (coin === 'cro') 
      setMintPrice(mintValue);
    else
      setMintPrice(tokenMintPrice[coin]);
  }, [mintValue, coin])

  const walletAddress = useSelector((state) => {
		return state.user.address;
	});

  const tokenContracts = useSelector(state => {
    return {
      svn: state.user.svn,
      mmf: state.user.mmf,
      usdc: state.user.usdc,
      lion: state.user.lion,
      weth: state.user.weth
    };
  })

	const correctChain = useSelector((state) => {
		return state.user.correctChain;
	});

  const steakDaoContract = useSelector((state) => {
		return state.user.steakDao;
	});

  const handleChange = (event) => {
    setCoin(event.target.value);
    console.log('event: ', event.target.value);
  };

  const handleMint = async () => {
    dispatch(connectingWallet({connecting: true}));
    try {
      if (coin === 'cro') {
        const cost = ethers.utils.parseEther((mintPrice * value).toString());
        const extra = {
          value: cost
        }
        let txHandle = await steakDaoContract.mintWithCRO(value, extra);
        await txHandle.wait();
      } else {
        console.log('address: ', tokenAddresses[coin], coin)
        const decimal = await tokenContracts[coin].decimals();
        const totalCost = ethers.utils.parseUnits((mintPrice*value).toString(), decimal);
        const allowance = await tokenContracts[coin].allowance(walletAddress, steakDaoContract.address);
        if (allowance.lt(totalCost)) {
          let txHandle = await tokenContracts[coin].approve(steakDaoContract.address, '1000000000000000000000000');
          await txHandle.wait();
        }
        let txHandle = await steakDaoContract.mintWithToken(value, tokenAddresses[coin]);
        await txHandle.wait();
      }

      fetchData();
      toast("Mint Success!", { position: "bottom-left", type: "success" });
    } catch (err) {
      toast(err?.error?.data.message || err.message, { position: "bottom-left", type: "error" });
      console.log(err);
    }
    
    dispatch(connectingWallet({connecting: false}));
  };

  const handleSlider = (event, newValue) => {  
    setValue(newValue);
  }

  const fetchData = async () => {
    try{
      let readSteakDaoContract = new ethers.Contract(config.mint_contract,abi.abi,readProvider);
      readSteakDaoContract.totalSupply().then((val) => {
        console.log("supply:::",val);
        setTotalSupply(val.toString());
      })
      if (steakDaoContract) {
        steakDaoContract.mintCost(walletAddress).then((val) => {
          console.log("mintVal:::",val);
          setMintValue(Math.round(ethers.utils.formatEther(val)));
        });
        steakDaoContract.whitelisted(walletAddress).then(val => {
          setWhitelisted(val);
        });
      }
    }
    catch(err){
      toast(err?.error?.data.message || err.message, { position: "bottom-left", type: "error" });
    }
  }


  useEffect(() => {
    fetchData();
  },[steakDaoContract])

  return(
    <>
      <div className='chefz'>
        <div className='chefz-left'>
          <div className='chefz-title'>Chefz</div>
          <div className='mint-info'>
            <div className="title">A Collection of 2500 PFP NFT’s, Chefz are the hottest JPEGs to hit the Cronos Chain. From boosting grills to staking for tokens, its all here! With our partner support allocation youre not only getting a Chefz when you mint, but supporting the #crofam too! So what are you waiting for? Mint one today!</div>

            <div className="title" style={{marginTop:'30px'}}>You can choose to mint in CRO, USDC, WETH, LION, MMF and SVN.</div>
            <div className='info-row'>
              <div className="info shadow stroke">Price in Tokens = {mintPrice * value}</div>
              <div className="info shadow stroke">{totalSupply}/2500 minted</div>
              <div className="info shadow stroke">WL - Yes / No</div>
            </div>
          </div>
          <Stack direction='row' justifyContent='center'>
            <WalletConnectButton  variant="contained" size='medium' 
                sx={{
                  background:'#FDAB45',
                  borderRadius:'12px',
                  fontFamily: 'Inter',
                  fontStyle: 'Medium',
                  fontSize: {md:'20px',xs:'15px'},
                  lineHeight: '24px',
                  margin: '0 auto',
                  marginTop:'30px',
                  color:'#882100',
                  fontWeight:'900',
                  width:'200px !important',
                  '&:hover':{
                    background:'white'
                  }
              }}/>
          </Stack>

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

          <div className='select-coin'>
            <div className='select-title'>Select coin to mint in</div>
            <FormControl >
              <Select
                sx={menuItemStyle}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={coin}
                onChange={handleChange}
                // IconComponent={() => <MenuIcon />}
              >
                <CustomMenuItem  value={'cro'}>CRO</CustomMenuItem>
                <CustomMenuItem  value={'usdc'}>USDC</CustomMenuItem>
                <CustomMenuItem  value={'weth'}>WETH</CustomMenuItem>
                <CustomMenuItem  value={'lion'}>LION</CustomMenuItem>
                <CustomMenuItem  value={'mmf'}>MMF</CustomMenuItem>
                <CustomMenuItem  value={'svn'}>SVN</CustomMenuItem>
              </Select>
            </FormControl>
            {
              (walletAddress && correctChain) && <Button className='mint-title' onClick={handleMint}>Mint</Button>
            }
          </div>
          
        </div>
        <div className="chefz-right">
          <Stack direction='column' spacing={3} alignItems='center'>
            <img src='./assets/img/Steakhouse_Grill_Fixed 1.png' alt='steakhouse'/>
            <img src='./assets/img/flamin 1.png' alt='flamin'/>
            <img src='./assets/img/teaser 1.png' alt='teaser'/>
          </Stack>
        </div>
      </div>
    </>
  );
}

export default Chefz