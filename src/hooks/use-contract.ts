import { getContract } from "@app/web3/contracts/helpers";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { Contract } from "web3-eth-contract";

// returns null on errors
const useContract = <T extends Contract = Contract>(
	address: string | undefined,
	ABI: any
): T | null => {
	const { library } = useWeb3React();

	const canReturnContract = useMemo(() => address && ABI && library, [address, ABI, library]);

	return useMemo(() => {
		if (!canReturnContract) return null;
		try {
			return getContract(library.provider, ABI, address);
		} catch (error) {
			console.error("Failed to get contract", error);
			return null;
		}
	}, [address, ABI, library, canReturnContract]) as T;
};

export default useContract;
