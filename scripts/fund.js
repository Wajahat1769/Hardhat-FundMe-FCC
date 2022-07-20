const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts();
    const transaction = await ethers.getContract("FundMe", deployer)
    //funding
    console.log("Funding-----------------")
    const response = await transaction.fund({ value: await ethers.utils.parseEther("0.07") })
    response.wait(1);
    console.log("Funded")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

