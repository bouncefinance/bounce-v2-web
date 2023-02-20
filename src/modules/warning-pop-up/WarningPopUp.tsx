import React, { useEffect } from "react";

import { useControlPopUp } from "@app/hooks/use-control-popup";
import { PopUpContainer } from "@app/ui/pop-up-container";

import { Body1, Heading1 } from "@app/ui/typography";

import styles from "./WarningPopUp.module.scss";
import { Button } from "@app/ui/button";
import { ShortLogo } from "@app/ui/icons/short-logo";

export const Content = ({ close }: { close: () => void }) => {
	return (
		<div className={styles.component}>
			<Heading1 Component="h2" className={styles.title}>
				Warning
			</Heading1>

			<ShortLogo width="40px" />

			<Body1 className={styles.text}>
				Bounce is a decentralized platform where anyone can create an auction pool with any token.
				Do your own research before making your transaction. It is of your own responsibility to
				take any onchain action on Bounce.
			</Body1>

			<Button
				variant="contained"
				size="large"
				color="primary-black"
				className={styles.button}
				onClick={close}
			>
				I Acknowledge
			</Button>
		</div>
	);
};

export const WarningPopUp = () => {
	const { open, close, popUp } = useControlPopUp();

	useEffect(() => {
		open();
	}, [open]);

	return (
		<PopUpContainer
			animated={true}
			visible={popUp.defined}
			onClose={close}
			maxWidth={540}
			withoutClose
		>
			<Content close={close} />
		</PopUpContainer>
	);
};
