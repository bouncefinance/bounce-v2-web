export enum WEB3_NETWORKS {
	ETH = 1,
	RINKEBY = 4,
	BINANCE = 56,
	POLYGON = 137,
	ARBITRUM = 42161,
	// AVALANCHE = 43114,
	// FANTOM = 250,
}

export const CHAINS_INFO = {
	1: { currency: "ETH", explorer: { name: "etherscan", url: "https://etherscan.io" } },
	4: {
		currency: "ETH",
		explorer: { name: "rinkeby.etherscan", Url: "https://rinkeby.etherscan.io" },
	},
	56: { currency: "BNB", explorer: { name: "bscscan", Url: "https://bscscan.com" } },
	137: { currency: "MATIC", explorer: { name: "polygonscan", Url: "https://polygonscan.com" } },
	42161: {
		currency: "ETH",
		explorer: { name: "arbiscan", Url: "https://arbiscan.io" },
	},
	// 43114: { currency: "AVAX", explorer: { name: "snowtrace", Url: "https://snowtrace.io" } },
	// 250: { currency: "FTM", explorer: { name: "ftmscan", Url: "https://ftmscan.com" } },
};
