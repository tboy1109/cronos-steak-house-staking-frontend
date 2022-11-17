import { createSlice } from '@reduxjs/toolkit';
import { Contract, ethers, BigNumber } from 'ethers';
import Web3Modal from 'web3modal';
import detectEthereumProvider from '@metamask/detect-provider';
import { DeFiWeb3Connector } from 'deficonnect';
import WalletConnectProvider from '@walletconnect/web3-provider';
import * as DefiWalletConnectProvider from '@deficonnect/web3-provider';
import { appAuthInitFinished } from './InitSlice';
import { captureException } from '@sentry/react';
import doge from '../Config/dogechain.json';
import config from '../Config/config.json';
import SteakABI from '../Contracts/Steak.json';
import CROSteakABI from '../Contracts/CROSteak.json';
import LotterySteakABI from '../Contracts/LotterySteak.json';
import MMFSteakABI from '../Contracts/MMFSteak.json';
import NewSteakABI from '../Contracts/NewSteak.json';
import ERC20ABI from '../Contracts/ERC20.json';
import STEAKDAOABI from '../Contracts/SteakDAO.json';
import polygon from '../Config/polygon.json';

let chainInfo;
const userSlice = createSlice({
  name: 'user',
  initialState: {
    // Wallet
    provider: null,
    address: null,
    web3modal: null,
    connectingWallet: false,
    gettingContractData: true,
    needsOnboard: false,

    // Contracts
    usdcSteak: null,
    croSteak: null,
    mmfSteak: null,
    usdc: null,
    steakDao: null,
    correctChain: false,
    showWrongChainModal: false,
  },
  reducers: {
    accountChanged(state, action) {
      state.balance = action.payload.balance;
      state.usdcSteak = action.payload.usdcSteak;
      state.croSteak = action.payload.croSteak;
      state.mmfSteak = action.payload.mmfSteak;
      state.svnSteak = action.payload.svnSteak;
      state.lotterySteak = action.payload.lotterySteak;
      state.thndrSteak = action.payload.thndrSteak;
      state.vvsSteak = action.payload.vvsSteak;
      state.lionSteak = action.payload.lionSteak;
      state.crogeSteak = action.payload.crogeSteak;
      state.tectonicSteak = action.payload.tectonicSteak;
      state.usdc = action.payload.usdc;
      state.svn = action.payload.svn;
      state.mmf = action.payload.mmf;
      state.lion = action.payload.lion;
      state.weth = action.payload.weth;
      state.thndr = action.payload.thndr;
      state.vvs = action.payload.vvs;
      state.tectonic = action.payload.tectonic;
      state.croge = action.payload.croge;
      state.steakDao = action.payload.steakDao;
    },

    onCorrectChain(state, action) {
      state.correctChain = action.payload.correctChain;
    },

    onProvider(state, action) {
      state.provider = action.payload.provider;
      state.needsOnboard = action.payload.needsOnboard;
      state.correctChain = action.payload.correctChain;
    },

    onBasicAccountData(state, action) {
      state.address = action.payload.address;
      state.provider = action.payload.provider;
      state.web3modal = action.payload.web3modal;
      state.correctChain = action.payload.correctChain;
      state.needsOnboard = action.payload.needsOnboard;
    },

    connectingWallet(state, action) {
      state.connectingWallet = action.payload.connecting;
    },
    
    setShowWrongChainModal(state, action) {
      state.showWrongChainModal = action.payload;
    },
    onLogout(state) {
      state.connectingWallet = false;
      const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions: [], // required
      });
      web3Modal.clearCachedProvider();
      if (state.web3modal != null) {
        state.web3modal.clearCachedProvider();
      }
      state.web3modal = null;
      state.provider = null;
      localStorage.clear();
      state.address = '';
      state.balance = null;
    },
    balanceUpdated(state, action) {
      state.balance = action.payload;
    },
  },
});

export const {
  accountChanged,
  onProvider,
  connectingWallet,
  onCorrectChain,
  setShowWrongChainModal,
  onBasicAccountData,
  onLogout,
} = userSlice.actions;
export const user = userSlice.reducer;

