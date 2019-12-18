import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import getWeb3 from "../getWeb3";
import FundraiserFactoryContract from "../contracts/FundraiserFactoryContract.json";
import Web3 from "web3";

const useStyles = makeStyles( theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        dense: {
            marginTop: theme.spacing(2),
        },
        menu: {
            width: 200,
        },
        button:{
            margin:theme.spacing(1)
        },
        input: {
            display: 'none',
        },
}));

const NewFundraiser = () => {

    const [ web3, setWeb3 ] = useState(null)

    const [ name, setFundraiserName ] = useState(null)
    const [website, setFundraiserWebsite] = useState(null);
    const [ description, setFundraiserDescription] = useState(null);
    const [ image, setFundraiserImage] = useState(null);
    const [ address, setAddress] = useState(null);
    const [ custodian, setCustodian] = useState(null);
    const [ contract, setContract] = useState(null);
    const [ accounts, setAccounts] = useState(null);
    

    useEffect(() => {
        const init = async () => {
            try {
              const web3 = await getWeb3();
              const accounts = await web3.eth.getAccounts();
              const networkId = await web3.eth.net.getId();
    
              const deployedNetwork = FundraiserFactoryContract.networks[networkId];
    
              const instance = new web3.eth.Contract(
                  FundraiserFactoryContract.abi, 
                  deployedNetwork && deployedNetwork.address,
                );

              setWeb3(web3)
              setContract(instance)
              setAccounts(accounts)
    
              } catch(error) {
    
              alert( `Failed to load web3, accounts, or contract. Check console for details.`,)
              console.error(error);
          }
      }
    init();
    }, []);

    const classes = useStyles();

    const handleSubmit = async () => {

        const imageURL = image
        const url = website
        const beneficiary = address
        //const currentUser = await web3.currentProvider.selectedAddress

         await contract.methods.createFundraiser(
            beneficiary,
            name,
            imageURL,
            url,
            description
        ).send({from: accounts[0]})
        alert('Successfully created fundraiser');
    }

    return(
        <div>
            <h2> New Fundraiser</h2>

            <label>Name</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Name"
                margin="normal"
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }}
                onChange={ (e) => setFundraiserName(e.target.value)}
            />

            <label>Website</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Name"
                margin="normal"
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }}
                onChange={ (e) => setFundraiserWebsite(e.target.value)}
            />

            <label>Website</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Name"
                margin="normal"
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }}
                onChange={ (e) => setFundraiserDescription(e.target.value)}
            />

            <label>Image</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Image"
                margin="normal"
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }}
                onChange={ (e) => setFundraiserImage(e.target.value)}
            />

            <label>Address</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Address"
                margin="normal"
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }}
                onChange={ (e) => setAddress(e.target.value)}
            />

            <label>Custodian</label>
            <TextField
                id="outlined-bare"
                className={classes.textField}
                placeholder="Fundraiser Address"
                margin="normal"
                variant="outlined"
                inputProps={{ 'aria-label': 'bare' }}
                onChange={ (e) => setCustodian(e.target.value)}
            />

            <Button
                onClick={handleSubmit}
                variant="contained"
                className={classes.button}>
                Submit
            </Button>
        </div>
    );
}


export default NewFundraiser;