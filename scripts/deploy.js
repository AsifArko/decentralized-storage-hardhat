// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { verifyMessage } = require("ethers/lib/utils")
const { ethers, run, network } = require("hardhat")
const hre = require("hardhat")

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS

  // const lockedAmount = hre.ethers.utils.parseEther("1")

  // const Lock = await hre.ethers.getContractFactory("Lock")
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount })
  // await lock.deployed()

  const SimpleStorage = await ethers.getContractFactory("SimpleStorage")
  const simpleStorage = await SimpleStorage.deploy()

  console.log(`Simple storage deployed to address: ${simpleStorage.address}`)
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  const currentValue = await simpleStorage.retrieve()
  console.log(`Current Value: ${currentValue}`)

  const transactionResponse = await simpleStorage.store("7")
  transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Value: ${updatedValue}`)
}

async function verify(contractAddress, args) {
  console.log("Verifying contract")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguements: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified")
    } else {
      console.log(e)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
