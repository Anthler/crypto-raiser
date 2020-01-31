pragma solidity 0.5.16;

import "./Fundraiser.sol";

contract FundraiserFactory{

    uint constant MAXLIMIT = 20;

    Fundraiser[] private _fundraisers;

    event FundraiserCreated(address indexed fundraiser);

    function createFundraiser (
            address payable _beneficiary,
            string memory _name,
            string memory _imageUrl,
            string memory _url,
            string memory _description
    )
    public
    {
        Fundraiser fundraiser = new Fundraiser(
            msg.sender, 
            _beneficiary,
            _name,
            _imageUrl,
            _url, 
            _description
        );

        _fundraisers.push(fundraiser);
        emit FundraiserCreated(address(fundraiser));
    }

    function fundraisers(uint limit, uint offset) 
        public 
        view 
        returns(Fundraiser[] memory coll)
        {
            require(offset <= fundraisersCount(), "offset out of bounds");

            uint256 size = fundraisersCount() - offset;

            size = size < limit ? size : limit;
            size = size < MAXLIMIT ? size : MAXLIMIT;
            coll = new Fundraiser[](size);

            for(uint i = 0; i < size; i++){
                coll[i] = _fundraisers[offset +i];
            }
        }

    function fundraisersCount() public view returns(uint){
        return _fundraisers.length;
    }

}