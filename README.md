What does your project do?

My fundraiser Dapp, allows people and organizations to raise funds after some  disasater or for other financial needs. Donors make donations by sending ether to the contract address of the particuar fundraising campaign they choose to donate to. These people or organizations can then withdraw the amount raised in that campaign. This widthrawal action can only be performed by the creator of the fundraising campaign.  The creator of the campaign provides a beneficiary address when creating a new fundraising campaign but this beneficiary can still be updated by the creator. Fundsraised can only be withdrawn into the beneficiary address for that campaign and this address can be an address from any wallet provider or exchanger. 

How to set it up 

run command ### `ganache-cli` on port 8545
run command: ### `truffle migrate --network develop`
Test: `truffle test`

Run a local development server

To start the local server for the react frontend app

run command : ###`cd client` to navigate to client folder
run command: ###`npm run start` to start ocal sever on port 3000