const FundraiserFactory = artifacts.require("FundraiserFactory");
const Fundraiser = artifacts.require("Fundraiser");

const {
    expectEvent,
    expectRevert
  } = require('@openzeppelin/test-helpers');

contract(" Contract: FundraiserFactory", accounts => {

    let fundraiserFactory;
    const name = "Beneficiary Name";
    const url = "beneficiaryname.org";
    const imageURL = "https://images.com"
    const bio = "Beneficiary Description"
    const beneficiary = accounts[1];

    // Tests to see if contract was successfully deployed to the blockchain.

    it("it has been deployed", async () => {
        const fundraiserFactory = FundraiserFactory.deployed();
        assert(fundraiserFactory, "fundraiser factory was not deployed")
    });

    /*
        This tests for increase in count of fundraisers 
        when a new fundraising campaign is created
    */
    it("increases fundraisersCount", async () => {
        fundraiserFactory = await FundraiserFactory.deployed()
        const countBefore = await fundraiserFactory.fundraisersCount();
        await fundraiserFactory.createFundraiser(beneficiary,name,imageURL,url,bio);
        const countAfter = await fundraiserFactory.fundraisersCount();
        assert(1, countAfter - countBefore, "should increment by 1");
    })

    /*
        Tests for FundraiserCreated event emission when a new fundraiser is created
    */
    it("emits the FundraiserCreated event", async () => {
        fundraiserFactory = await FundraiserFactory.deployed();
        const tx = await fundraiserFactory.createFundraiser(beneficiary,name,imageURL,url,bio);
        const expectedEvent = "FundraiserCreated";
        expectEvent(tx, expectedEvent)
    });

    async function createFundraiserFactory(fundraiserCount, accounts){
        const factory = await FundraiserFactory.new();
        await addFundraisers(factory, fundraiserCount, accounts);
        return factory;
    }

    async function addFundraisers(factory, count, accounts){
        const name = "Beneficiary";
        const lowerCaseName = name.toLowerCase();
        const beneficiary = accounts[1];

        for(let i = 0; i < count; i++){

            await factory.createFundraiser( 
                `${beneficiary}`,
                `${name} ${i}`,
                `${lowerCaseName}${i}.png`,
                `${lowerCaseName}${i}.com`,
                ` Description for ${lowerCaseName}`
            );
        }
    }

    /*
        Tests for the return value for all fundraisers 
        contracts when no fundraiser is created yet
    */
    describe("when funraisers collection is empty", async () =>{
        it("returns an empty collection", async () => {
            const factory = await createFundraiserFactory(0, accounts);
            const fundraisers = await factory.fundraisers(10, 0);
            assert.equal(fundraisers.length,0, "collection should be empty");
        });
    });


    /*
        This section tests for the size of fundraisers array returned 
        based on number of fundraisers requested.
    */
    describe("varying limits", async () => {
        let factory;

        beforeEach(async () => {
            factory = await createFundraiserFactory(30, accounts);
        });

        /*
            Tests for fundraisers returned when limit is 10
        */
        it("returns 10 results when the limit requested is 10", async () => {
            const fundraisers = await factory.fundraisers(10,0);
            assert.equal(fundraisers.length, 10, "results size should be 10");
        });
        
        /*
            Tests for number of fundraiser contracts returned when limit requested is 20
        */
        it("returns 20 results when limit requested is 20", async () => {
            const fundraisers = await factory.fundraisers(20, 0);
            assert.equal(fundraisers.length, 20, "results size should be 20");
        });

        /*
            Tests for number of fundraiser contracts returned when limit requested is 30
        */
        it("returns 20 results when limit requested is 30", async () => {
            const fundraisers = await factory.fundraisers(30, 0);
            assert.equal(fundraisers.length, 20, "results size should be 20");
        })
    });

    describe("varying offset", async () => {

        let factory ;

        beforeEach( async () => {
            factory = await createFundraiserFactory(10, accounts);
        })

        /*
            Tests for fundraiser contract returned with appropriate offset
        */
        it("contains the fundraiser with the appropriate offset", async () => {
            const fundraisers = await factory.fundraisers(1,0);
            const fundraiser = await Fundraiser.at(fundraisers[0]);
            const name = await fundraiser.name();
            assert.ok(await name.includes(0), `${name} did not include the offset`);
        })

        /*
            Tests for fundraiser contract returned with appropriate offset
        */
        it("contains the fundraiser with the appropriate offset", async () => {
            const fundraisers = await factory.fundraisers(1,7);
            const fundraiser = await Fundraiser.at(fundraisers[0]);
            const name = await fundraiser.name() ;
            assert.ok(await name.includes(7), `${name} did not include the offset`); 
        })
    })

    describe("boundary conditions", () => {

            let factory;

            beforeEach(async () => { factory = await createFundraiserFactory(10, accounts); });

            it("raises out of bounds error", async () => {
                   await expectRevert.unspecified(factory.fundraisers(1,11))
            })

            it("adjusts return size to prevent out of bounds error", async () => {
                try {
                    const fundraisers = await factory.fundraisers(10, 5);
                    assert.equal( fundraisers.length, 5, "collection adjusted");
                } catch (err) {
                    assert.fail("limit and offset exceeded bounds");
                }
            });
    })
});