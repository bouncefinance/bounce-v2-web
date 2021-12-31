import { FC, useEffect, useRef, useState } from "react";
import * as echarts from 'echarts';
import styles from './lbpParameters.module.scss'
import { getDateSlice, getOption, getPriceSlice } from "./chartDate";

const SLICE = 3


interface IChartsParams {
    amountTokenFrom: number
    amountTokenTo: number
    startWeight: number
    endWeight: number
    startDate: Date
    endDate: Date
}

export const Charts: FC<IChartsParams> = ({
    amountTokenFrom,
    amountTokenTo,
    startWeight,
    endWeight,
    startDate,
    endDate
}) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const [dateSlice, setDateSlice] = useState(getDateSlice())
    const [priceSlice, setPriceSlice] = useState([])

    useEffect(() => {
        const dateSlice = getDateSlice(startDate, endDate, SLICE)
        setDateSlice(dateSlice)
    }, [startDate, endDate])

    useEffect(() => {
        (async () => {
            const priceSlice = await getPriceSlice(dateSlice, amountTokenFrom, amountTokenTo, startWeight, endWeight)
            // console.log('priceSlice', priceSlice)
            setPriceSlice(priceSlice)
        })()
    }, [dateSlice, amountTokenFrom, amountTokenTo, startWeight, endWeight])


    useEffect(() => {
        if (ref && ref.current) {
            const myChart = echarts.init(ref.current);
            myChart.setOption(getOption({
                dateSlice: dateSlice,
                priceSlice: priceSlice,
                model: (dateSlice.length >= 2 && dateSlice[dateSlice.length - 1] - dateSlice[0] > 1000 * 60 * 60 * 24) ? 'day' : 'hour'
            }))
        }

    }, [ref, dateSlice, priceSlice])

    return (
        <div className={styles.echartsBox}>
            <div ref={ref} className="echarts" style={{
                width: '100%',
                height: '100%'
            }}></div>
        </div>
    );
}
