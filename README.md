# What does your project do?

Crypto Raiser dapp, allows people and organizations to raise funds after some  disasater or for other financial needs. 

# How it works

1. A user navigates to our dapp url and create a new fundraising campaign contract by providing title, description, beneficiary address.

2. Donors can make donations by selecting the campaign the would like to choose from.

3. Donors can enter the ether amount they wish to donate in USD.

4. Once the fundraising campaign reaches the target, the creator can withdraw the funds recieved into the beneficiary address.


## Project Setup
> Alert: only techies are allowed after this point

To setup this project in a local environment you need to have:
- Node v10.19.0
- npm
- Truffle 
- git
- Metamask extension

To play with this project you have the following networks and two front-end servers to choose from:
-	Local development network with front-end served by a local server
-	Rinkeby network with front-end served by a local server
-	Rinkeby network with front-end served by netlify

 The logical order is to setup the network -> connect Metamask -> serve client 
1.	Local development network:
```sh
        $ git clone https://github.com/Anthler/crypto-raiser.git
        $ cd chained-bounties
        $ npm install
        $ truffle develop
        $ compile
        $ migrate
        $ test
        Connect Metamask to a funded account on the localhost network
```
2.	**Rinkeby** network: 
```
        Just connect Metamask to a funded account on the Rinkeby network
```
3.	Front-end served by a local server:
```sh
        $ cd client
        $ npm install
        $ npm start
```

>Note on networks: As mentioned the contract is deployed on Rinkeby, so if you also setup your local network with truffle develop like above, it's all up to Metamask on which network you are interacting with.

**Ropsten** Contract is also deployed on Ropsten testnet, you can play with it using Remix IDE. Check the deployment address at deployed_addresses.txt.