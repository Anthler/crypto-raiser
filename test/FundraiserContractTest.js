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
        })
    })

})