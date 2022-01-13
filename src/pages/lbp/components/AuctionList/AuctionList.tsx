

import { fetchLbpList } from '@app/api/lbp/api';
import { POOL_SHORT_NAME_MAPPING, POOL_SPECIFIC_NAME_MAPPING } from '@app/api/pool/const';
import { AUCTION_PATH } from '@app/const/const';
import { Card, DisplayPoolInfoType } from '@app/modules/auction-card';
import { Pagination } from '@app/modules/pagination';
import { ToAuctionStatus, ToAuctionType } from '@app/pages/auction/Auction';
import { DescriptionList } from '@app/ui/description-list';
import { fromWei } from '@app/utils/bn/wei';
import { getProgress, getSwapRatio, POOL_STATUS } from '@app/utils/pool';
import { getIsOpen } from '@app/utils/time';
import { useChainId } from '@app/web3/hooks/use-web3';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { uid } from 'react-uid';
import styles from './auctionList.module.scss';


const EMPTY_ARRAY = [];
const WINDOW_SIZE = 9;

export enum lbpPoolStatus {
    all,
    upcoming,
    live,
    closed
}


export const LBPAuctionList = ({ }) => {
    const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayPoolInfoType[]>([]);
    const [page, setPage] = useState(0);
    const [auctionListData, setAuctionListData] = useState([])
    const [totalCount, setTotalCount] = useState(0);
    const chainId = useChainId();
    const router = useRouter();
    const { pathname } = router;
    const [poolStatus, setPoolStatus] = useState<lbpPoolStatus | undefined>(undefined)
    
    useEffect(() => {
        if(pathname === '/lbp/upcoming') {
            setPoolStatus(1);
        }else if(pathname === '/lbp/live') {
            setPoolStatus(2);
        }else if(pathname === '/lbp/closed') {
            setPoolStatus(3)
        } else {
            setPoolStatus(undefined)
        }
    }, [pathname])

    const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

    useEffect(() => {
        (async () => {
            const {data: lbpList, meta: {total}} = await fetchLbpList(
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

    useEffect(() => {
        if (auctionListData.length > 0) {
            Promise.all(
                auctionListData.map(async (pool) => {
                    const {
                        token0,
                        token1,
                        amountTotal0,
                        amountTotal1,
                        swappedAmount0,
                        openAt,
                    } = pool.poolDetail;
                    const isOpen = getIsOpen(openAt * 1000);
                    const auctionType = ToAuctionType[pool.auctionType];

                    return {
                        status: isOpen ? ToAuctionStatus[pool.status] : POOL_STATUS.COMING,
                        id: +pool.poolID,
                        name: `${pool.name} ${POOL_SPECIFIC_NAME_MAPPING[auctionType]}`,
                        address: token0.address,
                        type: POOL_SHORT_NAME_MAPPING[auctionType],
                        from: token0,
                        to: token1,
                        total: parseFloat(fromWei(amountTotal1, token1.decimals).toFixed()),
                        price: parseFloat(
                            getSwapRatio(amountTotal1, amountTotal0, token1.decimals, token0.decimals)
                        ),
                        fill: getProgress(swappedAmount0, amountTotal0, token0.decimals),
                        href: ``,
                    };
                })
            ).then((info) => setConvertedPoolInformation(info));
        } else {
            setConvertedPoolInformation(EMPTY_ARRAY);
        }
    }, []);

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
        {convertedPoolInformation?.length > 1 && (
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