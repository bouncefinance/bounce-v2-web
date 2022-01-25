import classNames from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { createContext, FC, memo, ReactNode } from "react";

import { CSSProperties } from "react";

import { ApplicationWrappers } from "@app/layout/ApplicationWrappers";
import { ConnectWalletProvider } from "@app/modules/connect-wallet-modal/ConnectWalletProvider";
import { DesktopFooter } from "@app/modules/desktop-footer";
import { Header } from "@app/modules/header";
import { MobileFooter } from "@app/modules/mobile-footer";

import { Vector } from "@app/ui/icons/vector";

import { Web3ProviderRoot } from "../web3/provider/Web3Provider";

import styles from "./Layout.module.scss";

type LayoutType = {
	children?: ReactNode;
	title?: string;
	description?: string;
	keywords?: string;
	className?: string;
};

const SuppressAllUpdates: FC = memo(
	({ children }) => <>{children}</>,
	() => true
);

const childrenContext = createContext<ReactNode>(null);

const Providers: FC = ({ children }) => {
	return (
		<childrenContext.Provider value={children}>
			<SuppressAllUpdates>
				<Web3ProviderRoot>
					<ConnectWalletProvider>
						<ApplicationWrappers>
							<childrenContext.Consumer>
								{(teleChildren) => <>{teleChildren}</>}
							</childrenContext.Consumer>
						</ApplicationWrappers>
					</ConnectWalletProvider>
				</Web3ProviderRoot>
			</SuppressAllUpdates>
		</childrenContext.Provider>
	);
};

const WaitForRouter: FC = ({ children }) => {
	const router = useRouter();

	return router.isReady ? <>{children}</> : null;
};

export const Layout: FC<LayoutType> = ({
	children,
	className,
	title = "",
	description = "",
	keywords,
}) => {
	return (
		<Providers>
			<div className={classNames(styles.component, className)}>
				<Head>
					<title>{title}</title>
					<meta name="Description" content={description} />
					<meta name="keywords" content={keywords} />
					<meta
						name="viewport"
						content="width=device-width, minimum-scale=1, initial-scale=1, shrink-to-fit=no, user-scalable=no"
					/>
				</Head>
				<Header className={styles.header} />
				<main className={styles.main}>
					<div /* className={styles.desktop} */>
						<WaitForRouter>{children}</WaitForRouter>
					</div>
					{/* <a
						className={classNames(styles.vector)}
						href="https://forms.gle/Bv6yr9ysWogjnuQQ9"
						target="__blank"
						title="forms"
					>
						<Vector />
					</a> */}
				</main>
				<DesktopFooter className={styles.desktop} />
				<MobileFooter className={styles.mobile} />
			</div>
		</Providers>
	);
};
