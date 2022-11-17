import { memo, useEffect} from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import MetaMaskOnboarding from '@metamask/onboarding';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import {
	connectAccount,
	onLogout,
	setShowWrongChainModal,
	chainConnect,
} from '../../GlobalState/User';

const MButton = styled(Button)({
	// backgroundColor: 'rgb(23, 33, 94)',
	boxShadow: 'rgb(0 0 0 / 59%) 6px 6px 20px 6px',
	fontWeight: 400,
	fontSize: '1.2rem',
	padding: '10px',
	minWidth: '138px',
	borderRadius: '8px',
	color: 'white'
});

const WalletConnectButton = (props) => {
	const dispatch = useDispatch();

	const walletAddress = useSelector((state) => {
		return state.user.address;
	});

	const correctChain = useSelector((state) => {
		return state.user.correctChain;
	});
	const user = useSelector((state) => {
		return state.user;
	});
	const needsOnboard = useSelector((state) => {
		return state.user.needsOnboard;
	});

	const logout = async () => {
		dispatch(onLogout());
	}

	const connectWalletPressed = async () => {
    if (needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else {
      dispatch(connectAccount());
    }
  };

	useEffect(() => {
    let defiLink = localStorage.getItem('DeFiLink_session_storage_extension');
    if (defiLink) {
      try {
        const json = JSON.parse(defiLink);
        if (!json.connected) {
          dispatch(onLogout());
        }
      } catch (error) {
        dispatch(onLogout());
      }
    }
    if (
      localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER') ||
      window.ethereum ||
      localStorage.getItem('DeFiLink_session_storage_extension')
    ) {
      if (!user.provider) {
        if (window.navigator.userAgent.includes("Crypto.com DeFiWallet")) {
          dispatch(connectAccount(false, "defi"));
        } else {
          dispatch(connectAccount());
        }
      }
    }
    if (!user.provider) {
      if (window.navigator.userAgent.includes("Crypto.com DeFiWallet")) {
        dispatch(connectAccount(false, "defi"));
      }
    }

    // eslint-disable-next-line
  }, []);

  const onWrongChainModalClose = () => {
    dispatch(setShowWrongChainModal(false));
  };

  const onWrongChainModalChangeChain = () => {
    dispatch(setShowWrongChainModal(false));
    dispatch(chainConnect());
  };

	return(
		<div>
			{!walletAddress && (
				<MButton onClick={connectWalletPressed} {...props}>Connect</MButton>
			)}
			{walletAddress && !correctChain && !user.showWrongChainModal && (
				<MButton onClick={onWrongChainModalChangeChain} {...props}>Switch network</MButton>
			)}
			{walletAddress && correctChain && (
				<MButton onClick={logout} {...props}>Disconnect</MButton>
			)}

			<Modal show={user.showWrongChainModal} onHide={onWrongChainModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>Wrong network</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					To continue, you need to switch the network to <span style={{ fontWeight: 'bold' }}>Chain</span>.{' '}
				</Modal.Body>
				<Modal.Footer>
					<button className="p-4 pt-2 pb-2 btn_menu inline white lead" onClick={onWrongChainModalClose}>
						Close
					</button>
					<button
						className="p-4 pt-2 pb-2 btn_menu inline white lead btn-outline"
						onClick={onWrongChainModalChangeChain}
					>
						Switch
					</button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
export default memo(WalletConnectButton);