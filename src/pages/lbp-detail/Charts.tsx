import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as echarts from 'echarts';
import styles from './View.module.scss'
import { getDateSlice, getOption, getPriceSlice } from "./chartDate";
import { fetchLbpChartData } from "@app/api/lbp/api";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";
import { getLiquidityBootstrappingPoolContract, getVaultContract } from "@app/web3/api/bounce/lbp";
import { LBPPairData } from "./LBPPairData";
import { CORRECTORDER, ILBPDetail } from "@app/api/lbp/types";
import { weiToNum } from "@app/utils/bn/wei";

// const SLICE = 10


interface IChartsParams {
    amountTokenFrom: number
    amountTokenTo: number
    startWeight: number
    endWeight: number
    startDate: Date
    endDate: Date
    tokenToPrice: number,
    detailData: ILBPDetail
}

export const Charts: FC<IChartsParams> = ({
    amountTokenFrom,
    amountTokenTo,
    startWeight,
    endWeight,
    startDate,
    endDate,
    tokenToPrice,
    detailData
}) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [dateSlice, setDateSlice] = useState(getDateSlice())
    const [beforeSlice, setBeforeSlice] = useState([])
    const [afterSlice, setAfterSlice] = useState([])
    const chainId = useChainId()
    const provider = useWeb3Provider();

    const vaultContract = useMemo(() => getVaultContract(provider, chainId), [chainId, provider]);
    const lbpPairContract = useMemo(() => getLiquidityBootstrappingPoolContract(provider, detailData.address), [provider, detailData.address]);
    const pairDate = new LBPPairData(lbpPairContract, vaultContract, detailData.address)

    useEffect(() => {
        const SLICE = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 3600000)
        const dateSlice = getDateSlice(startDate, endDate, SLICE)
        setDateSlice(dateSlice)
        // console.log('currentWeights0', SLICE)
    }, [startDate, endDate])

    useEffect(() => {
        if (!chainId) return
        (async () => {
            const beforeSliceData = await fetchLbpChartData(chainId, detailData.address)
            const BEFORE_SLICE = Math.ceil((new Date().getTime() - new Date(startDate).getTime()) / 3600000) - 1
            const beforeDateSlice = getDateSlice(startDate, new Date(), BEFORE_SLICE)

            console.log('beforeDateSlice', beforeDateSlice)
            const _beforeSlice: any[] = beforeDateSlice.fill(0.1)

            const weights = await pairDate.getTokensWeight()
            const currentWeight = Number(weiToNum(weights[detailData.isCorrectOrder === CORRECTORDER.true ? 0 : 1], detailData.token0Decimals)) * 100
            const amounts = await pairDate.getTokensAmount()
            const currentAmountTokenFrom = detailData.isCorrectOrder === CORRECTORDER.true ? Number(weiToNum(amounts[0], detailData.token0Decimals)) : Number(weiToNum(amounts[1], detailData.token1Decimals))
            const currentAmountTokenTo = detailData.isCorrectOrder === CORRECTORDER.true ? Number(weiToNum(amounts[1], detailData.token1Decimals)) : Number(weiToNum(amounts[0], detailData.token0Decimals))
            const AFTER_SLICE = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / 3600000)
            const afterDateSlice = getDateSlice(new Date(), endDate, AFTER_SLICE)
            const _afterSliceData = await getPriceSlice(afterDateSlice, currentAmountTokenFrom, currentAmountTokenTo, currentWeight, endWeight, tokenToPrice)

            const beforeSlice: any[] = [..._beforeSlice, ...[..._afterSliceData].fill('_', 0, _afterSliceData.length)]
            const afterSlice = [...[..._beforeSlice].fill('_', 0, _beforeSlice.length), ..._afterSliceData]
            beforeSlice[BEFORE_SLICE] = _afterSliceData[0]
            console.log('currentWeights1', weights, amounts)
            // console.log('currentWeights2', afterSlice)

            setBeforeSlice(beforeSlice)
            setAfterSlice(afterSlice)
        })()
    }, [dateSlice, amountTokenFrom, amountTokenTo, startWeight, endWeight, chainId])


    useEffect(() => {
        if (ref && ref.current) {
            const myChart = echarts.init(ref.current);
            myChart.setOption(getOption({
                dateSlice: dateSlice,
                // priceSlice: priceSlice,
                beforeSlice: beforeSlice,
                afterSlice: afterSlice,
                model: (dateSlice.length >= 2 && dateSlice[dateSlice.length - 1] - dateSlice[0] > 1000 * 60 * 60 * 24) ? 'day' : 'hour'
            }))
        }

    }, [ref, dateSlice, afterSlice, beforeSlice])

    return (
        <div className={styles.echartsBox}>
            <div ref={ref} className={styles.echarts} style={{
                width: '100%',
                height: '100%'
            }} />
            <div className={styles.chartInfo}>
                <div className={styles.blue}>
                    <div className={styles.dot}></div>
                    {`${detailData?.token0Symbol} Price`}
                </div>
                <div>
                    <div className={styles.dot}></div>
                    {`${detailData?.token0Symbol} Predicted Price`}
                </div>
            </div>
        </div>
    );
}
