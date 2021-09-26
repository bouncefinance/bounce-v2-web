import classNames from "classnames";
import React, { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { UserInfo } from "@app/modules/header/ui/user-info";
import { Button, NavLink, PrimaryButton } from "@app/ui/button";

import { useConnected } from "@app/web3/hooks/use-web3";

import { useConnectWalletControl } from "../connect-wallet-modal";

import styles from "./MobileFooter.module.scss";

interface IMobileFooter {
	active: boolean;
}

export const FooterView: FC<IMobileFooter & MaybeWithClassName> = ({ className, active }) => {
	const { open } = useConnectWalletControl();

	return (
		<footer className={classNames(className, styles["footer"])}>
			{active ? (
				<UserInfo />
			) : (
				<Button className={styles["connect-btn"]} onClick={open}>
					Connect Wallet
				</Button>
			)}
		</footer>
	);
};

export const MobileFooter: FC<MaybeWithClassName> = ({ className }) => {
	const active = useConnected();

	return <FooterView className={className} active={active} />;
};
