import { Pagination } from '@app/modules/pagination'
import { Body1, Caption } from '@app/ui/typography'
import classNames from 'classnames'
import moment from 'moment'
import React, { useState } from 'react'
import { uid } from 'react-uid'
import styles from './ExtensionInfo.module.scss'

// 0: buy  1: sell  2: bid
export enum swapType {
    "Buy",
    "Sell",
    "Bid"
}

const WINDOW_SIZE = 10;
export const AuctionHistoryView = () => {
    const numberOfPages = Math.ceil(35 / WINDOW_SIZE);
    const [page, setPage] = useState(0);
    const auctionHistoryList = [
        {
            time: 'Dec 9, 2021 10:00',
            type: 0,        // 0: buy  1: sell  2: bid
            tokenIn: "MONICA",
            tokenOut: "ETH",
            inAmount: 2000000.10,
            outAmount: 100.05,
            outVolume: 1020,
            price: 0.1050,
            wallet: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'
        },
        {
            time: 'Dec 9, 2021 10:00',
            type: 1,        // 0: buy  1: sell  2: bid
            tokenIn: "ETH",
            tokenOut: "MONICA",
            inAmount: 2000000.10,
            outAmount: 100.05,
            outVolume: 1020,
            price: 0.1050,
            wallet: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'
        },
        {
            time: 'Dec 9, 2021 10:00',
            type: 2,        
            tokenIn: "ETH",
            tokenOut: "MONICA",
            inAmount: 2000000.10,
            outAmount: 100.05,
            outVolume: 1020,
            price: 0.1050,
            wallet: '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735'
        }
    ]

    return (
        <div className={styles.activityInfo}>
            {auctionHistoryList && auctionHistoryList.length > 0 && (
                <div>
                    <div className={styles.head}>
                        <Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
                            Time
                        </Caption>
                        <Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
                            Type
                        </Caption>
                        <Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
                            Amount
                        </Caption>
                        <Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
                            MONICA Price
                        </Caption>
                        <Caption className={styles.cell} Component="span" weight="bold" lighten={50}>
                            Wallet
                        </Caption>
                    </div>
                    <ul className={styles.body}>
                        {auctionHistoryList.map((activity) => (
                            <li key={uid(activity)} className={styles.row}>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    {activity.time}
                                </Body1>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    {`${swapType[activity.type]} ${activity.tokenIn}`}
                                </Body1>
                                <Body1 Component="div" className={styles.amount}>
									<Body1 Component="span">
										<span>{activity.inAmount} {activity.tokenIn}</span>
									</Body1>
									<Body1 Component="span">
										<Body1 className={styles.cellAmount} Component="span">
											<span>{`${activity.outAmount} ${activity.tokenOut}`}</span>&nbsp;
											<span className={styles.cellAmount}>(${activity.outVolume})</span>
										</Body1>
									</Body1>
								</Body1>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    ${activity.price}
                                </Body1>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    {activity.wallet?.slice(0, 6)}...{activity.wallet?.slice(-4)}
                                </Body1>
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
    )
}
