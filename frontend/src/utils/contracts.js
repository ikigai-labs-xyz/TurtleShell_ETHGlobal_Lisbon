import { ethers } from "ethers"
import { turtleAddress } from "./address"

export const turtleContract = new ethers.Contract(turtleAddress, [])
