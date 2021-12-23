import { useEffect, useRef } from "react";
import * as echarts from 'echarts';
import styles from './lbpParameters.module.scss'

const option = {
    xAxis: {
        data: ['6 Dec', '12 Dec', '18 Dec', '24 Dec']
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        formatter: (data: any) => {
            // console.log(data)
            return `$${data[0].value}`
        }
    },
    yAxis: {
        axisLabel: {
            formatter: (value: number) => {
                return `$${value}`
            }
        },
    },
    series: [
        {
            data: [2.4, 1.2, 0.4, 0.1],
            itemStyle: {
                normal: {
                    label: {
                        formatter: (value: number) => {
                            return `$${value}`
                        }
                    }
                }
            },
            type: 'line',
            smooth: true
        }
    ]
};

export function Charts() {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (ref && ref.current) {
            const myChart = echarts.init(ref.current);
            myChart.setOption(option)
        }

    }, [ref])

    return (
        <div className={styles.echartsBox}>
            <div ref={ref} className="echarts" style={{
                width: '100%',
                height: '100%'
            }}></div>
        </div>
    );
}
