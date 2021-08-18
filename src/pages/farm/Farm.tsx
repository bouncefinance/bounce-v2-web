import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import React, { FC, useEffect, useState } from "react";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { StakePopUp } from "@app/modules/stake-pop-up";
import { Button } from "@app/ui/button";
import { GutterBox } from "@app/ui/gutter-box";
import { ShortLogo } from "@app/ui/icons/short-logo";

import { getAuctionAddress } from "@app/web3/api/bounce/contractAddress";
import { getBalance, getTokenContract } from "@app/web3/api/bounce/erc";
import { getContract } from "@app/web3/contracts/helpers";
import { useChainId, useWeb3Provider } from "@app/web3/hooks/use-web3";

import { MaybeWithClassName } from "../../helper/react/types";

import styles from "./Farm.module.scss";

export const Farm: FC<MaybeWithClassName> = ({ className }) => {
	// const [showStakePop, setShowStakePop] = useState<boolean>(false);
	const { open, close, popUp } = useControlPopUp();
	const { account } = useWeb3React();
	const chainId = useChainId();
	const provider = useWeb3Provider();
	const tokenContract = getTokenContract(provider, getAuctionAddress(chainId));

	const loadAuctionStaking = () => {
		getBalance(tokenContract, account).then((b) => {
			console.log("b", b);
		});
	};

	const handlePopUp = (type: string) => {
		// switch (type) {
		// 	case "claim":
		// 		break;
		// }

		open();
	};

	return (
		<div className={classNames(className, styles.component)}>
			<GutterBox>
				<div className={styles.wrapper}>
					<div className={styles.header}>
						<div className={styles.headLeftContent}>
							<span className={styles.logoIcon}>
								<ShortLogo style={{ width: 9, height: 14, color: "#fff" }} />
							</span>
							<span className={styles.logoTit}>Auction</span>
						</div>
						<div className={styles.headRightContent}>
							<span className={styles.label}>APY</span>
							<span className={styles.value}>155.73%</span>
						</div>
					</div>
					<div className={styles.rewardWrap}>
						<div className={styles.rewardsLable}>
							<span>Your Staking Rewards Estimation</span>
							<Button style={{ color: "#2E57F7" }} onClick={() => handlePopUp("claim")}>
								Claim Rewards
							</Button>
						</div>
						<div className={styles.rewardsValue}>
							<span>748.562</span>
							<span>Auction</span>
						</div>
						<div className={styles.buttons}>
							<Button
								size="large"
								color="primary-black"
								variant="contained"
								onClick={() => handlePopUp("stake")}
							>
								Stake
							</Button>
							<Button
								size="large"
								color="primary-black"
								variant="contained"
								onClick={() => handlePopUp("unStake")}
							>
								Unstake
							</Button>
						</div>
						<div className={styles.amountWrapper}>
							<div className={styles.amountItem}>
								<span>Your Stake</span>
								<span>12345.00</span>
							</div>
							<div className={styles.amountItem}>
								<span>Pooled Total</span>
								<span>12345.00</span>
							</div>
						</div>
					</div>
					<StakePopUp popUp={popUp} close={close} />
				</div>
			</GutterBox>
		</div>
	);
};
