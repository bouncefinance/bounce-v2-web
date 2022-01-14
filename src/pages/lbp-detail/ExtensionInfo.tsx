import { TokenInfo } from '@uniswap/token-lists'
import React, { useMemo, useState } from 'react'
import { uid } from 'react-uid'
import { AuctionHistoryView } from './AuctionHistoryView'
import { AuctionSettingView } from './AuctionSettingView'
import { AuctuinDetailView } from './AuctuinDetailView'
import styles from './ExtensionInfo.module.scss'
import { OPERATION } from './LBPDetail'

const TabList = ['Auction Details', 'Auction History (120)', 'Auction Settings（仅卖家可见）']

interface ExtensionInfoParams {
    poolId: number
    tokenFrom: TokenInfo
    setOperation: React.Dispatch<React.SetStateAction<OPERATION>>,
    poolAddress: string
}

export const ExtensionInfo = ({
    poolId, tokenFrom, setOperation, poolAddress
}: ExtensionInfoParams) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const renderExtensionContent = useMemo(() => {
        switch (currentIndex) {
            case 0:
                return tokenFrom && <AuctuinDetailView
                    tokenFrom={tokenFrom}
                />
            case 1:
                return <AuctionHistoryView poolAddress={poolAddress} />
            case 2:
                return <AuctionSettingView
                    setOperation={setOperation}
                    poolAddress={poolAddress}
                />
            default:
                return <></>
        }
    }, [currentIndex, tokenFrom])

    return (
        <div className={styles.extensionWrapper}>
            <ul className={styles.tabList}>
                {TabList.map((tabName, index) => (
                    <li
                        key={uid(tabName)}
                        className={currentIndex === index ? styles.active : ''}
                        onClick={() => {
                            setCurrentIndex(index)
                        }}
                    >
                        {tabName}
                    </li>
                ))}
            </ul>

            {renderExtensionContent}
        </div>
    )
}
