export function getAuctionAddress(chainId) {
	switch (chainId) {
		case 1:
			return "0xa9b1eb5908cfc3cdf91f9b8b3a74108598009096";
		case 4:
			return "0x5e26fa0fe067d28aae8aff2fb85ac2e693bd9efa";
		case 97:
			return "";
		case 56:
			return "0x1188d953aFC697C031851169EEf640F23ac8529C";
		default:
			return "0xa9b1eb5908cfc3cdf91f9b8b3a74108598009096";
	}
}

export function getStakingAddress(chainId) {
	switch (chainId) {
		case 1:
			return "0x98945BC69A554F8b129b09aC8AfDc2cc2431c48E";
		case 4:
			return "0xa77A9FcbA2Ae5599e0054369d1655D186020ECE1";
		// case 4:
		// return "0x4911C30A885EfcdD51B351B1810b1FEA73796338";
		default:
			return "0x98945BC69A554F8b129b09aC8AfDc2cc2431c48E";
	}
}

export function getBotWethPairAddress(chainId) {
	switch (chainId) {
		case 1:
			return "0x30D4e73CC4580cbCf50BaAD3510d1E9Efa187716";
		case 4:
			return "0x3Dd8EBFf190Feb763235Ccee3107E0d8Fd0D4f52";
		default:
			return "0x30D4e73CC4580cbCf50BaAD3510d1E9Efa187716";
	}
}

/**
 * Get contract address of WETH token
 * @param chainId
 * @returns token contract address
 */
export function getWethAddress(chainId) {
	switch (chainId) {
		case 1:
			return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
		case 4:
			return "0xc778417e063141139fce010982780140aa0cd5ab";
		default:
			return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
	}
}

/**
 * Get contract address of Bot token.
 * Bot was merged into Auction on mainnet, but not on testnet.
 * @param chainId
 * @returns token contract address
 */
export function getBotAddress(chainId) {
	switch (chainId) {
		case 1:
			return getAuctionAddress(1);
		case 4:
			return "0xAbF690E2EbC6690c4Fdc303fc3eE0FBFEb1818eD";
		default:
			return getAuctionAddress(1);
	}
}
