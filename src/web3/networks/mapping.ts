import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { defineNetworkMapper } from "./utils";

const getFixSwapAddress = defineNetworkMapper({
	[WEB3_NETWORKS.ETH]: "0x430464cf07Ab9cF4c1c9907d518E1f45E3B80409",
	[WEB3_NETWORKS.RINKEBY]: "0xE4978408e5D281359eb584b1c6E867e0c3004F63",
	[WEB3_NETWORKS.BINANCE]: "0x50809bA1Cac76e9C73F5C0c77bB7AfeB03Ac1600",
	[WEB3_NETWORKS.POLYGON]: "0x94aCe08a344efa23Ac118AA94A66A8D699E8a1A1",
	[WEB3_NETWORKS.ARBITRUM]: "0x94E7d2a17EAA6A86DFD2Fddb639F9878d8377CC7",
	// [WEB3_NETWORKS.AVALANCHE]: "0x01096E802a1f6798173f2b876fbc6A8D423D8bdD",
	[WEB3_NETWORKS.FANTOM]: "0x94E7d2a17EAA6A86DFD2Fddb639F9878d8377CC7",
	[WEB3_NETWORKS.SYSCOIN]: "0x94E7d2a17EAA6A86DFD2Fddb639F9878d8377CC7",
	// [WEB3_NETWORKS.SyscoinTestnet]: "0x0A6318AB6B0C414679c0eB6a97035f4a3ef98606",
	// [WEB3_NETWORKS.DOGECHAIN]: "0x264D087C20761A565524212237cB762e0D86cE25", // 狗链主网测试环境合约
	[WEB3_NETWORKS.DOGECHAIN]: "0x5b5E07c8c05489CD0D2227AfA816478cD039c624", // 狗链主网正式环境合约
});

const getOtcAddress = defineNetworkMapper({
	[WEB3_NETWORKS.ETH]: "0x4EB49d9AF90eaF6E802614Ea2514A1c461E4e6D9",
	[WEB3_NETWORKS.RINKEBY]: "0xBc33883dB4433412f54212AeE34Bd9b53B877C4C",
	[WEB3_NETWORKS.BINANCE]: "0x959A59eeAe43cc67e73b3265994E6de1ebF3E46c",
	[WEB3_NETWORKS.POLYGON]: "0x94E7d2a17EAA6A86DFD2Fddb639F9878d8377CC7",
	[WEB3_NETWORKS.ARBITRUM]: "0x94aCe08a344efa23Ac118AA94A66A8D699E8a1A1",
	// [WEB3_NETWORKS.AVALANCHE]: "0x194C02845d77ffCB8580D474Ca99013073C1eAb1",
	[WEB3_NETWORKS.FANTOM]: "0x94aCe08a344efa23Ac118AA94A66A8D699E8a1A1",
	[WEB3_NETWORKS.SYSCOIN]: "0x94aCe08a344efa23Ac118AA94A66A8D699E8a1A1",
	// [WEB3_NETWORKS.SyscoinTestnet]: "0x94796Ee977b6759209b9c69Ee872848168f50123",
	// [WEB3_NETWORKS.DOGECHAIN]: "0xC7F6Ed92aEd2b70892FF978cd93b887E206B9e72", // 狗链主网测试环境合约
	[WEB3_NETWORKS.DOGECHAIN]: "0x167544766d084a048d109ad0e1d95b19198c5af1", // 狗链主网正式环境合约
});

const getBounceProxyAddress = defineNetworkMapper({
	[WEB3_NETWORKS.ETH]: "0x8c4a7df4e50b4538f425050fb033566adf35f5c4",
	[WEB3_NETWORKS.RINKEBY]: "0x7d845541f5fFcB81c0846814870De164bDe8d4E7",
	[WEB3_NETWORKS.BINANCE]: "",
	[WEB3_NETWORKS.POLYGON]: "",
	[WEB3_NETWORKS.ARBITRUM]: "",
	[WEB3_NETWORKS.FANTOM]: "",
	[WEB3_NETWORKS.SYSCOIN]: "",
	// [WEB3_NETWORKS.SyscoinTestnet]: "",
	[WEB3_NETWORKS.DOGECHAIN]: "0x87d811661BB10Af6D236b5458Eeb2f4614723FB8",
});

const getVaultAddress = defineNetworkMapper({
	[WEB3_NETWORKS.ETH]: "0xba12222222228d8ba445958a75a0704d566bf2c8",
	[WEB3_NETWORKS.RINKEBY]: "0xba12222222228d8ba445958a75a0704d566bf2c8",
	[WEB3_NETWORKS.BINANCE]: "",
	[WEB3_NETWORKS.POLYGON]: "",
	[WEB3_NETWORKS.ARBITRUM]: "",
	[WEB3_NETWORKS.FANTOM]: "",
	[WEB3_NETWORKS.SYSCOIN]: "",
	// [WEB3_NETWORKS.SyscoinTestnet]: "",
	[WEB3_NETWORKS.DOGECHAIN]: "",
});

export enum ADDRESS_MAPPING {
	FIX_SWAP,
}

export const getChainAddressMapping = (target: ADDRESS_MAPPING, chainId: WEB3_NETWORKS) => {
	switch (target) {
		case ADDRESS_MAPPING.FIX_SWAP:
			return getFixSwapAddress(chainId);
	}
};

export const getOtcChainAddressMapping = (chainId: WEB3_NETWORKS) => {
	return getOtcAddress(chainId);
};

export const getBounceProxyChainAddressMapping = (chainId: WEB3_NETWORKS) => {
	return getBounceProxyAddress(chainId);
};

export const getVaultChainAddressMapping = (chainId: WEB3_NETWORKS) => {
	return getVaultAddress(chainId);
};
