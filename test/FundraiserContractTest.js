const Fundraiser = artifacts.require("Fundraiser");

const {
    expectEvent, 
    expectRevert, 
  } = require('@openzeppelin/test-helpers');

contract("Fundraiser", (accounts) => {
    
    let fundraiser;
    let owner = accounts[0];
    let beneficiaryAddress = accounts[1];
    const name = "Beneficiary name";
    const imageUrl = "https://images.com";
    const url = "beneficiaryurl.org";
    const description = "Beneficiary description";

    beforeEach(async () =>{
        fundraiser = await Fundraiser.new(owner, beneficiaryAddress, name, imageUrl,url, description);
    })

    describe("Test contract initialization", async () => {

        /*
            Tests for fundraiser owner address is set to contract creator's address
        */
        it( "Test the owner address", async () => {
            const actualOwner = await fundraiser.owner();
            assert.equal(actualOwner, owner, `actual owner address ${actualOwner} must be equal to actual owner address ${owner} `)
        })

        /*
            Tests for fundraiser contract's beneficiary
             address is set to contract creator's address
        */
        it( "Test the beneficiary address" , async () =>{
            const actualBeneficiary = await fundraiser.beneficiary();
            assert.equal(beneficiaryAddress, actualBeneficiary, `actual beneficiary address ${actualBeneficiary} must be equal to actual beneficiary ${beneficiaryAddress}`)
        })
       
        /*
            Tests for fundraiser name is set to the name 
            provided during creation of the fundraiser contract
        */
        it( "Test the beneficiary name" , async () =>{
            const actualName = await fundraiser.name();
            assert.equal(name, actualName, "Name must be equal to actual name")
        });

        /*
            Tests for fundraiser's  url is set to the url provided the contract creation
        */
        it( "Test the url" , async () =>{
            const actualUrl = await fundraiser.url();
            assert.equal(actualUrl,url, " Url must be equal to actual url");
        });

        /*
            Tests for fundraiser's  image url is set to the url 
            provided during the contract creation
        */
        it( "Test the beneficiary image url" , async () =>{
            const actualImageUrl = await fundraiser.imageUrl();
            assert.equal(imageUrl, actualImageUrl, " actual imageUrl must be equal to actual url")
        })

        /*
            Tests for fundraiser's  description url is same as the description
            provided during the contract creation
        */
        it( "Test the description" , async () =>{
            const actualDesc = await fundraiser.description();
            assert.equal(description, actualDesc," actual desc must be equal to actual description")
        })  
    });

    describe("Functions", ()  => {

        describe("setBeneficiary()", () =>{

            const newBeneficiary = accounts[2];

            /*
                Tests for fundraiser's  image url is set to the url 
                provided during the contract creation
            */
            it(" Sets new beneficiary", async () => {
                await fundraiser.setBeneficiary(newBeneficiary, {from: owner});
                const currentBeneficiary = await fundraiser.beneficiary();
                assert.equal(currentBeneficiary, newBeneficiary)
            });

            /*
                Tests for fundraiser's  access control modifier onlyOwner
            */
            it("throws an error when called from a non-owner account", async () => {
                await expectRevert.unspecified(fundraiser.setBeneficiary(accounts[4], {from: accounts[3]}))
            });
        })

        /*
            Tests for function donate
        */
        describe(" donate() ", async () =>{

            const value = web3.utils.toWei('0.289');
            const donor = accounts[2];
            
            /*
                Tests for increment in donations count 
                when new donation is made to the contract address  
            */
            it("increases donationsCount", async () =>{
                let countBefore = await fundraiser.myDonationsCount({from: donor});
                await fundraiser.donate(value, {from: donor, value: value});
                let countAfter = await fundraiser.myDonationsCount({from: donor});
                assert.equal(1, countAfter - countBefore);
            })

            /*
                Tests for all donations from a particular address
            */
            it("it adds to myDonations", async () =>{
                await fundraiser.donate(value, {from: donor, value: value});
                const {values, dates} = await fundraiser.myDonations({from: donor});
                assert.equal(value, values[0], "Value should match");
                assert(dates, "Date should be present");
            });

            /*
                Tests for the total amount of donations sent to the contracts address
            */
            it("Increases total amount", async () => {
                const totalBefore = await fundraiser.totalDonations();
                await fundraiser.donate(value, {from: donor, value:value});
                const totalAfter = await fundraiser.totalDonations();
                const diff = totalAfter - totalBefore;
                assert.equal(value, diff, "difference should match the donation value");
            });

            /*
                Tests for the value of donationsCount global variable
            */
            it("Increases donationsCount by 1", async () =>{
                const countBefore = await fundraiser.donationsCount();
                await fundraiser.donate(value, {from: donor, value:value});
                const countAfter = await fundraiser.donationsCount();
                assert.equal(1,countAfter - countBefore, "donationsCount should increment by 1" )
            });

            /*
                Tests for for event DonationRecieved when a donation made to contract address
            */
            it("Emit DonationReceived Event", async () =>{
                const tx = await fundraiser.donate(value, {from: donor, value});
                const expectedEvent = "DonationReceived";
                actualEvent = tx.logs[0].event;
                expectEvent(tx, expectedEvent)
                
            })
        })

        describe(" withdraw() ", async () => {

            beforeEach(async () => {
                const value = web3.utils.toWei('0.1');
                await fundraiser.donate(value, {from: accounts[2], value: value})
            })

            describe("access controls", async () => {

            /*
                Tests for access controls from non owner address
            */

            it("throws an error when called from a non-owner account", async () => {
                        await expectRevert.unspecified(fundraiser.withdraw({from: accounts[3]}));
            });

                it("permits the owner to call the function", async () => {
                    try {
                        await fundraiser.withdraw({from: owner})
                        assert(true, "no errors were thrown");
                    } catch (err) {
                        assert.fail(" Should not have thrown any errors");
                    }
                });

                /*
                    Tests for successful widthrawal of funds raised in the campaign
                */
                it("transfers balance to beneficiary", async () => {
                    const currentContractBalance = await web3.eth.getBalance(fundraiser.address)
                    const currentBeneficiaryBalance = await web3.eth.getBalance(beneficiaryAddress)
                    await fundraiser.withdraw({from: owner});
                    const newContractBalance = await web3.eth.getBalance(fundraiser.address);
                    const newBeneficiaryBalance = await web3.eth.getBalance(beneficiaryAddress);
                    const beneficiaryBalanceDiff = newBeneficiaryBalance - currentBeneficiaryBalance;
                    assert.equal(0, newContractBalance, "contract should have a 0 balance");
                    assert.equal(beneficiaryBalanceDiff, currentContractBalance, "beneficiary should receive all the funds");
                })
                
                /*
                    Tests for withdraw went emission after a successful withdrawal operation
                */
                it("Test withdraw event", async () => {
                    const tx = await fundraiser.withdraw({from: owner});
                    const expectedEvent = "Withdraw";
                    expectEvent(tx, expectedEvent)
                })
            })

            describe("fallback()", async () => {
                const value = web3.utils.toWei("0.289");

                it("increases totalDonations amount", async () => {
                    const totalDonationsBefore = await fundraiser.totalDonations();
                    await web3.eth.sendTransaction({to:fundraiser.address, from: accounts[9], value})
                    const totalDonationsAfter = await fundraiser.totalDonations();
                    const donationsDifference = totalDonationsAfter - totalDonationsBefore;
                    assert.equal(donationsDifference, value, "donation shoud match");
                });

                it("increases donations count", async () => {
                    const countBefore = await fundraiser.donationsCount();
                    await web3.eth.sendTransaction({to:fundraiser.address, from: accounts[9], value})
                    const countAfter = await fundraiser.donationsCount();
                    const diff = countAfter - countBefore;
                    assert.equal(1, diff, "Should increment by 1");
                })
            })
        })

    })

})