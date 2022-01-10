import { AbstractProvider } from "web3-core";

import { getContract } from "@app/web3/contracts/helpers";
import { WEB3_NETWORKS } from "@app/web3/networks/const";
import {
	getBounceProxyChainAddressMapping,
	getOtcChainAddressMapping,
} from "@app/web3/networks/mapping";

import BounceProxyABI from "./BounceProxy.json";

import type { Contract as ContractType } from "web3-eth-contract";

export const getBounceProxyContract = (provider: AbstractProvider, chainId: WEB3_NETWORKS) => {
	return getContract(provider, BounceProxyABI, getBounceProxyChainAddressMapping(chainId));
};

export const approveLbpPool = (
	contract: ContractType,
	chainId: WEB3_NETWORKS,
	account: string,
	amount: string
) => {
	return contract.methods
		.approve(getBounceProxyChainAddressMapping(chainId), amount)
		.send({ from: account });
};

export const getLbpAllowance = async (
	contract: ContractType,
	chainId: WEB3_NETWORKS,
	account: string
) => {
	return contract.methods.allowance(account, getBounceProxyChainAddressMapping(chainId)).call();
};

// export interface IUserData {

// }

export type OtcPoolType = {
	name: string;
	symbol: string;
	tokens: string[];
	amounts: string[];
	weights: string[];
	endWeights: string[];
	isCorrectOrder: boolean;
	swapFeePercentage: string;
	userData: any;
	startTime: number;
	endTime: number;
};

export const createLbpPool = (
	contract: ContractType,
	account: string,
	data: OtcPoolType,
	value?: string
) => {
	const action = contract.methods.createAuction(data);

	// action.estimateGas();

	return action.send({ from: account, value });
};

export type setPoolEnabledType = {
	poolAddress: string;
	swapEnabled: boolean;
};

export const getPoolEnabled = () => {
	return false;
};

export const setPoolEnabled = (
	contract: ContractType,
	account: string,
	data: setPoolEnabledType,
	value?: string
) => {
	const action = contract.methods.setSwapEnabled(data);

	action.estimateGas();

	return action.send({ from: account, value });
};

// export const getOtcPools = async (
// 	contract: ContractType,
// 	poolID: number
// ): Promise<Omit<OtcPoolType, "onlyBot">> => {
// 	return contract.methods.pools(poolID).call();
// };

// export const getSwap1Amount = async (contract: ContractType, poolID: number) => {
// 	return contract.methods.amountSwap1P(poolID).call();
// };

// export const getWhitelistedStatus = async (
// 	contract: ContractType,
// 	poolID: number,
// 	address: string
// ): Promise<boolean> => {
// 	return contract.methods.whitelistP(poolID, address).call();
// };

export const swapContracts = (
	contract: ContractType,
	amount: string,
	account: string,
	poolID: number,
	sendAmount: string
) => {
	const action = contract.methods.swap(poolID, amount);

	action.estimateGas({
		poolID,
		amount,
	});

	return action.send({ from: account, value: sendAmount });
};

export const getMyAmount0 = async (
	contract: ContractType,
	address: string,
	poolID: number
): Promise<string> => {
	return contract.methods.myAmountSwapped0(address, poolID).call();
};

export const getMyAmount1 = async (
	contract: ContractType,
	address: string,
	poolID: number
): Promise<string> => {
	return contract.methods.myAmountSwapped1(address, poolID).call();
};

export const delList = (contract: ContractType, account: string, poolID: number) => {
	const action = contract.methods.deList(poolID);

	action.estimateGas({
		poolID,
		from: account,
	});

	return action.send({ from: account });
};

export const getCreatorClaimed = async (
	contract: ContractType,
	address: string,
	poolID: number
): Promise<boolean> => {
	return contract.methods.creatorClaimed(address, poolID).call();
};
