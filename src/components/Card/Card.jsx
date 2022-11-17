import { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import './Card.css';

const MButton = styled(Button)({
	boxShadow: 'rgb(0 0 0 / 59%) 6px 6px 20px 6px',
	fontWeight: 700,
	fontSize: '1.2rem',
	padding: '10px',
	minWidth: '138px',
	background:'#FDAB45',
	borderRadius:'12px',
	fontFamily: 'Inter',
	fontStyle: 'Medium',
	lineHeight: '24px',
	color:'white',
});

const ExGrid = styled(Grid)({
	width: '100%',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginTop: '24px'
});

const ExLabel = styled(Typography)({
	fontSize: '20px',
	fontFamily: 'Montserrat'
});

const ExValue = styled(Typography)({
	fontSize: '24px',
	fontWeight: 500
})


export default function Card1(props){
	const { grill, poolBalance, walletBalance, steak, reward, chefs, connectingWallet, buyBeans, rebakeBeans, sellBeans } = props;
	
  const [amount,setAmount] = useState(0);

	const handleChange = (e) => {
    setAmount(e.target.value);
	}
	
	return(
		<>
			<Card sx={{
				color: 'white',
				boxShadow: 'rgb(0 0 0 / 59%) 6px 6px 20px 6px',
				borderRadius: '20px',
				background: '#800000 !important',
				mb: '24px',
				width:'100%'
			}}>
					{
						connectingWallet &&
						<LinearProgress color='secondary' />
					}
				<CardContent sx={{padding: '12px 24px'}}>
					<ExGrid container>
						<ExLabel variant='body1'>Locked pool</ExLabel>
						<ExValue variant='h5' >{poolBalance? <>{Math.round(poolBalance * 100) / 100} </> : <>0</>} {grill}</ExValue>
					</ExGrid>
					<ExGrid container>
						<ExLabel variant='body1'>Wallet</ExLabel>
						<ExValue variant='h5' >{walletBalance? <>{Math.round(walletBalance * 100) / 100} </> : <>0</>} {grill}</ExValue>
					</ExGrid>
					<ExGrid container>
						<ExLabel variant='body1'>Your Steak</ExLabel>
						<ExValue variant='h5'>{steak} OZ Steak</ExValue>
					</ExGrid>
					{!!chefs && <ExGrid container>
						<ExLabel variant='body1'>Total Chefs</ExLabel>
						<ExValue variant='h5'>{chefs} Chefs</ExValue>
					</ExGrid>}
					<Box sx={{paddingTop: '32px', paddingBottom: '24px'}}>
					
							<Box className='inputBox'>
								<input type="number" min="0"  value={amount} onChange={handleChange} className="in" />
								<Typography
									component={`span`}
								  sx={{
									fontFamily: 'Montserrat',
									lineHeight: 1.5,
									fontSize: '24px',
									fontWeight: 500,
									color: 'black',
									// width:'25%',
									// textAlign:'left'
								}} >{grill}</Typography>
							</Box>
					
						<Box sx={{marginTop: '24px', marginBottom: '24px'}}>
							<MButton  
								width="100%" disabled={(amount === 0?true:false) || (connectingWallet)}
								variant="contained" size='medium' color="primary" fullWidth
								onClick={async (e) => { await buyBeans(amount); setAmount(0);}}
							>Grill Steak</MButton>
						</Box>
						<Divider />
						{/* <ExGrid container>
							<Typography variant='body1' sx={{fontWeight: 'bolder'}}>Time until dinner</Typography>
							<Typography variant='h5' sx={{fontWeight: 'bolder'}}> 6d 23h 59m</Typography>
						</ExGrid> */}
						<ExGrid container>
							<Typography variant='body1' sx={{fontWeight: 'bolder'}}>Your Rewards</Typography>
							<Typography variant='h5' sx={{fontWeight: 'bolder'}}>{reward? <>{Math.round(reward * 1000) / 1000} </> : <>0</>} {grill}</Typography>
						</ExGrid>
						<Grid container sx={{justifyContent: 'space-between', flexFlow: 'row wrap'}}>
							<Grid item sx={{margin: '24px 8px 0px 0px', flexGrow: 1}}>
								<MButton onClick={rebakeBeans} disabled={connectingWallet}
									variant="contained" size='medium'  fullWidth
								>Season</MButton>
							</Grid>
							<Grid item sx={{margin: '24px 0px 0px 8px', flexGrow: 1}}>
								<MButton onClick={sellBeans} disabled={connectingWallet}
									variant="contained" size='medium'  fullWidth
								>Serve dinner</MButton>
							</Grid>
						</Grid>
					</Box>
				</CardContent>
			</Card>
		</>

	);
}