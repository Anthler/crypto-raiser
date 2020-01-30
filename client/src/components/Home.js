
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import FundraiserCard from './FundraiserCard'
import getWeb3 from "../utils/getWeb3";
import FundraiserFactoryContract from "../contracts/FundraiserFactoryContract.json";
import Web3 from 'web3'


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));


const Home = () => {
  const [ contract, setContract] = useState(null)
  const [ accounts, setAccounts ] = useState(null)
  const [ funds, setFunds ] = useState([])
  const web3 =  new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))

  //const web3 =  new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/3baae2e6c67c435689a674e3634cc8b2"))

  useEffect(() => {
    init()
  }, []);

  const init = async () => {
    try {
      const contractAddress = "0x18855016e8aC4f37d9f80639c499746611B5330b";
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundraiserFactoryContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FundraiserFactoryContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const funds = await instance.methods.fundraisers(10, 0).call()
      setContract(instance)
      setAccounts(accounts)
      setFunds(funds)
    }
    catch(error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error.reason);
    }
  }

  const displayFundraisers = () => {
    return funds.map((fundraiser) => {
      return (
        <FundraiserCard
          fundraiser={fundraiser}
          key={fundraiser}
        />
      )
    })
  }

  return (
   <Container>
     <br/>
      <div className="main-container">
      {displayFundraisers()}
    </div>
   </Container>
  )
}

export default Home;
