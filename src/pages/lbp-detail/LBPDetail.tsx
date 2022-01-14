import { Alert, ALERT_TYPE } from '@app/ui/alert'
import { POOL_STATUS } from '@app/utils/pool'
import { CircularProgress } from '@material-ui/core'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { View } from './View'
import styles from './LBPDetail.module.scss'
import { Swap } from './Swap'
import { useTokenQuery, useTokenSearch } from '@app/web3/api/tokens'
import { isEth } from '@app/web3/api/eth/use-eth'
import { getBalance, getEthBalance, getTokenContract } from '@app/web3/api/bounce/erc'
import { useChainId, useWeb3, useWeb3Provider } from '@app/web3/hooks/use-web3'
import { fromWei } from '@app/utils/bn/wei'
import { useWeb3React } from '@web3-react/core'
import { ExtensionInfo } from './ExtensionInfo'
import { useControlPopUp } from '@app/hooks/use-control-popup'
import { ProcessingPopUp } from '@app/modules/processing-pop-up'
import { CONTENT, TITLE } from '../farm/stakingModal'
import { fetchLbpDetail } from '@app/api/lbp/api'
import { ILBPDetail } from '@app/api/lbp/types'
import { getLiquidityBootstrappingPoolContract, getVaultContract } from '@app/web3/api/bounce/lbp'
import { LBPPairData } from './LBPPairData'
import { TokenInfo } from '@uniswap/token-lists'

export enum OPERATION {
    default = "default",
    approval = "approval",
    confirm = "confirm",
    pending = "pending",
    success = "success",
    error = "error",
    cancel = "cancel",
}

export const LBPDetail = (props: {
    poolAddress: string
}) => {
    const provider = useWeb3Provider();
    const web3 = useWeb3()
    const findToken = useTokenSearch();
    const queryToken = useTokenQuery()
    const { account } = useWeb3React()
    const { back: goBack } = useRouter();
    const { popUp, close, open } = useControlPopUp();
    const [operation, setOperation] = useState(OPERATION.default);
    const chainId = useChainId();
    const [detailData, setDetailData] = useState<ILBPDetail | null>(null)
    const [token0, setToken0] = useState<TokenInfo>()
    const [token1, setToken1] = useState<TokenInfo>()
    console.log('detailData', detailData)

    const progress = 90

    useEffect(() => {
        (async () => {
            const { data } = await fetchLbpDetail(chainId, props.poolAddress);
            setDetailData(data)

            setToken0(findToken(data.token0) || await queryToken(data.token0))
            setToken1(findToken(data.token1) || await queryToken(data.token1))
        })();
    }, [chainId, props.poolAddress])

    const TokenSold = useMemo(() => {
        return <div className={styles.tokenSold}>
            <CircularProgress thickness={6} style={{
                width: 29, height: 29, color: '#4B70FF', marginRight: 6
            }} variant="determinate" value={progress} />
            <span>{progress}%</span>
        </div>
    }, [])


    const [token0Amount, setToken0Amount] = useState(0)
    const [token1Amount, setToken1Amount] = useState(0)

    useEffect(() => {
        if (operation !== OPERATION.default) {
            open();
        }
    }, [open, operation]);

    useEffect(() => {
        if (!token0 || !token1) {
            return;
        }
        if (!isEth(token0.address)) {
            getBalance(getTokenContract(provider, token0.address), account).then((b) =>
                setToken0Amount(parseFloat(fromWei(b, token0.decimals).toFixed(6, 1)))
            );
        } else {
            getEthBalance(web3, account).then((b) =>
                setToken0Amount(parseFloat(fromWei(b, token0.decimals).toFixed(4, 1)))
            );
        }

        if (!isEth(token1.address)) {
            getBalance(getTokenContract(provider, token1.address), account).then((b) =>
                setToken1Amount(parseFloat(fromWei(b, token1.decimals).toFixed(6, 1)))
            );
        } else {
            getEthBalance(web3, account).then((b) =>
                setToken1Amount(parseFloat(fromWei(b, token1.decimals).toFixed(4, 1)))
            );
        }
    }, [web3, getTokenContract, account, token1, token0]);


    return (
        <div>
            <View
                status={POOL_STATUS.LIVE}
                id={+detailData?.poolID}
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
                extension={<ExtensionInfo
                    poolId={+detailData?.poolID}
                    tokenFrom={token0}
                    setOperation={setOperation}
                    poolAddress={props.poolAddress}
                />}
                detailData={detailData}
            >
                {token0 && token1 && <Swap
                    token0={token0}
                    token1={token1}
                    token0Amount={token0Amount}
                    token1Amount={token1Amount}
                    setOperation={setOperation}
                    poolAddress={props.poolAddress}
                />}
            </View>
            {popUp.defined ? (
                <ProcessingPopUp
                    title={TITLE[operation]}
                    text={CONTENT[operation]}
                    onSuccess={() => {
                        // routerPush(`${LBP_PATH}/${poolId}`);
                        setOperation(OPERATION.default);
                        close();
                    }}
                    // onTry={tryAgainAction}
                    isSuccess={operation === OPERATION.success}
                    isLoading={
                        operation === OPERATION.approval ||
                        operation === OPERATION.pending ||
                        operation === OPERATION.confirm
                    }
                    isError={operation === OPERATION.error || operation === OPERATION.cancel}
                    control={popUp}
                    close={() => {
                        close();
                        setOperation(OPERATION.default);
                    }}
                />
            ) : undefined}
        </div >
    )
}
