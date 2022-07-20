const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const { deployer } = await getNamedAccounts();
    const transaction = await ethers.getContract("FundMe", deployer)
    //funding
    console.log("Funding-----------------")
    const response = await transaction.fund({ value: await ethers.utils.parseEther("0.07") })
    response.wait(1);
    console.log("Funded")
    const fundBalance = await transaction.provider.getBalance(transaction.address)
    console.log("balance: ", fundBalance.toString())
    console.log("-------------------withDrawingggg---------------")
    const withDrawResp = await transaction.cheaperWithDraw()
    withDrawResp.wait(1)
    const finalBalance = await transaction.provider.getBalance(transaction.address)
    console.log("balance: ", finalBalance.toString())
    console.log("Done")


}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });