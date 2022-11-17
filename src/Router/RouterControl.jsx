
import * as React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from '../pages/Homepage/Homepage';
import NFTS from '../pages/NFTS';
import MMF from '../pages/MMF/MMF';
import CRO from '../pages/CRO/CRO';
import Lottery from '../pages/Lottery/Lottery';
import USDC from '../pages/USDC/USDC';
import SVN from '../pages/SVN/SVN';
import CROGE from '../pages/CROGE/CROGE';
import THNDR from '../pages/THNDR/THNDR';
import VVS from '../pages/VVS/VVS';
import TONIC from '../pages/TONIC/TONIC';
import LION from '../pages/LION/LION';
import DOGE from '../pages/DOGE/DOGE';
import POLY from '../pages/POLY/POLY';

const RouterControl = () => {
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Homepage/>} />
				<Route path='NFTS' element={<NFTS/>} />
				<Route path='MMF' element={<MMF/>} />
				<Route path='CRO' element={<CRO/>} />
				<Route path='USDC' element={<USDC/>} />
				<Route path='SVN' element={<SVN/>} />
				<Route path='Lottery' element={<Lottery/>} />
				<Route path='CROGE' element={<CROGE/>} />
				<Route path='THNDR' element={<THNDR/>} />
				<Route path='VVS' element={<VVS/>} />
				<Route path='TONIC' element={<TONIC/>} />
				<Route path='LION' element={<LION/>} />
				<Route path='Doge' element={<DOGE/>} />
				<Route path='POLY' element={<POLY/>} />
			</Routes>
		</BrowserRouter>
	);
}
export default RouterControl;