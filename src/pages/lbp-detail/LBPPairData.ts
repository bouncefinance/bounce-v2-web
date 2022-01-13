import type { Contract as ContractType } from "web3-eth-contract";

export class LBPPairData {
	pairContract: ContractType;
	vaultContract: ContractType;
	poolId_byte32: string;

	tokensWeight: string[];
	tokensAmount: string[];

	constructor(pairContract: ContractType, vaultContract: ContractType) {
		this.pairContract = pairContract;
		this.vaultContract = vaultContract;
		this.updateTimer();
	}

	updateTimer() {
		setTimeout(async () => {
			this.tokensWeight = (await this.pairContract.methods
				.getNormalizedWeights()
				.call()) as string[];
		}, 5000);
	}

	async getTokensWeight() {
		return (
			this.tokensWeight ||
			((await this.pairContract.methods.getNormalizedWeights().call()) as string[])
		);
	}

	async getPoolIdByte32() {
		return this.poolId_byte32 || ((await this.pairContract.methods.getPoolId().call()) as string);
	}

	async getPoolTokens() {
		return;
	}
}
