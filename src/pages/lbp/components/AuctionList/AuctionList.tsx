

import { POOL_SHORT_NAME_MAPPING, POOL_SPECIFIC_NAME_MAPPING } from '@app/api/pool/const';
import { AUCTION_PATH } from '@app/const/const';
import { Card, DisplayPoolInfoType } from '@app/modules/auction-card';
import { Pagination } from '@app/modules/pagination';
import { ToAuctionStatus, ToAuctionType } from '@app/pages/auction/Auction';
import { DescriptionList } from '@app/ui/description-list';
import { fromWei } from '@app/utils/bn/wei';
import { getProgress, getSwapRatio, POOL_STATUS } from '@app/utils/pool';
import { getIsOpen } from '@app/utils/time';
import { useEffect, useState } from 'react';
import { uid } from 'react-uid';
import styles from './auctionList.module.scss';


const EMPTY_ARRAY = [];
const WINDOW_SIZE = 9;


export const AuctionList = ({ }) => {
    const [convertedPoolInformation, setConvertedPoolInformation] = useState<DisplayPoolInfoType[]>([]);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(15);

    const numberOfPages = Math.ceil(totalCount / WINDOW_SIZE);

    const auctionListData = [
        {
            "id": 19,
            "contractHeight": 9943371,
            "contractTxHash": "0x9f03fb12b6b5e7d9e4081ce8d86c6a9480a74661c5f34d9094ae7d2c03bbaf36",
            "contract": "0xe4978408e5d281359eb584b1c6e867e0c3004f63",
            "businessType": 2,
            "auctionType": 1,
            "category": 2,
            "poolID": "18",
            "creator": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "name": "JJ-01",
            "auctioneer": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "status": 1,
            "poolDetail": {
                "id": 19,
                "poolID": "18",
                "token0": {
                    "address": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                    "decimals": 18,
                    "name": "Dai Stablecoin",
                    "symbol": "DAI",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "token1": {
                    "address": "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
                    "decimals": 18,
                    "name": "Basic Attention Token",
                    "symbol": "BAT",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "amountTotal0": "1000000000000000000",
                "amountTotal1": "500000000000000000",
                "swappedAmount0": "1000000000000000000",
                "currentTotal0": "0",
                "currentTotal1": "0",
                "openAt": 1641463200,
                "closedAt": 1641465600,
                "claimedAt": 0,
                "enableWhiteList": 0,
                "creatorClaimed": false
            },
            "participants": null
        },
        {
            "id": 18,
            "contractHeight": 9941786,
            "contractTxHash": "0x3af49b61582bddbd33786d9e2aa490ed911d9aed2c0eaa0e99fd3910b2f25292",
            "contract": "0xe4978408e5d281359eb584b1c6e867e0c3004f63",
            "businessType": 2,
            "auctionType": 1,
            "category": 2,
            "poolID": "17",
            "creator": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "name": "ZZ-0106-01",
            "auctioneer": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "status": 0,
            "poolDetail": {
                "id": 18,
                "poolID": "17",
                "token0": {
                    "address": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                    "decimals": 18,
                    "name": "Dai Stablecoin",
                    "symbol": "DAI",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "token1": {
                    "address": "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
                    "decimals": 18,
                    "name": "Basic Attention Token",
                    "symbol": "BAT",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "amountTotal0": "1000000000000000000",
                "amountTotal1": "500000000000000000",
                "swappedAmount0": "0",
                "currentTotal0": "1000000000000000000",
                "currentTotal1": "0",
                "openAt": 1641798369,
                "closedAt": 1641830400,
                "claimedAt": 0,
                "enableWhiteList": 0,
                "creatorClaimed": false
            },
            "participants": null
        },
        {
            "id": 17,
            "contractHeight": 9938716,
            "contractTxHash": "0xcf6819e43afb1c9ef322fbaa6a5a538e1bd65d2874abe33f25775d7baa0418fa",
            "contract": "0xe4978408e5d281359eb584b1c6e867e0c3004f63",
            "businessType": 2,
            "auctionType": 1,
            "category": 2,
            "poolID": "16",
            "creator": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "name": "ZZ-220105-07",
            "auctioneer": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "status": 2,
            "poolDetail": {
                "id": 17,
                "poolID": "16",
                "token0": {
                    "address": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                    "decimals": 18,
                    "name": "Dai Stablecoin",
                    "symbol": "DAI",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "token1": {
                    "address": "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
                    "decimals": 18,
                    "name": "Basic Attention Token",
                    "symbol": "BAT",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "amountTotal0": "1000000000000000000",
                "amountTotal1": "5000000000000000",
                "swappedAmount0": "1000000000000000000",
                "currentTotal0": "0",
                "currentTotal1": "0",
                "openAt": 1641193569,
                "closedAt": 1641393720,
                "claimedAt": 0,
                "enableWhiteList": 0,
                "creatorClaimed": false
            },
            "participants": null
        },
        {
            "id": 19,
            "contractHeight": 9943371,
            "contractTxHash": "0x9f03fb12b6b5e7d9e4081ce8d86c6a9480a74661c5f34d9094ae7d2c03bbaf36",
            "contract": "0xe4978408e5d281359eb584b1c6e867e0c3004f63",
            "businessType": 2,
            "auctionType": 1,
            "category": 2,
            "poolID": "18",
            "creator": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "name": "JJ-01",
            "auctioneer": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "status": 1,
            "poolDetail": {
                "id": 19,
                "poolID": "18",
                "token0": {
                    "address": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                    "decimals": 18,
                    "name": "Dai Stablecoin",
                    "symbol": "DAI",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "token1": {
                    "address": "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
                    "decimals": 18,
                    "name": "Basic Attention Token",
                    "symbol": "BAT",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "amountTotal0": "1000000000000000000",
                "amountTotal1": "500000000000000000",
                "swappedAmount0": "1000000000000000000",
                "currentTotal0": "0",
                "currentTotal1": "0",
                "openAt": 1641463200,
                "closedAt": 1641465600,
                "claimedAt": 0,
                "enableWhiteList": 0,
                "creatorClaimed": false
            },
            "participants": null
        },
        {
            "id": 18,
            "contractHeight": 9941786,
            "contractTxHash": "0x3af49b61582bddbd33786d9e2aa490ed911d9aed2c0eaa0e99fd3910b2f25292",
            "contract": "0xe4978408e5d281359eb584b1c6e867e0c3004f63",
            "businessType": 2,
            "auctionType": 1,
            "category": 2,
            "poolID": "17",
            "creator": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "name": "ZZ-0106-01",
            "auctioneer": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "status": 0,
            "poolDetail": {
                "id": 18,
                "poolID": "17",
                "token0": {
                    "address": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                    "decimals": 18,
                    "name": "Dai Stablecoin",
                    "symbol": "DAI",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "token1": {
                    "address": "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
                    "decimals": 18,
                    "name": "Basic Attention Token",
                    "symbol": "BAT",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "amountTotal0": "1000000000000000000",
                "amountTotal1": "500000000000000000",
                "swappedAmount0": "0",
                "currentTotal0": "1000000000000000000",
                "currentTotal1": "0",
                "openAt": 1641798369,
                "closedAt": 1641830400,
                "claimedAt": 0,
                "enableWhiteList": 0,
                "creatorClaimed": false
            },
            "participants": null
        },
        {
            "id": 17,
            "contractHeight": 9938716,
            "contractTxHash": "0xcf6819e43afb1c9ef322fbaa6a5a538e1bd65d2874abe33f25775d7baa0418fa",
            "contract": "0xe4978408e5d281359eb584b1c6e867e0c3004f63",
            "businessType": 2,
            "auctionType": 1,
            "category": 2,
            "poolID": "16",
            "creator": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "name": "ZZ-220105-07",
            "auctioneer": "0xCF1a357f1507154fCd65936B26d39511122A6147",
            "status": 2,
            "poolDetail": {
                "id": 17,
                "poolID": "16",
                "token0": {
                    "address": "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
                    "decimals": 18,
                    "name": "Dai Stablecoin",
                    "symbol": "DAI",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "token1": {
                    "address": "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99",
                    "decimals": 18,
                    "name": "Basic Attention Token",
                    "symbol": "BAT",
                    "thumbURL": "",
                    "smallURL": "",
                    "largeURL": "",
                    "coinGeckoID": "",
                    "currentPrice": 0
                },
                "amountTotal0": "1000000000000000000",
                "amountTotal1": "5000000000000000",
                "swappedAmount0": "1000000000000000000",
                "currentTotal0": "0",
                "currentTotal1": "0",
                "openAt": 1641193569,
                "closedAt": 1641393720,
                "claimedAt": 0,
                "enableWhiteList": 0,
                "creatorClaimed": false
            },
            "participants": null
        }
    ]

    useEffect(() => {
        debugger
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