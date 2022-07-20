const { network, ethers, getNamedAccounts } = require("hardhat")
//const developmentChains = ["hardhat", "localhost"];
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")

developmentChains.includes(network.name) ?
    describe.skip :
    describe("Fund Me", async function () {
        let fundMe, deployer, accounts
        const fundingAmount = await ethers.utils.parseEther("0.07")
        beforeEach(async function () {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            fundMe = await ethers.getContract("FundMe", deployer)

        })
        it("will fund and withDraw", async function () {
            await fundMe.fund({ value: fundingAmount })
            await fundMe.cheaperWithDraw()
            const balance = await fundMe.provider.getBalance(fundMe.address)
            assert.equal(balance.toString(), "0")
        })
    })