

import { fetchLbpList } from '@app/api/lbp/api';
import { ILBPList } from '@app/api/lbp/types';
import { POOL_SHORT_NAME_MAPPING, POOL_SPECIFIC_NAME_MAPPING } from '@app/api/pool/const';
import { AUCTION_PATH } from '@app/const/const';
import { Card, DisplayPoolInfoType } from '@app/modules/auction-card';
import { Pagination } from '@app/modules/pagination';
import { ToAuctionStatus, ToAuctionType } from '@app/pages/auction/Auction';
import { LBPPairData } from '@app/pages/lbp-detail/LBPPairData';
import { DescriptionList } from '@app/ui/description-list';
import { fromWei, toWei, weiToNum } from '@app/utils/bn/wei';
import { getProgress, getSwapRatio, POOL_STATUS } from '@app/utils/pool';
import { getIsOpen } from '@app/utils/time';
import { getLiquidityBootstrappingPoolContract, getVaultContract } from '@app/web3/api/bounce/lbp';
import { useAccount, useChainId, useWeb3Provider } from '@app/web3/hooks/use-web3';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { uid } from 'react-uid';
import styles from './auctionList.module.scss';

export const ToLBPAuctionStatus = {
    1: POOL_STATUS.COMING,
    2: POOL_STATUS.LIVE,
    3: POOL_STATUS.CLOSED,
};


const EMPTY_ARRAY = [];
const WINDOW_SIZE = 9;

export enum lbpPoolStatus {
    all,
    upcoming,
    live,
    closed
}


export const LBPAuctionList = ({ type }: { type: string }) => {
    const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayPoolInfoType[]>([]);
    const [page, setPage] = useState(0);
    const [auctionListData, setAuctionListData] = useState<ILBPList[]>([])
    const [totalCount, setTotalCount] = useState(0);
    const chainId = useChainId();
    const router = useRouter();
    const { pathname } = router;
    const [poolStatus, setPoolStatus] = useState<lbpPoolStatus>()

    useEffect(() => {
        if (pathname === '/lbp/upcoming') {
            setPoolStatus(lbpPoolStatus.upcoming);
        } else if (pathname === '/lbp/live') {
            setPoolStatus(lbpPoolStatus.live);
        } else if (pathname === '/lbp/closed') {
            setPoolStatus(lbpPoolStatus.closed)
        } else {
            setPoolStatus(lbpPoolStatus.all)
        }
    }, [pathname, type])

    const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

    useEffect(() => {
        if (poolStatus === undefined) return
        (async () => {
            const { data: lbpList, meta: { total } } = await fetchLbpList(
                chainId,
                poolStatus,
                {
                    page,
                    perPage: WINDOW_SIZE
                }
            );
            setTotalCount(total);
            setAuctionListData(lbpList)
        })()
    }, [chainId, page, poolStatus])

    const provider = useWeb3Provider();
    const account = useAccount();
    const vaultContract = useMemo(() => getVaultContract(provider, chainId), [chainId, provider]);  // 取amount

    const getCurrentPrice = async (pool: ILBPList) => {
        const lbpPairContract = getLiquidityBootstrappingPoolContract(provider, pool?.address)
        const pairDate = new LBPPairData(lbpPairContract, vaultContract, pool?.address)             // 得到实例，当前时刻的pair-data的信息

        const amountOut = await pairDate._tokenInForExactTokenOut(
            pool?.token0,
            pool?.currentAmountToken0
        )
        const price = new BigNumber(weiToNum(amountOut, pool.token1Decimals)).multipliedBy(1).dp(4).toString();     // TODO  amountOut乘以token1的价格
        return price;
    }

    useEffect(() => {
        if (auctionListData.length > 0) {
            Promise.all(
                auctionListData.map(async (pool) => {
                    const currentPrice = await getCurrentPrice(pool);
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
                        price: Number(currentPrice),
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
    }, [auctionListData, pathname, type]);

    return <div className={styles.listBox}>
        <>
            <ul className={styles.list}>
                {convertedPoolInformation.map((auction) => (
                    <li key={uid(auction)} className="animate__animated animate__flipInY">
                        <Card {...auction}
                            bordered
                            isLbpCard
                        />
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
        </>

    </div>

}