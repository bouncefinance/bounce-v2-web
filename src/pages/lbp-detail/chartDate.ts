import moment from "moment";

// echart 配置项
export const getOption = (props: {
	dateSlice: any[];
	// priceSlice: any[];
	beforeSlice: any[];
	afterSlice: any[];
	model: "day" | "hour";
}) => {
	return {
		xAxis: {
			data: props.dateSlice.map((i) => moment(i).format("D MMM, HH:mm")),
			axisLabel: {
				formatter: (value: string) => {
					if (props.model === "day") {
						return moment(value).format("DD MMM");
					}

					return moment(value).format("HH:mm");
				},
			},
		},
		tooltip: {
			trigger: "axis",
			// axisPointer: {
			// 	type: 'cross'
			// },
			// backgroundColor: 'rgba(255, 255, 255, 0.8)',
			// formatter: (data: any) => {
			// 	console.log('getOption', data)
			// 	const value = data[0].value === '_' ? data[1].value : data[0].value
			// 	return `$ ${value}`
			// }
		},
		yAxis: {
			axisLabel: {
				formatter: (value: number) => {
					return `$ ${value}`;
				},
			},
		},
		series: [
			{
				symbol: "none",
				name: "Price",
				data: props.beforeSlice,
				itemStyle: {
					normal: {
						label: {
							formatter: (value: number) => {
								return `$${value}`;
							},
						},
					},
				},
				type: "line",

				smooth: true,
				color: "rgba(75, 112, 255, 1)",
			},
			{
				symbol: "none",
				name: "Price",
				data: props.afterSlice,
				itemStyle: {
					normal: {
						label: {
							formatter: (value: number) => {
								return `$ ${value}`;
							},
						},
					},
				},
				type: "line",
				smooth: true,
				color: "rgba(0, 0, 0, 0.2)",
			},
		],
	};
};

// 分割时间成五段
export const getDateSlice = (startDate?: Date, endDate?: Date, slice = 5) => {
	const DIFF_TIME = 1000 * 60 * 60 * 24 * 3; // 三天
	const startTime = (startDate || new Date()).getTime();
	const endTime = endDate?.getTime() || startTime + DIFF_TIME;

	const intervalTime = (endTime - startTime) / (slice - 1);
	const ResTimeArray: number[] = [];

	for (let i = 0; i < slice; i++) {
		const time = startTime + intervalTime * i;
		ResTimeArray.push(parseInt(time + ""));
	}

	return ResTimeArray;
};

export const getPriceSlice = async (
	dateSlice: number[],
	amountTokenFrom: number,
	amountTokenTo: number,
	startWeight: number,
	endWeight: number,
	tokenToPrice: number
) => {
	const priceSlice = [];

	if (amountTokenFrom && amountTokenTo) {
		console.log({
			dateSlice,
			amountTokenFrom,
			amountTokenTo,
			startWeight,
			endWeight,
			tokenToPrice,
		});

		const tokenToUSD = amountTokenTo * tokenToPrice;
		const weightUnit = (endWeight - startWeight) / dateSlice.length;

		dateSlice.forEach((_item, index) => {
			const currentTokenFromWeight = startWeight + index * weightUnit;

			const tokenFromPrice = getTokenFromPriceByWeight(
				tokenToUSD,
				amountTokenFrom,
				currentTokenFromWeight
			);
			priceSlice.push(tokenFromPrice);
		});
	}

	return priceSlice;
};

export const getTokenFromPriceByWeight = (
	tokenToUSD: number,
	tokenFromAmount: number,
	tokenFromWeight: number
) => {
	const tokenFromUSD = tokenToUSD * (tokenFromWeight / (100 - tokenFromWeight));
	const tokenFromPrice = tokenFromUSD / tokenFromAmount;

	return tokenFromPrice.toFixed(4);
};