export const connectAccount =
  (firstRun=false, type = "") =>
  async (dispatch) => {
    console.log("currentlyPath:::", window.location.pathname);
    const currentlyPath = window.location.pathname;
  
    if(currentlyPath === '/Doge'){
      chainInfo = doge;
    }else if(currentlyPath === '/POLY'){
      chainInfo = polygon;
    }else{
      chainInfo = config;
    }
    console.log("chainInfo:::", chainInfo)
    const providerOptions = {
      injected: {
        display: {
          logo: 'https://github.com/MetaMask/brand-resources/raw/master/SVG/metamask-fox.svg',
          name: 'MetaMask',
          description: 'Connect with MetaMask in your browser',
        },
        package: null,
      },
      // 'custom-defiwallet': {
      //   display: {
      //     logo: '/assets/cdc_logo.svg',
      //     name: 'Crypto.com DeFi Wallet',
      //     description: 'Connect with the CDC DeFi Wallet',
      //   },
      //   options: {},
      //   package: DefiWalletConnectProvider,
      //   connector: async (ProviderPackage, options) => {
      //     const connector = new DeFiWeb3Connector({
      //       supportedChainIds: [25, 338],
      //       rpc: { 25: 'https://gateway.nebkas.ro', 338: 'https://cronos-testnet-3.crypto.org:8545/' },
      //       pollingInterval: 15000,
      //       metadata: {
      //         icons: ['https://ebisusbay.com/vector%20-%20face.svg'],
      //         description: 'Cronos NFT Marketplace',
      //       },
      //     });

      //     await connector.activate();
      //     let provider = await connector.getProvider();
      //     return provider;
      //   },
      // },
    };

    if (type !== "defi") {
      providerOptions.walletconnect = {
        package: WalletConnectProvider, // required
        options: {
            chainId: 25,
            // chainId: 338,
            rpc: {
                25: "https://gateway.nebkas.ro",
                338: "https://cronos-testnet-3.crypto.org:8545/"
            },
            network: 'cronos',
            metadata: {
                icons: ["https://ebisusbay.com/vector%20-%20face.svg"],
                description: "Steakhouse"
                }
            }
          }
    }

    const web3ModalWillShowUp = !localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');

    if (process.env.NODE_ENV !== 'production') {
      console.log('web3ModalWillShowUp: ', web3ModalWillShowUp);
    }

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });

    const web3provider = await web3Modal
      .connect()
      .then((web3provider) => web3provider)
      .catch((error) => {
        captureException(error, { extra: { firstRun } });
        console.log('Could not get a wallet connection', error);
        return null;
      });

    if (!web3provider) {
      dispatch(onLogout());
      return;
    }

    try {
      dispatch(connectingWallet({ connecting: true }));
      const provider = new ethers.providers.Web3Provider(web3provider);

      const cid = await web3provider.request({
        method: 'net_version',
      });
      console.log('cid: ', cid, chainInfo.chain_id)
      const correctChain = cid === chainInfo.chain_id || cid === Number(chainInfo.chain_id);

      const accounts = await web3provider.request({
        method: 'eth_accounts',
        params: [{ chainId: cid }],
      });

      const address = accounts[0];
      const signer = provider.getSigner();

      if (!correctChain) {
        if (firstRun) {
          dispatch(appAuthInitFinished());
        }
        await dispatch(setShowWrongChainModal(true));
      }

      
      await dispatch(
        onBasicAccountData({
          address: address,
          provider: provider,
          web3modal: web3Modal,
          needsOnboard: false,
          correctChain: correctChain,        
        })
      );
      if (firstRun) {
        dispatch(appAuthInitFinished());
      }
      web3provider.on('DeFiConnectorDeactivate', (error) => {
        dispatch(onLogout());
      });

      web3provider.on('disconnect', (error) => {
        dispatch(onLogout());
      });

      web3provider.on('accountsChanged', (accounts) => {
        dispatch(onLogout());
        dispatch(connectAccount());
      });

      web3provider.on('DeFiConnectorUpdate', (accounts) => {
        window.location.reload();
      });

      web3provider.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.

        window.location.reload();
      });

      let cro_steak;
      let usdc_steak;
      let mmf_steak;
      let svn_steak;
      let croge_steak;
      let thndr_steak;
      let lion_steak;
      let lottery_steak;
      let vvs_steak;
      let tectonic_steak;
      let usdc;
      let svn;
      let mmf;
      let thndr;
      let croge;
      let tectonic;
      let vvs;
      let lion;
      let weth;
      let balance;
      let steakDao;
      
      if (signer && correctChain) {
        cro_steak = new Contract(config.cro_steak_contract, CROSteakABI.abi, signer);
        usdc_steak = new Contract(config.usdc_steak_contract, SteakABI.abi, signer);
        mmf_steak = new Contract(config.mmf_steak_contract, MMFSteakABI.abi, signer);
        svn_steak = new Contract(config.svn_steak_contract, MMFSteakABI.abi, signer);
        lottery_steak = new Contract(config.lottery_steak_contract, LotterySteakABI.abi, signer);
        thndr_steak = new Contract(config.thndr_steak_contract, MMFSteakABI.abi, signer);
        croge_steak = new Contract(config.croge_steak_contract, NewSteakABI.abi, signer);
        tectonic_steak = new Contract(config.tectonic_steak_contract, NewSteakABI.abi, signer);
        vvs_steak = new Contract(config.vvs_steak_contract, NewSteakABI.abi, signer);
        lion_steak = new Contract(config.lion_steak_contract, NewSteakABI.abi, signer);
        usdc = new Contract(config.usdc_contract, ERC20ABI.abi, signer);
        svn = new Contract(config.svn_contract, ERC20ABI.abi, signer);
        mmf = new Contract(config.mmf_contract, ERC20ABI.abi, signer);
        lion = new Contract(config.lion_contract, ERC20ABI.abi, signer);
        weth = new Contract(config.weth_contract, ERC20ABI.abi, signer);
        thndr = new Contract(config.thndr_contract, ERC20ABI.abi, signer);
        vvs = new Contract(config.vvs_contract, ERC20ABI.abi, signer);
        croge = new Contract(config.croge_contract, ERC20ABI.abi, signer);
        tectonic = new Contract(config.tectonic_contract, ERC20ABI.abi, signer);
        steakDao = new Contract(config.mint_contract, STEAKDAOABI.abi, signer);
        
        try {
          balance = ethers.utils.formatEther(await provider.getBalance(address));
        } catch (error) {
          console.log('Error checking CRO balance', error);
        }
      }

      await dispatch(
        accountChanged({
          address: address,
          provider: provider,
          web3modal: web3Modal,
          needsOnboard: false,
          correctChain: correctChain,
          usdcSteak: usdc_steak,
          croSteak: cro_steak,
          mmfSteak: mmf_steak,
          svnSteak: svn_steak,
          lotterySteak: lottery_steak,
          thndrSteak: thndr_steak,
          tectonicSteak: tectonic_steak,
          vvsSteak: vvs_steak,
          lionSteak: lion_steak,
          crogeSteak: croge_steak,
          vvs: vvs,
          usdc: usdc,
          svn: svn,
          mmf: mmf,
          thndr: thndr,
          tectonic: tectonic,
          croge: croge,
          lion: lion,
          weth: weth,
          balance: balance,
          steakDao: steakDao,
        })
      );
    } catch (error) {
      captureException(error, {
        extra: {
          firstRun,
          WEB3_CONNECT_CACHED_PROVIDER: localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER'),
          DeFiLink_session_storage_extension: localStorage.getItem('DeFiLink_session_storage_extension'),
        },
      });
      if (firstRun) {
        dispatch(appAuthInitFinished());
      }
      console.log(error);
      console.log('Error connecting wallet!');
      await web3Modal.clearCachedProvider();
      dispatch(onLogout());
    }
    dispatch(connectingWallet({ connecting: false }));
  };

