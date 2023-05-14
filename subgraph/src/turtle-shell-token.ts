import { Transfer as TransferEvent } from "../generated/TurtleShellToken/TurtleShellToken"
import { SecurityBadge } from "../generated/schema"

export function handleMinted(event: TransferEvent): void {
	const id = event.params.to
	let securityBadge = SecurityBadge.load(id)
	if (!securityBadge) {
		securityBadge = new SecurityBadge(id)
		securityBadge.tokenId = event.params.tokenId
		securityBadge.contractAddress = event.params.to
	}
	securityBadge.save()
}
