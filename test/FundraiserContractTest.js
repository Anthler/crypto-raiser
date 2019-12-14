const FundraiserContract = artifacts.require("FundraiserContract");

contract("FundraiserContract", (accounts) => {
    
    let fundraiser;
    let owner = accounts[0];
    let beneficiaryAddress = accounts[1];
    const name = "Beneficiary name";
    const imageUrl = "https://placekitten.com/600/350";
    const url = "beneficiaryurl.org";
    const description = "Beneficiary description";

    beforeEach(async () =>{
        fundraiser = await FundraiserContract.new(owner, beneficiaryAddress, name, imageUrl,url, description);
    })

    describe("Test contract initialization", async () => {

        it( "Test the owner address", async () => {
            const actualOwner = await fundraiser.owner();
            assert.equal(actualOwner, owner, `actual owner address ${actualOwner} must be equal to actual owner address ${owner} `)
        })

        it( "Test the beneficiary address" , async () =>{
            const actualBeneficiary = await fundraiser.beneficiary();
            assert.equal(beneficiaryAddress, actualBeneficiary, `actual beneficiary address ${actualBeneficiary} must be equal to actual beneficiary ${beneficiaryAddress}`)
        })
       
        it( "Test the beneficiary name" , async () =>{
            const actualName = await fundraiser.name();
            assert.equal(name, actualName, "Name must be equal to actual name")
        });

        it( "Test the beneficiary url" , async () =>{
            const actualUrl = await fundraiser.url();
            assert.equal(actualUrl,url, " Url must be equal to actual url");
        });

        it( "Test the beneficiary image url" , async () =>{
            const actualImageUrl = await fundraiser.imageUrl();
            assert.equal(imageUrl, actualImageUrl, " actual imageUrl must be equal to actual url")
        })

        it( "Test the description" , async () =>{
            const actualDesc = await fundraiser.description();
            assert.equal(description, actualDesc," actual desc must be equal to actual description")
        })  
    });

    describe("Functions", ()  => {

        describe("setBeneficiary()", () =>{

            const newBeneficiary = accounts[2];

            it(" Sets new beneficiary", async () => {
                await fundraiser.setBeneficiary(newBeneficiary, {from: owner});
                const currentBeneficiary = await fundraiser.beneficiary();
                assert.equal(currentBeneficiary, newBeneficiary)
            });

            it("throws an error when called from a non-owner account", async () => {
                
                try {
                    await fundraiser.setBeneficiary(accounts[4], {from: accounts[3]})
                    assert.fail("withdraw was not restricted to owners");
                } catch (err) {
                    const expectedError = "Ownable: caller is not the owner";
                    const reason = err.reason;
                    assert.equal(reason, expectedError, "should not be permitted");
                }
            });
        })

        describe(" donate() ", async () =>{

            const value = web3.utils.toWei('0.289');
            const donor = accounts[2];
            
            it("increases donationsCount", async () =>{
                let countBefore = await fundraiser.myDonationsCount({from: donor});
                await fundraiser.donate(value, {from: donor, value: value});
                let countAfter = await fundraiser.myDonationsCount({from: donor});
                assert.equal(1, countAfter - countBefore);
            })

            it("it adds to myDonations", async () =>{
                await fundraiser.donate(value, {from: donor, value: value});
                const {values, dates} = await fundraiser.myDonations({from: donor});
                assert.equal(value, values[0], "Value should match");
                assert(dates, "Date should be present");
            });

            it("Increases total amount", async () => {
                const totalBefore = await fundraiser.totalDonations();
                await fundraiser.donate(value, {from: donor, value:value});
                const totalAfter = await fundraiser.totalDonations();
                const diff = totalAfter - totalBefore;
                assert.equal(value, diff, "difference should match the donation value");
            });

            it("Increases donationsCount by 1", async () =>{
                const countBefore = await fundraiser.donationsCount();
                await fundraiser.donate(value, {from: donor, value:value});
                const countAfter = await fundraiser.donationsCount();
                assert.equal(1,countAfter - countBefore, "donationsCount should increment by 1" )
            });

            it("Emit DonationReceived Event", async () =>{
                const tx = await fundraiser.donate(value, {from: donor, value});
                const expectedEvent = "DonationReceived";
                actualEvent = tx.logs[0].event;
                assert.equal(actualEvent, expectedEvent, "Events should match")
                
            })
        })

        describe(" withdraw() ", async () => {

            beforeEach(async () => {
                const value = web3.utils.toWei('0.1');
                await fundraiser.donate(value, {from: accounts[2], value: value})
            })

            describe("access controls", async () => {

                it("throws an error when called from a non-owner account", async () => {
                    try {
                        await fundraiser.withdraw({from: accounts[3]});
                        assert.fail("withdraw was not restricted to owners")
                    } catch (err) {
                        const expectedError = "Ownable: caller is not the owner";
                        const actualError = err.reason;
                        assert.equal(expectedError, actualError, " Errors must match");
                    }
                });

                it("permits the owner to call the function", async () => {
                    try {
                        await fundraiser.withdraw({from: owner})
                        assert(true, "no errors were thrown");
                    } catch (err) {
                        assert.fail(" Should not have thrown any errors");
                    }
                });

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

                it("Test withdraw event", async () => {
                    const tx = await fundraiser.withdraw({from: owner});
                    const expectedEvent = "Withdraw";
                    const actualEvent = tx.logs[0].event
                    assert.equal(expectedEvent, actualEvent, "Event should match");
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