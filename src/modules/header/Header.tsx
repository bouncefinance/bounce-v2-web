import classNames from "classnames";
import React, { FC, useCallback, useState, useEffect, useRef } from "react";

import { FocusOn } from "react-focus-on";

import { CREATE_PATH } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { useScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { DotLinks } from "@app/modules/header/ui/dots";
import { UserInfo } from "@app/modules/header/ui/user-info";
import { NavLink, PrimaryButton } from "@app/ui/button";
import { Add } from "@app/ui/icons/add";
import { Close } from "@app/ui/icons/close";
import { Logo } from "@app/ui/icons/logo";
import { NewClose } from "@app/ui/icons/new-close";
import { Toggle } from "@app/ui/icons/toggle";

import { useConnected } from "@app/web3/hooks/use-web3";

import { useConnectWalletControl } from "../connect-wallet-modal";

import styles from "./Header.module.scss";
import { MobileNavigation } from "./ui/mobile-navigation";
import { Navigation } from "./ui/navigation";

type HeaderType = {
	active: boolean;
};

export const HeaderView: FC<HeaderType & MaybeWithClassName> = ({ className, active }) => {
	const [mobileNavigationShown, setMobileNavigationVisibility] = useState(false);
	const mobileNavigation = useScatteredContinuousState(mobileNavigationShown, {
		timeout: 350,
	});
	const closeMobileNavigationDisplay = useCallback(() => setMobileNavigationVisibility(false), []);
	// toggle is bound to a visible state of button
	const toggleMobileNavigationDisplay = useCallback(
		() => setMobileNavigationVisibility(!mobileNavigation.present),
		[mobileNavigation.present]
	);

	// close mobile navigation on route change
	useEffect(() => {
		closeMobileNavigationDisplay();
	}, [closeMobileNavigationDisplay]);

	const toggleRef = useRef<HTMLButtonElement>(null);

	const { open } = useConnectWalletControl();

	return (
		<>
			<header className={classNames(className, styles.component)}>
				<div className={styles.wrapper}>
					<NavLink
						className={styles.logo}
						href="/"
						icon={<Logo style={{ width: 130 }} />}
						variant="text"
						color="primary-black"
					>
						Home
					</NavLink>
					{mobileNavigation.present && <DotLinks className={styles.dots} />}
					<Navigation className={styles.navigation} />
					<div className={styles.buttons}>
						<NavLink
							className={styles.create}
							href={CREATE_PATH}
							variant="outlined"
							size="medium"
							color="primary-white"
							rainbowHover
						>
							Create
						</NavLink>
						{active ? (
							<UserInfo />
						) : (
							<PrimaryButton className={styles.create} size="medium" onClick={open}>
								Connect Wallet
							</PrimaryButton>
						)}
					</div>
					<NavLink className={styles.add} href={CREATE_PATH} variant="outlined">
						<Add />
					</NavLink>
					<button className={styles.toggle} onClick={toggleMobileNavigationDisplay} ref={toggleRef}>
						{mobileNavigation.present ? (
							<NewClose style={{ color: "#fff" }} />
						) : (
							<Toggle style={{ color: "#fff" }} />
						)}

						<span>{mobileNavigation.present ? "Close" : "Open"}</span>
					</button>
				</div>
				{mobileNavigation.defined && (
					<FocusOn
						autoFocus
						enabled={mobileNavigation.present}
						onEscapeKey={closeMobileNavigationDisplay}
						onClickOutside={closeMobileNavigationDisplay}
						shards={[toggleRef]}
					>
						<MobileNavigation
							className={classNames(
								styles.dropdown,
								mobileNavigation.defined && styles.visible,
								mobileNavigation.present && styles.animation
							)}
							sideEffect={<mobileNavigation.DefinePresent timeout={16} />}
							onClick={closeMobileNavigationDisplay}
						/>
					</FocusOn>
				)}
			</header>
		</>
	);
};

export const Header: FC<MaybeWithClassName> = ({ className }) => {
	const active = useConnected();

	return <HeaderView className={className} active={active} />;
};
