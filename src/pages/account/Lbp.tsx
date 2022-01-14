import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Pagination } from "@app/modules/pagination";

import { Button } from "@app/ui/button";
import { Select } from "@app/ui/select";
import { fromWei } from "@app/utils/bn/wei";
import { getProgress, POOL_STATUS } from "@app/utils/otc";
import { getIsOpen } from "@app/utils/time";
import { getBounceOtcContract } from "@app/web3/api/bounce/otc";
import { useTokenSearchWithFallbackService } from "@app/web3/api/tokens/use-fallback-tokens";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./Account.module.scss";
import { fetchMyLBPSearch } from "@app/api/my-lbp/api";
import { ILBPList } from "@app/api/lbp/types";
import BigNumber from "bignumber.js";
import { ToLBPAuctionStatus } from "../lbp/components/AuctionList/AuctionList";
import { Card, DisplayPoolInfoType } from "@app/modules/auction-card";

const WINDOW_SIZE = 9;
const EMPTY_ARRAY = [];

const STATUS_OPTIONS = [
	{
		label: "All",
		key: "all",
	},
	{
		label: "Coming soon",
		key: "comingSoon",
	},
	{
		label: "Live",
		key: "open",
	},
	{
		label: "Closed",
		key: "closed",
	},
];

export const Lbp = () => {
	const chainId = useChainId();
	const { account } = useWeb3React();
	const provider = useWeb3Provider();

	const [page, setPage] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

	const [poolList, setPoolList] = useState<ILBPList[]>([]);

	const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayPoolInfoType[]>(
		[]
	);

	const [checkbox, setCheckbox] = useState<boolean>(false);
	const [status, setStatus] = useState<string>(STATUS_OPTIONS[0].key);

	const type = checkbox ? "created" : "participated";

	useEffect(() => {
		if (!type) {
			return;
		}

		(async () => {
			const {
				data: foundPools,
				meta: { total },
			} = await fetchMyLBPSearch(
				chainId,
				account,
				type,
				{
					page,
					perPage: WINDOW_SIZE,
				},
				status
			);
			setTotalCount(total);
			setPoolList(foundPools);
		})();
	}, [page, chainId, type, account, status]);

	const queryToken = useTokenSearchWithFallbackService();

	const contract = useMemo(() => getBounceOtcContract(provider, chainId), [chainId, provider]);

	useEffect(() => {
		if (!contract) {
			return;
		}

		if (poolList.length > 0) {
			Promise.all(
				poolList.map(async (pool) => {
					const isOpen = getIsOpen(pool?.startTs * 1000);
                    const token0 = {
                        address: pool.token0,
                        coinGeckoID: "",
                        decimals: pool?.token0Decimals,
                        largeURL: pool?.token0LargeURL,
                        name: pool?.token0Symbol,
                        smallURL: pool?.token0SmallURL,
                        symbol: pool?.token0Symbol,
                        thumbURL: pool?.token0ThumbURL,
						chainId: chainId
                    }
                    const token1 = {
                        address: pool.token1,
                        coinGeckoID: "",
                        decimals: pool?.token1Decimals,
                        largeURL: pool?.token1LargeURL,
                        name: pool?.token1Symbol,
                        smallURL: pool?.token1SmallURL,
                        symbol: pool?.token1Symbol,
                        thumbURL: pool?.token1ThumbURL,
						chainId: chainId
                    }
                    const swapAmount = new BigNumber(pool?.startAmountToken0)?.minus(new BigNumber(pool?.currentAmountToken0)).toString()

                    return {
                        status: isOpen ? ToLBPAuctionStatus[pool.status] : POOL_STATUS.COMING,
                        id: pool?.address?.slice(-6),
                        name: `${pool.token0Symbol} Launch Pool`,
                        address: pool.token0,
                        from: token0,
                        to: token1,
                        total: parseFloat(fromWei(pool?.startAmountToken0, token0.decimals).toFixed()),
                        price: pool?.currentPrice,
                        sold: parseFloat(fromWei(swapAmount, token0.decimals).toFixed()),
                        startTs: pool?.startTs,
                        endTs: pool?.endTs,
                        fill: getProgress(swapAmount, pool?.startAmountToken0, token0.decimals),
                        href: `/lbp/${pool?.address}`
                    };
				})
			).then((info) => setConvertedPoolInformation(info));
		} else {
			setConvertedPoolInformation(EMPTY_ARRAY);
		}
	}, [poolList, provider, queryToken]);

	// @ts-ignore
	// @ts-ignore
	return (
		<div>
			<div className={styles.filters}>
				<div className={styles.label}>
					<Button
						onClick={() => setCheckbox(true)}
						className={classNames(styles.toggle, checkbox && styles.checked)}
					>
						Created
					</Button>
					<Button
						onClick={() => setCheckbox(false)}
						className={classNames(styles.toggle, !checkbox && styles.checked)}
					>
						Participated
					</Button>
				</div>
				<Select
					className={styles.select}
					options={STATUS_OPTIONS}
					name="status"
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					small
				/>
			</div>
			{convertedPoolInformation && convertedPoolInformation.length > 0 && (
				<div>
					<ul className={styles.cardList}>
						{convertedPoolInformation.map((auction) => (
							<li key={auction.id} className="animate__animated animate__flipInY">
								<Card {...auction} bordered isLbpCard />
							</li>
						))}
					</ul>
					{numberOfPages > 1 && (
						<Pagination
							className={styles.pagination}
							numberOfPages={numberOfPages}
							currentPage={page}
							onBack={() => setPage(page - 1)}
							onNext={() => setPage(page + 1)}
						/>
					)}
				</div>
			)}
		</div>
	);
};
