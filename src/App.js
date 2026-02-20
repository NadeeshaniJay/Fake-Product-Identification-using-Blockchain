import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import VerifyProduct from './components/VerifyProduct';
import AddProduct from './components/AddProduct';
import GetContract from './components/GetContract'
import CentralABI from './abis/Cental_ABI.json';
import config from './config.json';
import DeployContract from './components/DeployContract';

function App() {
  const [provider, setProvider] = useState(null);
  const [central, setCentral] = useState(null);

  const [account, setAccount] = useState(null);

  function showErrorMessage(error) {
    alert(`An error occurred while connecting to MetaMask: ${error.message}  '\n'  'Check if you have metamask wallet installed'`);
  }

  const loadBlockchainData = async () => {
    try{
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      
      const network = await provider.getNetwork();

      const networkConfig = config[network.chainId];
      if (!networkConfig || !networkConfig.central || !networkConfig.central.address) {
        throw new Error(`Central contract is not configured for network chainId ${network.chainId}. Please update src/config.json with your deployed Central address.`);
      }

      if (networkConfig.central.address === '0x0000000000000000000000000000000000000000') {
        throw new Error(`Central contract address is not set for chainId ${network.chainId}. Please update src/config.json with your deployed Central address.`);
      }

      const central = new ethers.Contract(networkConfig.central.address, CentralABI, provider);
      setCentral(central);
    }catch(error){
      console.log(error);
      setCentral(null);
      showErrorMessage(error);
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  // Update contract with signer when account is connected
  useEffect(() => {
    const updateContractWithSigner = async () => {
      if (account && provider) {
        try {
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();

          const networkConfig = config[network.chainId];
          if (!networkConfig || !networkConfig.central || !networkConfig.central.address) {
            throw new Error(`Central contract is not configured for network chainId ${network.chainId}. Please update src/config.json with your deployed Central address.`);
          }

          if (networkConfig.central.address === '0x0000000000000000000000000000000000000000') {
            throw new Error(`Central contract address is not set for chainId ${network.chainId}. Please update src/config.json with your deployed Central address.`);
          }

          const central = new ethers.Contract(networkConfig.central.address, CentralABI, signer);
          setCentral(central);
        } catch (error) {
          setCentral(null);
          console.log(error);
          showErrorMessage(error);
        }
      }
    };

    updateContractWithSigner();
  }, [account, provider])

  return (
    <Router>
      <Navigation account={account} provider={provider} central={central} setAccount={setAccount} />
      <Routes>

        <Route path="/" element={ <Home/> } />
        <Route 
          path="/createcontract" 
          element = {<DeployContract  account={account} provider={provider} central={central} />}
        />
        <Route 
          path="/getcontract" 
          element = {<GetContract  account={account} provider={provider} central={central} />}
        />
        <Route 
          path="/addproduct"  
          element = {<AddProduct account={account} provider={provider} central={central} />}
        />

        <Route 
          path="/verify" 
          element = {<VerifyProduct  account={account} provider={provider} central={central} />}
        />
      </Routes>
    </Router>
  );
}



export default App;