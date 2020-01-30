pragma solidity 0.5.16;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";
contract FundraiserContract is Ownable, ReentrancyGuard{

    using SafeMath for uint256;

    string public name;
    address payable public beneficiary;
    string public imageUrl;
    string public url;
    string public description;

    mapping(address => Donation[]) private _donations;
    uint public totalDonations;
    uint public donationsCount;

    event DonationReceived(address indexed donor ,uint value);
    event Withdraw(uint amount);

    struct Donation{
        uint value;
        uint date;
    }

    constructor(
        address _custodian,
        address payable _beneficiary, 
        string memory _name, 
        string memory _imageUrl, 
        string memory _url,
        string memory _desc
    ) 
        public 
    {
        _transferOwnership(_custodian);
        beneficiary = _beneficiary;
        name = _name;
        imageUrl = _imageUrl;
        url = _url;
        description = _desc;
    }

    function () external payable{
        totalDonations += msg.value;
        ++donationsCount;
    }

    function donate(uint _value) public payable nonReentrant(){
        require(msg.value >= _value && _value > 0);
        Donation memory donation = Donation({value: _value, date: now});
        _donations[msg.sender].push(donation);
        totalDonations = totalDonations.add(_value);
        ++donationsCount;
        emit DonationReceived(msg.sender, _value);
    } 

    function setBeneficiary(address payable _beneficiary) public onlyOwner {
        beneficiary = _beneficiary;
    }

    function withdraw() public payable onlyOwner() nonReentrant() {
        uint balance = address(this).balance;
        beneficiary.transfer(balance);
        emit Withdraw(balance);
    }

    function myDonationsCount() public view returns(uint){
        return _donations[msg.sender].length;
    }

    function myDonations() public view returns(uint[] memory values, uint[] memory dates){
        uint count = myDonationsCount();
        values = new uint[](count);
        dates = new uint[](count);

        for(uint i = 0; i < count; i++){
            Donation storage donation = _donations[msg.sender][i];
            values[i] = donation.value;
            dates[i] = donation.date;
        }
        return(values, dates);
    }

}