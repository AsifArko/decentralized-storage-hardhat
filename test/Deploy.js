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

  it("Should return an empty array", async () => {
    const persons = await simpleStorage.retrievePersons()
    assert.equal(persons.length, 0)
  })

  it("should retrieve persons correctly", async () => {
    await simpleStorage.addPerson("Alice", 9)
    await simpleStorage.addPerson("Bob", 10)
    const persons = await simpleStorage.retrievePersons()
    assert.equal(persons.length, 2)
    assert.equal(persons[0].name, "Alice")
    assert.equal(persons[1].name, "Bob")
  })
})
