import { WEB3_NETWORKS } from "@app/web3/networks/const";
import { defineNetworkMapper } from "@app/web3/networks/utils";

export const getAPIByNetwork = defineNetworkMapper({
	[WEB3_NETWORKS.ETH]: "https://api-bcf-3.bounce.finance/v3/eth",
	[WEB3_NETWORKS.RINKEBY]: "https://api-bcf-3.bounce.finance/v3/rinkeby",
	[WEB3_NETWORKS.BINANCE]: "https://api-bcf-3.bounce.finance/v3/bsc",
	[WEB3_NETWORKS.POLYGON]: "https://api-bcf-3.bounce.finance/v3/polygon",
	[WEB3_NETWORKS.ARBITRUM]: "https://api-bcf-3.bounce.finance/v3/arbitrum",
	[WEB3_NETWORKS.FANTOM]: "https://api-bcf-3.bounce.finance/v3/fantom",
	[WEB3_NETWORKS.SYSCOIN]: "https://api-bcf-3.bounce.finance/v3/syscoin",
	// [WEB3_NETWORKS.SyscoinTestnet]: "https://api-bcf-3.bounce.finance/v3/syscoin-testnet",
	// [WEB3_NETWORKS.AVALANCHE]: "https://api-bcf-3.bounce.finance/v3/avalanche",
	// [WEB3_NETWORKS.DOGECHAIN]: "https://api-bcf-3.bounce.finance/v3/doge_mainnet_test", // 主网测试环境接口地址
	[WEB3_NETWORKS.DOGECHAIN]: "https://api-bcf-3.bounce.finance/v3/doge", // 主网正式环境接口地址
});
