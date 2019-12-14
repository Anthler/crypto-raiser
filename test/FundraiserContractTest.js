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

        describe("setBeneficiary()", async =>{

            it("", async () => {

            });
            //it("", async () => {});
            //it("", async () => {});
        })
    })

})