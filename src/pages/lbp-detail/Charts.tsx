import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as echarts from 'echarts';
import styles from './View.module.scss'
import { getDateSlice, getOption, getPriceSlice, getTokenFromPriceByWeight } from "./chartDate";
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

        // console.log('currentWeights0', SLICE)
    }, [startDate, endDate])

    useEffect(() => {
        if (!chainId) return
        (async () => {
            const startDot = getTokenFromPriceByWeight(tokenToPrice * Number(weiToNum(detailData.startAmountToken1, detailData.token1Decimals)), Number(weiToNum(detailData.startAmountToken0, detailData.token0Decimals)), startWeight)
            const endDot = getTokenFromPriceByWeight(tokenToPrice * Number(weiToNum(detailData.currentAmountToken1, detailData.token1Decimals)), Number(weiToNum(detailData.currentAmountToken0, detailData.token0Decimals)), endWeight)

            // console.log('detailData', tokenToPrice, Number(weiToNum(detailData.startAmountToken0, detailData.token0Decimals)), detailData.startWeightToken0 * 100)
            const beforeSliceData = await fetchLbpChartData(chainId, detailData.address)
            // const BEFORE_SLICE = Math.ceil((new Date().getTime() - new Date(startDate).getTime()) / 3600000) - 1
            const __beforeDateSlice = beforeSliceData.map(item => {
                return item.timestamp
            })

            const __beforeSlice: any[] = beforeSliceData.map(item => {
                return item.price
            })

            if (!__beforeSlice.length) {
                const middenDot = getTokenFromPriceByWeight(
                    tokenToPrice * Number(weiToNum(detailData.startAmountToken1, detailData.token1Decimals)),
                    Number(weiToNum(detailData.startAmountToken0, detailData.token0Decimals)),
                    (startWeight + endWeight) / 2
                )
                __beforeSlice.push(middenDot)
                __beforeDateSlice.push((startDate.getTime()+ endDate.getTime()) / 2)
            }

            const _beforeSlice = [startDot, ...__beforeSlice]

            // console.log('beforeDateSlice', beforeDateSlice)
            // const _beforeSlice: any[] = beforeDateSlice.fill(0.1)
            const weights = await pairDate.getTokensWeight()
            const currentWeight = Number(weiToNum(weights[detailData.isCorrectOrder === CORRECTORDER.true ? 0 : 1], detailData.token0Decimals)) * 100
            const amounts = await pairDate.getTokensAmount()
            // console.log('amounts', amounts)
            const currentAmountTokenFrom = detailData.isCorrectOrder === CORRECTORDER.true ? Number(weiToNum(amounts[0], detailData.token0Decimals)) : Number(weiToNum(amounts[1], detailData.token0Decimals))
            const currentAmountTokenTo = detailData.isCorrectOrder === CORRECTORDER.true ? Number(weiToNum(amounts[1], detailData.token1Decimals)) : Number(weiToNum(amounts[0], detailData.token1Decimals))
            // const AFTER_SLICE = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / 3600000)
            const AFTER_SLICE = Date.now() > endDate.getTime() ? 0 : 5
            const afterDateSlice = getDateSlice(new Date(), endDate, AFTER_SLICE)
            const _afterSliceData = await getPriceSlice(afterDateSlice, currentAmountTokenFrom, currentAmountTokenTo, currentWeight, endWeight, tokenToPrice)

            // console.log('beforeSlice', {afterDateSlice, currentAmountTokenFrom, currentAmountTokenTo, currentWeight, endWeight, tokenToPrice})
            const _beforeDateSlice = [startDate.getTime(), ...__beforeDateSlice, afterDateSlice[0] || endDate.getTime()]
            const beforeSlice: any[] = [..._beforeSlice, ...[..._afterSliceData].fill('_', 0, _afterSliceData.length)]
            const afterSlice = [...[..._beforeSlice].fill('_', 0, _beforeSlice.length), ..._afterSliceData]
            beforeSlice[_beforeSlice.length] = _afterSliceData[0] || endDot
            // console.log('beforeSlice', beforeSlice)

            setBeforeSlice(beforeSlice)
            setAfterSlice(afterSlice)

            // const SLICE = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 3600000)
            const dateSlice = getDateSlice(new Date(), endDate, AFTER_SLICE)
            setDateSlice([..._beforeDateSlice, ...dateSlice])
            console.log('date', [..._beforeDateSlice, ...dateSlice])
        })()
    }, [amountTokenFrom, amountTokenTo, startWeight, endWeight, chainId])


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
