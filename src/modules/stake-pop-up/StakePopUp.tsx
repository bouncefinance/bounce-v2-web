import React, { FC } from "react";

import { FormSpy } from "react-final-form";

import { ScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { TextField } from "@app/modules/text-field";
import { Button } from "@app/ui/button";
import { PrimaryButton } from "@app/ui/button";
import { ShortLogo } from "@app/ui/icons/short-logo";
import { PopUpContainer } from "@app/ui/pop-up-container";
import { Body1, Heading1 } from "@app/ui/typography";

import styles from "./StakePopUp.module.scss";

const FLOAT = "0.0001";

export const Content: FC = () => {
	const onsubmit = () => {
		console.log(111);
	};

	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Stake Tokens
			</Heading1>
			<Form onSubmit={onsubmit} className={styles.form}>
				<FormSpy subscription={{ values: true }}>
					{(props) => (
						<Label
							Component="label"
							label="Amount"
							after={<span className={styles.balance}>Balance: 100.00 Auction</span>}
						>
							<TextField
								type="number"
								name="amount"
								placeholder="0.00"
								step={FLOAT}
								after={
									<div className={styles.amount}>
										<FormSpy>
											{({ form }) => (
												<button
													className={styles.max}
													onClick={() => form.change("amount", 50)}
													type="button"
												>
													MAX
												</button>
											)}
										</FormSpy>
										<div className={styles.coinWrapper}>
											<span className={styles.logoIcon}>
												<ShortLogo style={{ width: 9, height: 14, color: "#fff" }} />
											</span>
											<span className={styles.coin}>Auction</span>
										</div>
									</div>
								}
								// validate={composeValidators(isEqualZero, isValidWei)}
								required
							/>
						</Label>
					)}
				</FormSpy>
				<PrimaryButton size="large" submit>
					Stake AUCTION
				</PrimaryButton>
			</Form>
			<div className={styles.amountItem}>
				<span>Your Auction Staked</span>
				<span>12345.00</span>
			</div>
		</div>
	);
};

export const Content1: FC = () => {
	return (
		<div className={styles.component}>
			<div className={styles.claimTitle}>Your total staking rewards:</div>
			<div className={styles.rewardsWrap}>
				<span>748.562</span>
				<span>Auction</span>
			</div>
			<PrimaryButton size="large">Claim</PrimaryButton>
			<div className={styles.amountItem}>
				<span>Your Auction Staked</span>
				<span>12345.00</span>
			</div>
		</div>
	);
};

export const Content2: FC = () => {
	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Staking Cancelled
			</Heading1>
			<div className={styles.cancelDesc}>Your staking was cancelled and wasn’t submitted.</div>
			<PrimaryButton size="large">Try again</PrimaryButton>
		</div>
	);
};

interface IStakePopUpProps {
	popUp: ScatteredContinuousState<boolean>;
	close(): void;
}

export const StakePopUp: FC<IStakePopUpProps> = ({ popUp, close }) => {
	return (
		<PopUpContainer
			animated={popUp.present}
			visible={popUp.defined}
			onClose={close}
			maxWidth={640}
			withoutClose={false}
		>
			<Content />
			<popUp.DefinePresent />
		</PopUpContainer>
	);
};
