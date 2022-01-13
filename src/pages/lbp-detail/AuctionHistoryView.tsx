import { fetchLbpHistory } from '@app/api/lbp/api'
import { ILBPHistory } from '@app/api/lbp/types'
import { Pagination } from '@app/modules/pagination'
import { Body1, Caption } from '@app/ui/typography'
import { useChainId } from '@app/web3/hooks/use-web3'
import classNames from 'classnames'
import moment from 'moment'
import path from 'path'
import React, { useEffect, useState } from 'react'
import { uid } from 'react-uid'
import { getActivity } from '../account/utils'
import styles from './ExtensionInfo.module.scss'

const WINDOW_SIZE = 10;
export interface IAuctionHistoryViewProps {
    poolAddress: string;
}

export const AuctionHistoryView = ({poolAddress} : IAuctionHistoryViewProps) => {
    const [page, setPage] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState<number>(0)
    const chainId = useChainId();
    const [historyList, setHistoryList] = useState<ILBPHistory[]>([])

    useEffect(() => {
        (async () => {
            const {
                data: historyData,
                meta: {total}
            } = await fetchLbpHistory(chainId, poolAddress, {page: page, perPage: WINDOW_SIZE})
            setHistoryList(historyData);
            setNumberOfPages(Math.ceil(total / WINDOW_SIZE))
        })();
        
    }, [chainId, page])



    return (
        <div className={styles.activityInfo}>
            {historyList && historyList.length > 0 && (
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
                        {historyList.map((activity) => (
                            <li key={uid(activity)} className={styles.row}>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    {moment(activity.blockTs).format('MMM DD,YYYY HH:mm')}
                                </Body1>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    {getActivity(activity.type, activity.tokenInSymbol)}
                                </Body1>
                                <Body1 Component="div" className={styles.amount}>
									<Body1 Component="span">
										<span>{activity.tokenInAmount} {activity.tokenInSymbol}</span>
									</Body1>
									<Body1 Component="span">
										<Body1 className={styles.cellAmount} Component="span">
											<span>{`${activity.tokenOutAmount} ${activity.tokenOutSymbol}`}</span>&nbsp;
											<span className={styles.cellAmount}>(${activity.tokenOutVolume})</span>
										</Body1>
									</Body1>
								</Body1>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    ${activity?.price}
                                </Body1>
                                <Body1
                                    className={styles.cell}
                                    Component="span"
                                >
                                    {activity.requestor?.slice(0, 6)}...{activity.requestor?.slice(-4)}
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
