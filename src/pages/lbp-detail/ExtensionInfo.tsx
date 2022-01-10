import { TokenInfo } from '@uniswap/token-lists'
import React, { useMemo, useState } from 'react'
import { uid } from 'react-uid'
import { AuctuinDetailView } from './AuctuinDetailView'
import styles from './ExtensionInfo.module.scss'

const TabList = ['Auction Details', 'Auction History (120)', 'Auction Settings（仅卖家可见）']

interface ExtensionInfoParams {
    poolId: number
    tokenFrom: TokenInfo
}

export const ExtensionInfo = ({
    poolId, tokenFrom
}: ExtensionInfoParams) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const renderExtensionContent = useMemo(() => {
        switch (currentIndex) {
            case 0:
                return <AuctuinDetailView
                    tokenFrom={tokenFrom}
                />
            case 1:
                return <div>
                    222
                </div>
            case 2:
                return <div>
                    333
                </div>
            default:
                return <></>
        }
    }, [currentIndex])

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
