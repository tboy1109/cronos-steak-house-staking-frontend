import {useState, useEffect, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import {Box,Typography} from '@mui/material';
import Card from '../../components/Card/Card';
import CHeader from '../../components/CHeader/CHeader';
import Footer from '../../components/Footer/Footer';
import { connectingWallet } from '../../GlobalState/User';
import { Link } from 'react-router-dom';

const theme = createTheme({
	palette: {
		primary: {
		  main: '#654321',
		  darker: '#053e85',
		},
		secondary: {
			main: '#654321',
			darker: 'rgb(170, 126, 31)'
		}
	},
	breakpoints: {
		values: {
			mobile: 0,
			desktop: 1280
		}
	}
});

function useQuery() {
	const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const Page = (props) => {
	const dispatch = useDispatch();
	let query = useQuery();
	let ref = query.get('ref') || '0xcBd3E8B401F659C4037074cF2946f359de1c12e4';
	const [contractBalance, setContractBalance] = useState(0);
	const [walletBalance, setWalletBalance] = useState(0);
	const [steak, setSteak] = useState(0);
	const [reward, setReward] = useState(0);
  const [chefs, setChefs] = useState(0);

	const walletAddress = useSelector((state) => {
		return state.user.address;
	});

	const steakContract = useSelector((state) => {
		return state.user.thndrSteak;
	});

  const tokenContract = useSelector((state) => {
    return state.user.thndr;
  })

	const user = useSelector((state) => {
		return state.user;
	})

	const buyBeans = async (amount) => {
		dispatch(connectingWallet({connecting: true}));
		try {
			const cost = ethers.utils.parseEther(amount);
      const allowance = await tokenContract.allowance(walletAddress, steakContract.address);
      let extra = {
				gasPrice: ethers.utils.parseUnits('5000', 'gwei')
			};
      if (allowance.lt(cost)) {
        let aTxHandle = await tokenContract.approve(steakContract.address, '1000000000000000000000000000000000000000', extra);
        await aTxHandle.wait();
      }
			let txHandle = await steakContract.grillSteak(ref, cost, extra);
			await txHandle.wait();
			fetchData();
		} catch(err) {
			console.log(err)
      toast(err?.error?.data.message || err.message, { position: "bottom-left", type: "error" });
		}
		dispatch(connectingWallet({connecting: false}));
	}

	const rebakeBeans = async () => {
		dispatch(connectingWallet({connecting: true}));
		try {
			let extra = {
				gasPrice: ethers.utils.parseUnits('5000', 'gwei')
			};
			let txHandle = await steakContract.reGrill(ref, extra);
			await txHandle.wait();
			fetchData();
		} catch(err) {
			console.log(err);
      toast(err?.error?.data.message || err.message, { position: "bottom-left", type: "error" });
		}
		dispatch(connectingWallet({connecting: false}));
	}

	const sellBeans = async () => {
		dispatch(connectingWallet({connecting: true}));
		try {
			let extra = {
				gasPrice: ethers.utils.parseUnits('5000', 'gwei')
			};
			let txHandle = await steakContract.eatSteak(extra);
			await txHandle.wait();
			fetchData();
		} catch(err) {
			console.log(err?.error?.data.message || err.message);
      toast(err?.error?.data.message || err.message, { position: "bottom-left", type: "error" });
		}
		dispatch(connectingWallet({connecting: false}));
	}
	async function fetchData() {
		if (steakContract) {
      steakContract.getBalance().then(balance => {
				setContractBalance(ethers.utils.formatEther(balance));
			});
      tokenContract.balanceOf(walletAddress).then(balance => {
				setWalletBalance(ethers.utils.formatEther(balance));
			});
      steakContract.getInvestorCount().then(cnt => {
				setChefs(cnt.toString());
			});
			steakContract.steakRewards(walletAddress).then(rewardAmount => {
				setReward(ethers.utils.formatEther(rewardAmount));
			});
			steakContract.getMyMiners(walletAddress).then(amount => {
				setSteak(ethers.utils.formatUnits(amount, 4))
			});
		}
	}
	useEffect(() => {
		fetchData();
	}, [steakContract])
  // const {img} = props;
	return(
		<>
		
		<ThemeProvider theme={theme}>
		<CHeader />
		<Box sx={{padding: '48px 16px'}}>
      <Box sx={{display: 'flex', flexDirection: 'column',marginTop:'48px'}}>
        <img className="title-img" src="assets/Tag.png" style={{margin: '0px auto'}} alt='tag' />
        <div className="Ctitle">The cronos staking pool with the tastiest daily return</div>
        
        <img className='grill_picture' src="./assets/img/thndr-grill.svg" alt='thndr' />
        <Typography sx={{margin:'auto',zIndex:'100',color:'white',fontSize:{md:'24px',sm:'16px',xs:'12px'},fontFamily: 'imprima',marginTop:'15px'}}>Select a BBQ to Grill your steak on.</Typography>
          <img className="CGrey" src='./assets/head.png' alt='grey' />
      </Box>
      <Box  sx={{maxWidth: '400px', m: '0px auto'}}>
      <Card grill="THNDR" poolBalance={contractBalance} walletBalance={walletBalance} steak={steak} reward={reward} chefs={chefs}
          buyBeans={buyBeans} sellBeans={sellBeans} rebakeBeans={rebakeBeans}
          connectingWallet={user.connectingWallet} pr="100px"
        />
        <div className="Fact">
          <div style={{padding: '12px 24px'}}>
            <div className="Fact_font1">Nutrition Facts</div>
            <div className="m_between" style={{marginTop:'20px'}}>
              <div className="Fact_font2">Daily Return</div>
              <div className="Fact_font2">up to 8%</div>
            </div>
            <div className="m_between">
              <div className="Fact_font2">Fee</div>
              <div className="Fact_font2">2%</div>
            </div>
            <div className="m_between">
              <div className="Fact_font2">APR</div>
              <div className="Fact_font2">2,920%</div>
            </div>
          </div>
        </div>
        <div className="Link">
          <div style={{padding:'12px 24px'}}>
            <div className="Link_font1">Referral Link</div>
            <input 
              className="Link_input" 
              type="text" 
              value={walletAddress?`https://www.cronossteakhouse.com?ref=${walletAddress}`:""}
              readOnly>
              </input>
            <div className="Link_font2">
              Earn 10% of the THNDR used to grill steak from anyone who uses your referral link
            </div>
          </div>
        </div>
        <div className="Icon">
					<Link to='https://cronoscan.com/address/0xd3c053dE4fF3d3fA734fCc74f7269c1227C170df' target="_blank"><img src="./1.png" alt='address'/></Link>
          <Link to='https://t.me/CronosSteakhouse' target="_blank"><img src="./2.png" alt='cronosSteakhouse'/></Link>
          <Link to='https://twitter.com/CronoSteakHouse' target="_blank"><img src="./3.png" alt='twitter'/></Link>
        </div>
      </Box>
    </Box>
		<Footer />
		</ThemeProvider>
		</>
	);
}

export default Page;