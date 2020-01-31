Smart contract for this dapp addresses the following known attacks:

1. Integer Overflow and Underflow

An integer overflow or underflow happens when an arithmetic value oversteps the minimum or maximum size of a type.
When an integer overflows, the value will go back to 0,  whereas, if an integer underflows happens on an integer value, it's value goes below its minimum value and therefore it value is reset to its maximum value. This vulnerability is address using the Open-Zeppelin SafeMath library to manipulate integer values.
In this dapp, FundraiserContract smart contract leverages the Open-Zeppelin SafeMath library for all arithmetic operations on integer values. This prevent integer values from overflowing/underflowing which can leads to an unexpected behaviour in the smart contract.

2. Re-entracy Attacks

This happens when a calling contract passes control to an external contract that calls again the calling contract;s function. The called contract may take over the control flow and end up calling the smart contract function again in a recursive manner. This can lead to unexpected behaviors in the smart contract because the external contract might contain malicious conde based on attacker's intentions.
The FundraiserContract smart contract leverages the Open-Zeppelin library contract ReentrancyGuard contract to prevent reentrancy attacks. The ReentrancyGuard contract exports a modifier "nonReetrant()" which when applied to a function, prevents a contract/function from calling itself recursively. The ReentrancyGuard contract ensures that a contract does not call it self either directly or indirectly. Also making sure all variables are updated before external contract calls are sent. Making external contract calls last operation in the withdraw() function.

3. Denial of Service attacks
This type of attack happens when a smart contract tries to send transactions by looping through an array of undetermined size instead of allowing users to request for funds withdrawal. This way a smart contract can run out of gas and the whole transaction will fails or when a single address in the loop rejects a transaction, that can also lead to failure of the entire transaction chain because, transactions in solidity are atomic, this means that, either the whole transaction is executed sucessfully and in the case of failure all changes made by the current transaction is reverted.
This vulnerability is addressed in Smart contract FundraiserContract which prevents this attack by implementing the push over pull design pattern(also known as the withdrawal pattern) which basically shifts this risk from the smart contract to the caller of the withdraw() method. This way the creator of the fundraising campaign needs to request to withdraw funds recieved into fundraiser contract instead of the smart contract pushing each donation recieved to the beneficiary address.