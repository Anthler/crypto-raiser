
 The smart contracts that makes up my this fundraiser dapp implements the following coding design patterns to minimize vulnerabilities in our smart contracts whilst following best smart contract security design practices.

1. Factory Pattern

 Why I chose the factory design pattern?

 The requirment of this dapp is for the users to be able to create new fundraiser contract for each fundraising campaign and recieve all donations to a seperate contract address. This is implemented by using the FundraiserFactoryContract createNewFundraiser() to create new instance of a fundraiser contract. The fundraiser factory contract also keeps track of all fundraiser contracts that has been created in a array named _fundraisers stored in contract's state. This makes it easy for admins to keep track of fundraising campaigns that has taken place over time hence data stored on the blockchain is immutable. This patterns also ensures that all fundraiser contracts follows the same standard.

2. The Circuit breaker pattern

Why I chose the circuit breaker pattern?

 The core functionality of this dapp is to allow users to donate money to fundraising campaigns created by individuals or organizations. This means that our smart contrats will hold ether/tokens at some point in time during the period of fundraising. Even though our smart contracts follows most of the known security best practices to minimize vulnerabilities in our dapp, but chances are, bugs can arise in the future either from our smart contracts or any of it dependencies or libraries and this might take a longer time to fix. This dapp leverages the circuit breaker design pattern to control users interactions with some parts of the dapp during this period. In a situation when a hacker or a malicious actor finds a vulnerability in our contract, with the circuit breaker pattern we can stop users from performing certain actions such as making donations, withdrawal of funds to and from our smart contract. Using our custom circuit breaker functions can prevent loss of funds from our smart contracts in case of any security flaw. This is implemented in our custom modifers, whenStopped() and whenNotStopped() applied to our methods, donate() and withdraw(). I further implemented a stopContract() method and resumeContract() to toggle between emergency mode and normal mode of our smart contracts. All actions related to our custom circuit breaker is restricted to the owner access control.

 3. The Withdrawal pattern( Pull over Push Pattern)
 
Why I chose Pull over Push pattern ?

 Smart contract FundraiserContract allows the creator of a fundraising campaign to request for  withdrawal(Pull) of funds recieved by the fundraiser contract instead of the smart contract having to send every ether it recieves (Push) to the beneficiary address. By implementing this pattern protects the smart contracts against denial of service attacks on our smart contracts as this pattern shifts the risk of external calls to the requester.