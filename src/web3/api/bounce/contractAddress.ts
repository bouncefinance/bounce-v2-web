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
