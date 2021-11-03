import { TokenInfo } from "@uniswap/token-lists";

import BNB from "./assets/bnb.svg";
import ETHER from "./assets/eth.svg";
import POLYGON from "./assets/polygon.svg";

import { makeToken } from "./utils";

import { WETH9 } from "./weth9";

const tokenCache: Record<number, TokenInfo> = {};

const getBaseToken = (chainId: number) => {
	switch (chainId) {
		case 56:
			return makeToken(
				chainId,
				"0x0000000000000000000000000000000000000000",
				18,
				"BNB",
				"Binance",
				BNB
			);

		case 137:
			return makeToken(
				chainId,
				"0x0000000000000000000000000000000000000000",
				18,
				"POLYGON",
				"Polygon",
				POLYGON
			);

		default:
			return makeToken(
				chainId,
				"0x0000000000000000000000000000000000000000",
				18,
				"ETH",
				"Ether",
				ETHER
			);
	}
};

export const getEtherChain = (chainId: number): TokenInfo => {
	if (!tokenCache[chainId]) {
		tokenCache[chainId] = getBaseToken(chainId);
	}

	return tokenCache[chainId];
};

export const getEtherChainWrapped = (chainId: number) => {
	return WETH9[chainId];
};
