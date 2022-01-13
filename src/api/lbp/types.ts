export interface ILBPList {
	address: string;
	currentAmountToken0: string;
	currentPrice: number;
	endTs: number;
	id: number;
	name: string;
	poolID: string;
	startAmountToken0: string;
	startTs: number;
	status: number;
	token0: string;
	token0Decimals: number;
	token0LargeURL: string;
	token0SmallURL: string;
	token0Symbol: string;
	token0ThumbURL: string;
	token1: string;
	token1Decimals: number;
	token1LargeURL: string;
	token1SmallURL: string;
	token1Symbol: string;
	token1ThumbURL: string;
}

export interface ILBPHistory {
	blockTs: number;
	event: string;
	price: number;
	requestor: string;
	tokenInAddress: string;
	tokenInAmount: string;
	tokenInSymbol: string;
	tokenInVolume: number;
	tokenOutAddress: string;
	tokenOutAmount: string;
	tokenOutSymbol: string;
	tokenOutVolume: number;
	type: number;
}

export interface ILBPDetail {
	address: string;
	creator: string;
	currentAmountToken0: string;
	currentAmountToken1: string;
	currentPrice: number;
	descriptioin: string;
	endTs: number;
	endWeightToken0: number;
	endWeightToken1: number;
	id: number;
	learnMoreLink: string;
	name: string;
	poolID: string;
	startAmountToken0: string;
	startAmountToken1: string;
	startTs: number;
	startWeightToken0: number;
	startWeightToken1: number;
	status: number;
	swapCount: number;
	swapFee: number;
	token0: string;
	token0Decimals: number;
	token0LargeURL: string;
	token0SmallURL: string;
	token0Symbol: string;
	token0ThumbURL: string;
	token1: string;
	token1Decimals: number;
	token1LargeURL: string;
	token1SmallURL: string;
	token1Symbol: string;
	token1ThumbURL: string;
	totalLiquidity: string;
	totalSwapVolume: number;
}
