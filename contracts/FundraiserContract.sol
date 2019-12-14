pragma solidity 0.5.12;

import "./Ownable.sol";

contract FundraiserContract is Ownable{

    string public name;
    address payable public beneficiary;
    string public imageUrl;
    string public url;
    string public description;

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

    function getName() public view returns(string memory _name){
        _name = name;
    }

    // function getBeneficiary() public view returns(address payable){
    //     return beneficiary;
    // }

}