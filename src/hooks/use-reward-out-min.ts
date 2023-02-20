import {
	Token,
	TokenAmount,
	Pair,
	Route,
	TradeType,
	Trade,
	Percent,
	BigintIsh,
	JSBI,
} from "@uniswap/sdk";
import { useAccount, useChainId } from "@app/web3/hooks/use-web3";
import BounceERC20ABI from "@app/web3/api/bounce/BounceERC20.abi.json";
import bounceStake from "@app/web3/api/bounce/BounceStake.abi.json";
import {
	getBotAddress,
	getBotWethPairAddress,
	getStakingAddress,
	getWethAddress,
} from "@app/web3/api/bounce/contractAddress";
import useContract from "./use-contract";
import { useRequest } from "ahooks";

const getMinimumAmountOut = (
	slippage: string,
	chainId: any,
	wethAmountInPair: BigintIsh,
	botAmountInPair: BigintIsh,
	calculatedReward: BigintIsh
) => {
	const WethToken = new Token(chainId, getWethAddress(chainId), 18, "WETH", "Wrapped Ether");
	const BotToken = new Token(chainId, getBotAddress(chainId), 18, "BOT", "BOT-Token");
	const ETH_BOT_PAIR = new Pair(
		new TokenAmount(WethToken, wethAmountInPair),
		new TokenAmount(BotToken, botAmountInPair)
	);

	const ETH_AUCTION_ROUTE = new Route([ETH_BOT_PAIR], WethToken);

	let trade;
	try {
		trade = new Trade(
			ETH_AUCTION_ROUTE,
			new TokenAmount(WethToken, calculatedReward),
			TradeType.EXACT_INPUT
		);
	} catch (error) {
		console.log("Trade error");
	}

	const minimumAmountOut = trade.minimumAmountOut(
		new Percent(String(Math.floor(Number(Number(slippage).toFixed(2)) * 100)), "10000")
	);

	return minimumAmountOut;
};

const useRewardOutMin = () => {
	const chainId = useChainId();
	const account = useAccount();

	const stakingContract = useContract(getStakingAddress(chainId), bounceStake.abi);
	const wethErc20Contract = useContract(getWethAddress(chainId), BounceERC20ABI.abi);
	const botErc20Contract = useContract(getBotAddress(chainId), BounceERC20ABI.abi);

	const request = useRequest(
		async (slippage: string) => {
			if (!stakingContract || !wethErc20Contract || !botErc20Contract) {
				return Promise.reject("no contract");
			}
			if (!account) {
				return Promise.reject("no account");
			}

			const getCalculatedReward: Promise<string> = stakingContract.methods
				.calculateReward(account)
				.call();
			const getWethBalanceInPair: Promise<string> = wethErc20Contract.methods
				.balanceOf(getBotWethPairAddress(chainId))
				.call();
			const getBotBalanceInPair: Promise<string> = botErc20Contract.methods
				.balanceOf(getBotWethPairAddress(chainId))
				.call();

			const [calculatedReward, wethBalanceInPair, botBalanceInPair] = await Promise.all([
				getCalculatedReward,
				getWethBalanceInPair,
				getBotBalanceInPair,
			]);

			const minimumAmountOut = getMinimumAmountOut(
				slippage,
				chainId,
				wethBalanceInPair,
				botBalanceInPair,
				JSBI.divide(JSBI.BigInt(calculatedReward), JSBI.BigInt(2))
			);

			return minimumAmountOut;
		},
		{
			manual: true,
			refreshDeps: [stakingContract, wethErc20Contract, botErc20Contract],
		}
	);

	return request;
};

export default useRewardOutMin;