export const initProvider = () => async (dispatch) => {
  const ethereum = await detectEthereumProvider();

  if (ethereum == null || ethereum !== window.ethereum) {
    console.log('not metamask detected');
  } else {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const cid = await ethereum.request({
      method: 'net_version',
    });

    const correctChain = cid === chainInfo.chain_id;

    let mc;
    if (signer && correctChain) {
      mc = new Contract(chainInfo.steak_contract, SteakABI.abi, signer);
    }
    // const obj = {
    //   provider: provider,
    //   needsOnboard: false,
    //   membershipContract: mc,
    //   correctChain: correctChain,
    // };

    //dispatch(onProvider(obj))

    provider.on('accountsChanged', (accounts) => {
      dispatch(
        accountChanged({
          address: accounts[0],
        })
      );
    });

    provider.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.

      window.location.reload();
    });
  }
};

export const chainConnect = (type) => async (dispatch) => {
  if (window.ethereum) {
    const cid = ethers.utils.hexValue(BigNumber.from(chainInfo.chain_id));
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: cid }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: chainInfo.name,
                chainId: cid,
                rpcUrls: [chainInfo.write_rpc],
                blockExplorerUrls: null,
                nativeCurrency: {
                  name: chainInfo.name,
                  symbol: chainInfo.symbol,
                  decimals: 18,
                },
              },
            ],
          });
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: cid }],
          });
        } catch (addError) {
          console.error(addError);
          window.location.reload();
        }
      }
      console.log(error);
    }
  } else {
    const web3Provider = new WalletConnectProvider({
      rpc: {
        25: 'https://evm.cronos.org/',
      },
      chainId: 25,
    });
  }
};

export const updateBalance = () => async (dispatch, getState) => {
  const { user } = getState();
  const { address, provider } = user;
  const balance = ethers.utils.formatEther(await provider.getBalance(address));
  dispatch(userSlice.actions.balanceUpdated(balance));
};