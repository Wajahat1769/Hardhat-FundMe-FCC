
const { ethers, hre, network } = require("hardhat")
const { verify } = require("../utils/verify")

// function deployFunc() {
//     console.log("hi");

// }

// module.exports.default = deployFunc
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts()
    const chainId = await network.config.chainId;
    let address
    if (developmentChains.includes(network.name)) {
        const ethUsdAgg = await deployments.get("MockV3Aggregator")
        address = ethUsdAgg.address;
    } else {
        address = networkConfig[chainId]["EthUsdAddress"];
    }
    let args = [address]

    const fundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations
    })
    log("------------FundMe Deployed------------------------------------")
    log("----------------------------------------------------------------")

    if (!developmentChains.includes(network.name)) {

        await verify(fundMe.address, args)
    }

    // const transaction = await fundMe.withDraw();
    // console.log(transaction.address);
}

module.exports.tags = ["all", "FundMe"]



// async function main() {

// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });