import React, { useEffect, useState } from "react";
import FundraiserFactoryContract from "../contracts/FundraiserFactoryContract.json";
import FundraiserContract from "../contracts/FundraiserContract.json";

const Home = () => {

    const [ funds, setFunds ] = useState(null)

    
    useEffect(() => {

        // const funds = await instance.methods.fundraisers(10,0).call()
        // setFunds(funds)

    }, []);

    return (
        <div>
            <h2> Home</h2>
        </div>
    );
}

export default Home;