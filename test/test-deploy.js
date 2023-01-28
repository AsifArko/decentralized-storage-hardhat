const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", () => {
  let simpleStorageFactory
  let simpleStorage

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), "0")
  })

  it("Should update favorite number", async () => {
    const transactionResponse = await simpleStorage.store("7")
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()

    assert.equal(currentValue.toString(), "7")
  })
})
