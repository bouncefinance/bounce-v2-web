export enum POOL_TYPE {
	any = "any",
	fixed = "fixed",
	sealed_bid = "sealed_bid",
	english = "english",
	dutch = "dutch",
	lottery = "lottery",
}

export const POOL_NAME_MAPPING = {
	all: "All",
	[POOL_TYPE.fixed]: "Fixed Swap Auction",
	[POOL_TYPE.sealed_bid]: "Sealed-Bid Auction",
	[POOL_TYPE.english]: "English Auction",
	[POOL_TYPE.dutch]: "Dutch Auction",
	[POOL_TYPE.lottery]: "Lottery Auction",
};
