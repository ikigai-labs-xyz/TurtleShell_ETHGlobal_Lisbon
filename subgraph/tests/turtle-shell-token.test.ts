import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { Mint } from "../generated/schema"
import { Mint as MintEvent } from "../generated/TurtleShellToken/TurtleShellToken"
import { handleMint } from "../src/turtle-shell-token"
import { createMintEvent } from "./turtle-shell-token-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let initiator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let contractAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let tokenURI = "Example string value"
    let newMintEvent = createMintEvent(initiator, contractAddress, tokenURI)
    handleMint(newMintEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Mint created and stored", () => {
    assert.entityCount("Mint", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Mint",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "initiator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Mint",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contractAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Mint",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokenURI",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
