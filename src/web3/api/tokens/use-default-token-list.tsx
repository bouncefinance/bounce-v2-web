import { TokenInfo } from "@uniswap/token-lists";
import { useMemo } from "react";

import { useChainId } from "@app/web3/hooks/use-web3";

import defaultList from "./defaultList.json";

export const getDefaultTokens = (): TokenInfo[] => {
	return (defaultList as any).tokens as TokenInfo[];
};

export const useFilterApplicableTokens = <T extends TokenInfo>(
	tokenList: T[],
	chainId: number
): T[] => {
	return useMemo(() => {
		return tokenList.filter((token) => token.chainId === chainId);
	}, [tokenList, chainId]);
};
