import { FORM_ERROR } from "final-form";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { fetchOTCPoolSearch } from "@app/api/otc/api";
import { fetchPoolSearch } from "@app/api/pool/api";
import { POOL_ADDRESS_MAPPING } from "@app/api/pool/const";

import { useConnectWalletControl } from "@app/modules/connect-wallet-modal";

import { DisplayPoolInfoType } from "@app/pages/auction/ui/card";
import { OTCView } from "@app/pages/otc/OTCView";
import { DisplayOTCInfoType } from "@app/pages/otc/ui/card";
import { getMatchedOTCPool } from "@app/utils/otc";
import { getMatchedPool } from "@app/utils/pool";
import { getBounceOtcContract } from "@app/web3/api/bounce/otc";
import { OTCPoolInfoType, queryOTCPoolInformation } from "@app/web3/api/bounce/otc-search";
import { getBouncePoolContract } from "@app/web3/api/bounce/pool";
import { PoolInfoType, queryPoolInformation } from "@app/web3/api/bounce/pool-search";
import { useTokenQuery } from "@app/web3/api/tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

const WINDOW_SIZE = 9;

const tryParseJSON = (tryThis: string, orThis: any): any => {
	try {
		return JSON.parse(tryThis);
	} catch (e) {
		return orThis;
	}
};

const EMPTY_ARRAY = [];

type SearchFilters = any;

const useURLControl = (
	searchFilters: SearchFilters,
	provider: any,
	onSubmit: (state: any) => void
) => {
	const router = useRouter();

	// update URL
	useEffect(
		() => {
			const { auctionType, ...rest } = searchFilters;

			if (auctionType) {
				const isEmpty = Object.keys(rest).length === 0;

				const filters = isEmpty ? "" : `?filters=${encodeURIComponent(JSON.stringify(rest))}`;

				router.push(`/auction/${auctionType}/${filters}`, undefined, {
					shallow: true,
				});
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[searchFilters]
	);

	// initial form state
	const [initialSearchState] = useState(() => {
		try {
			return {
				...tryParseJSON(decodeURIComponent(router.query.filters as string), {}),
				auctionType: router.query.auctionType,
			};
		} catch (e) {
			console.error(e);

			return {};
		}
	});

	const [fistView, setFirstView] = useState(true);

	if (fistView && !searchFilters.auctionType && initialSearchState.auctionType && provider) {
		// back button
		setFirstView(false);
		onSubmit(initialSearchState);
	}

	// read URL
	useEffect(
		() => {
			if (initialSearchState.auctionType && provider && fistView) {
				onSubmit(initialSearchState);
				setFirstView(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[provider]
	);

	return initialSearchState;
};

const LAST_QUERY = {
	condition: -1,
	page: 0,
	searchFilters: null as any,
	poolList: [] as any,
	poolInformation: [] as any,
	convertedPoolInformation: [] as any,
};

const useLastQuery = <T extends Record<string, any>>(q: T, params: T) => {
	useEffect(() => {
		Object.assign(q, params);
	}, Object.values(params));
};

export const OTC = () => {
	const provider = useWeb3Provider();
	const chainId = useChainId();
	const walletControl = useConnectWalletControl();

	const [poolList, setPoolList] = useState<number[]>([]);
	const [poolInformation, setPoolInformation] = useState<OTCPoolInfoType[]>([]);
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
	const [page, setPage] = useState(0);
	const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayOTCInfoType[]>(
		[]
	);

	useLastQuery(LAST_QUERY, {
		condition: searchFilters,
		poolList,
		poolInformation,
		convertedPoolInformation,
		searchFilters,
		page,
	});

	const onSubmit = async (values: any) => {
		if (!provider) {
			if (!(await walletControl.requestAuthorization())) {
				return {
					[FORM_ERROR]: "Please connect web3",
				};
			}
		}

		if (JSON.stringify(LAST_QUERY.condition) === JSON.stringify(values)) {
			setSearchFilters(LAST_QUERY.searchFilters);
			setPoolList(LAST_QUERY.poolList);
			setPage(LAST_QUERY.page);
			setPoolInformation(LAST_QUERY.poolInformation);
			setConvertedPoolInformation(LAST_QUERY.convertedPoolInformation);

			return;
		}

		setSearchFilters(values);
		setPage(0);

		const { otcType, ...params } = values;

		const pools = await fetchOTCPoolSearch(chainId, otcType, params);
		setPoolList(pools);
	};

	const searchWindow = useMemo(() => poolList.slice(page * WINDOW_SIZE, (page + 1) * WINDOW_SIZE), [
		poolList,
		page,
	]);

	// search
	useEffect(() => {
		(async () => {
			if (searchWindow.length === 0) {
				setPoolInformation([]);

				return;
			}

			const pools = await queryOTCPoolInformation(provider, chainId, searchWindow);
			setPoolInformation(pools.filter(Boolean));
		})();
	}, [chainId, searchWindow, provider, searchFilters]);

	const queryToken = useTokenQuery();

	useEffect(() => {
		const { otcType } = searchFilters;

		if (poolInformation.length > 0) {
			Promise.all(
				poolInformation.map(async (pool) => {
					const from = await queryToken(pool.token0);
					const to = await queryToken(pool.token1);

					const contract = getBounceOtcContract(provider, chainId);

					const matchedPool = await getMatchedOTCPool(contract, from, to, pool, pool.poolID);

					return {
						...matchedPool,
						href: `/otc/${otcType}/${pool.poolID}`,
					};
				})
			).then((info) => setConvertedPoolInformation(info));
		} else {
			setConvertedPoolInformation(EMPTY_ARRAY);
		}
	}, [
		chainId,
		poolInformation,
		provider,
		queryToken,
		searchFilters,
		searchFilters.otcType,
		setConvertedPoolInformation,
	]);

	const initialSearchState = useURLControl(searchFilters, provider, onSubmit);

	return (
		<OTCView
			onSubmit={onSubmit}
			result={poolInformation.length ? convertedPoolInformation : undefined}
			initialSearchState={initialSearchState}
			currentPage={page}
			numberOfPages={Math.floor(poolList.length / WINDOW_SIZE)}
			onBack={() => setPage(page - 1)}
			onNext={() => setPage(page + 1)}
		/>
	);
};
