import { Alert, ALERT_TYPE } from '@app/ui/alert'
import { POOL_STATUS } from '@app/utils/pool'
import { CircularProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { View } from './View'
import styles from './LBPDetail.module.scss'



export const LBPDetail = (props: {
    poolID: number
}) => {
    const { back: goBack } = useRouter();

    const progress = 90
    const TokenSold = useMemo(() => {
        return <div className={styles.tokenSold}>
            <CircularProgress thickness={6} style={{
                width: 29, height: 29, color: '#4B70FF', marginRight: 6
            }} variant="determinate" value={progress} />
            <span>{progress}%</span>
        </div>
    }, [])

    return (
        <div>
            <View
                status={POOL_STATUS.LIVE}
                id={props.poolID}
                name={'MONICA Token Launch Auction'}
                openAt={new Date().getTime()}
                closeAt={new Date().getTime() + 1000 * 60 * 60 * 56}
                onZero={() => {
                    // TODO update status
                }}
                onBack={() => goBack()}
                totalVolume={'$ 1,000,000.5'}
                liquidity={'$ 500,000.5'}
                tokenSold={TokenSold}
            >

            </View>
        </div >
    )
}
