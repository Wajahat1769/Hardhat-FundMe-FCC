const { ethers, hre, network } = require("hardhat")
const { developmentChains, DECIMAL, ANSWER } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts()
    const chainId = await network.config.chainId;
    if (developmentChains.includes(network.name)) {
        log("Deploying mocks--------------")
        await deploy("MockV3Aggregator", {
            from: deployer,
            contract: "MockV3Aggregator",
            log: true,
            args: [DECIMAL, ANSWER],

        })
        log("----------Mocks Deployed---------------")
        log("--------------------------------------------")

    }

}
module.exports.tags = ["all", "mocks"]