export interface ILBPList {
	address: string;
	currentAmountToken0: string;
	currentPrice: 0;
	endTs: 0;
	id: 0;
	name: string;
	poolID: string;
	startAmountToken0: string;
	startTs: 0;
	status: 0;
	token0: string;
	token0Decimals: 0;
	token0LargeURL: string;
	token0SmallURL: string;
	token0Symbol: string;
	token0ThumbURL: string;
	token1: string;
	token1Decimals: 0;
	token1LargeURL: string;
	token1SmallURL: string;
	token1Symbol: string;
	token1ThumbURL: string;
}

export interface ILBPHistory {
	blockTs: 0;
	event: string;
	requestor: string;
	tokenInAddress: string;
	tokenInAmount: string;
	tokenInSymbol: string;
	tokenInVolume: 0;
	tokenOutAddress: string;
	tokenOutAmount: string;
	tokenOutSymbol: string;
	tokenOutVolume: 0;
	type: 0;
}
