import classNames from "classnames";
import { FC, useState } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";

import styles from "./TimingRadio.module.scss";

type TimingRadioType = {
	// timingList: number[];
	// value: number;
	// onChange(timing: number): void;
	name: string;
	value: string;
	onChange?: any;
};

export const TimingRadio: FC<TimingRadioType & MaybeWithClassName> = ({
	className,
	timingList,
	value,
	onChange,
	className,
	children,
	name,
	value,
	onChange,
}) => {
	return (
		<div className={styles.root}>
			<input
				className={styles.input}
				name={name}
				value={value}
				onChange={onChange}
			/>
			<div className={styles.line}></div>
			{timingList.map((timing: number) => (
				<div
					className={classNames(styles.item)}
					key={timing}
					onClick={() => {
						onChange(timing);
					}}
				>
					<div
						className={value === timing ? styles.selectedData : styles.unSelectedData}
					>{`${timing} Day`}</div>
					<div className={value === timing ? styles.selectedCircle : styles.unSelectedCircle}></div>
				</div>
			))}
		</div>
	);
};
