
const { expect, assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { developmentChains } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name) ?
    describe.skip :
    describe("FundMe", async function () {
        let fundMe, deployer, MockV3Aggregator
        const fundingAmount = ethers.utils.parseEther("1")
        let accounts
        beforeEach(async function () {
            accounts = await ethers.getSigners();
            //deploy FundMe contract
            // we will be using deployments.fixture function which will deploy all the contracts
            //with specific tags
            // getting accounts using ethers
            deployer = accounts[0];
            //getting the deployer
            //deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            // now will use ethers.getContract to get the most recent deployment of a contract
            fundMe = await ethers.getContract("FundMe", deployer)
            MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)

        })
        describe("constructor", async function () {
            it("Gets the Price Feed address and check if owner is deployer", async function () {
                const responce = await fundMe.priceFeed()
                const owner = await fundMe.owner
                assert.equal(responce, MockV3Aggregator.address) && assert.equal(owner, deployer)
            })
        })
        describe("fund Function", async function () {
            it("Transaction get rejected if not value passed", async function () {
                await expect(fundMe.fund()).to.be.revertedWith("Not Enough")
            })

            it("Update the data structure with value", async function () {
                const transaction = await fundMe.fund({ value: fundingAmount })
                const solValue = (await fundMe.addressToFunding(deployer.address))
                assert.equal(solValue.toString(), fundingAmount.toString())
            })
            it("Check if funders array is getting updated", async function () {
                await fundMe.fund({ value: fundingAmount })
                const response = await fundMe.addressArray(0)
                assert.equal(response, deployer.address)
            })
        })

        describe("withDraw function", async function () {
            beforeEach(async function () {
                await fundMe.fund({ value: fundingAmount })
            })
            it("Withdrawing Money", async function () {
                //Arrange
                const contractStartingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerStartingBalance = await fundMe.provider.getBalance(deployer.address)

                //Act

                const responce = await fundMe.withDraw()
                const reciept = await responce.wait(1);
                const gas = reciept.effectiveGasPrice * reciept.cumulativeGasUsed
                const contractEndingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerEndingBalance = await fundMe.provider.getBalance(deployer.address)
                //Assert


                assert.equal(contractEndingBalance.toString(), "0")
                assert.equal(contractStartingBalance.add(deployerStartingBalance).toString(), deployerEndingBalance.add(gas).toString())

            })

            it("Withdrawing money send by multiple accounts", async function () {

                for (let i = 0; i < 6; i++) {
                    const newAccount = await fundMe.connect(accounts[i])
                    await newAccount.fund({ value: fundingAmount })
                }
                //Arrange
                const contractStartingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerStartingBalance = await fundMe.provider.getBalance(deployer.address)

                //Act

                const responce = await fundMe.withDraw()
                const reciept = await responce.wait(1);
                const gas = reciept.effectiveGasPrice * reciept.cumulativeGasUsed
                const contractEndingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerEndingBalance = await fundMe.provider.getBalance(deployer.address)
                //Assert


                assert.equal(contractEndingBalance.toString(), "0")
                assert.equal(contractStartingBalance.add(deployerStartingBalance).toString(), deployerEndingBalance.add(gas).toString())
                await expect(fundMe.addressArray(0)).to.be.reverted

                for (let i = 0; i < 6; i++) {
                    assert.equal(await fundMe.addressToFunding(accounts[i].address), 0)
                }
            })

            it("Checking if transaction is reverted if withdrawl request is not made by owner", async function () {
                const newAccount = await fundMe.connect(accounts[1])
                await expect(newAccount.withDraw()).to.be.reverted
            })

        })

        describe("cheap withDraw function", async function () {
            beforeEach(async function () {
                await fundMe.fund({ value: fundingAmount })
            })
            it("Withdrawing Money", async function () {
                //Arrange
                const contractStartingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerStartingBalance = await fundMe.provider.getBalance(deployer.address)

                //Act

                const responce = await fundMe.cheaperWithDraw()
                const reciept = await responce.wait(1);
                const gas = reciept.effectiveGasPrice * reciept.cumulativeGasUsed
                const contractEndingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerEndingBalance = await fundMe.provider.getBalance(deployer.address)
                //Assert


                assert.equal(contractEndingBalance.toString(), "0")
                assert.equal(contractStartingBalance.add(deployerStartingBalance).toString(), deployerEndingBalance.add(gas).toString())

            })

            it("Withdrawing money send by multiple accounts", async function () {

                for (let i = 0; i < 6; i++) {
                    const newAccount = await fundMe.connect(accounts[i])
                    await newAccount.fund({ value: fundingAmount })
                }
                //Arrange
                const contractStartingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerStartingBalance = await fundMe.provider.getBalance(deployer.address)

                //Act

                const responce = await fundMe.cheaperWithDraw()
                const reciept = await responce.wait(1);
                const gas = reciept.effectiveGasPrice * reciept.cumulativeGasUsed
                const contractEndingBalance = await fundMe.provider.getBalance(fundMe.address)
                const deployerEndingBalance = await fundMe.provider.getBalance(deployer.address)
                //Assert


                assert.equal(contractEndingBalance.toString(), "0")
                assert.equal(contractStartingBalance.add(deployerStartingBalance).toString(), deployerEndingBalance.add(gas).toString())
                await expect(fundMe.addressArray(0)).to.be.reverted

                for (let i = 0; i < 6; i++) {
                    assert.equal(await fundMe.addressToFunding(accounts[i].address), 0)
                }
            })

            it("Checking if transaction is reverted if withdrawl request is not made by owner", async function () {
                const newAccount = await fundMe.connect(accounts[1])
                await expect(newAccount.cheaperWithDraw()).to.be.reverted
            })

        })
    })