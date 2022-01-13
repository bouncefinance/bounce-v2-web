import classnames from "classnames";
import { FC, ReactChild, ReactNode, useCallback } from "react";

import { CopyAddress } from "@app/modules/copy-to-clipboard";
import { Currency } from "@app/modules/currency";
import { DisplayOTCInfoType } from "@app/modules/otc-card";
import { Symbol } from "@app/modules/symbol";
import { Timer } from "@app/modules/timer";
import { Button } from "@app/ui/button";
import { DescriptionList } from "@app/ui/description-list";
import { GutterBox } from "@app/ui/gutter-box";

import { RightArrow } from "@app/ui/icons/arrow-right";
import { ProgressBar } from "@app/ui/progress-bar";
import { Status } from "@app/ui/status";
import { Caption, Heading1, Heading2 } from "@app/ui/typography";

import { POOL_STATUS } from "@app/utils/pool";

import styles from "./View.module.scss";
import { Charts } from "./Charts";
import { ILBPDetail } from "@app/api/lbp/types";

type LBPDetailViewType = {
	children: ReactChild
	id: number | string
	name: string
	status: POOL_STATUS
	openAt: number;
	closeAt: number;
	onZero(): void;
	onBack(): void;
	totalVolume: string,
	liquidity: string,
	tokenSold: ReactNode
	extension: ReactChild
	detailData: ILBPDetail
};

const ONEHOUR = 1000 * 60 * 60
const ONEDAY = ONEHOUR * 24

export const View: FC<LBPDetailViewType> = ({
	children, id, name, status, openAt, closeAt, onZero, totalVolume, liquidity, tokenSold,
	extension, onBack, detailData
}) => {
	const STATUS: Record<POOL_STATUS, ReactNode> = {
		[POOL_STATUS.COMING]: (
			<>
				<span>Start in&nbsp;</span>
				<Timer timer={openAt} onZero={onZero} />
			</>
		),
		[POOL_STATUS.LIVE]: (
			<>
				<span>Live&nbsp;</span>
				<Timer timer={openAt} onZero={onZero} model='Keep' />
			</>
		),
		[POOL_STATUS.FILLED]: "Filled",
		[POOL_STATUS.CLOSED]: (
			<>
				<span>Close&nbsp;</span>
				<Timer timer={closeAt} onZero={onZero} model='Keep' />
			</>
		),
		[POOL_STATUS.ERROR]: "Error",
	};

	const getDuration = useCallback(() => {
		const diffTime = closeAt - openAt

		if (diffTime < ONEHOUR) {
			return `1 Hours`
		} else if (diffTime < ONEDAY) {
			return `${Math.floor(diffTime / ONEHOUR)} Hours`
		} else {
			return `${Math.floor(diffTime / ONEDAY)} Days`
		}
	}, [openAt, closeAt])

	return (
		<section className={styles.component}>
			<GutterBox>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						<Button
							variant="text"
							color="primary-black"
							onClick={onBack}
							iconBefore={
								<RightArrow style={{ width: 8, marginRight: 12, transform: "rotate(180deg)" }} />
							}
						>
							Go Back
						</Button>
						<Caption Component="span" weight="medium">
							# {id}
						</Caption>
					</div>
					<div className={styles.title}>
						<Heading1 className={styles.title}>{name}</Heading1>
						<Status status={status} captions={STATUS} />
					</div>
					<div className={styles.content}>
						<div className={styles.contentLeft}>
							<div className={styles.leftTopInfo}>
								<div>
									<h5>Duration</h5>
									<span>{getDuration()}</span>
								</div>

								<div>
									<h5>Total Volume</h5>
									<span>{totalVolume}</span>
								</div>

								<div>
									<h5>Liquidity</h5>
									<span>{liquidity}</span>
								</div>

								<div>
									<h5>Token Sold</h5>
									<span>{tokenSold}</span>
								</div>
							</div>

							<div className={styles.leftChart}>
								{
									detailData && <Charts
										amountTokenFrom={100}
										amountTokenTo={5}
										startWeight={detailData.startWeightToken0 * 100}
										endWeight={detailData.endWeightToken0 * 100}
										startDate={new Date(detailData.startTs * 1000)}
										endDate={new Date(detailData.endTs * 1000)}
									/>
								}
							</div>
						</div>

						<div className={styles.contentRight}>
							{children}
						</div>
					</div>
				</div>
				<div className={styles.extension}>
					{extension}
				</div>
			</GutterBox>
		</section>
	);
};
