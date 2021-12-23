import { TokenInfo } from "@uniswap/token-lists";
import { FC, useCallback, useEffect } from "react";
import { useForm, useFormState, FormSpy } from "react-final-form";

import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { SelectTokenField } from "@app/modules/select-token-field";
import { TextField } from "@app/modules/text-field";

import { NavLink, PrimaryButton } from "@app/ui/button";
import { RightArrow2 } from "@app/ui/icons/arrow-right-2";

import { useChainId } from "@app/web3/hooks/use-web3";
import { CHAINS_INFO } from "@app/web3/networks/const";

import styles from "./ProvideTokenInformation.module.scss";

type EffectorType = {
	address?: string;
	onTokenChange(token0: string, token1: string): void;
};

const Effector: FC<EffectorType> = ({ address, onTokenChange }) => {
	const form = useForm();
	const { values: { tokenFrom, tokenTo } } = useFormState();

	useEffect(() => {
		onTokenChange(tokenFrom, tokenTo);
	}, [onTokenChange, tokenFrom, tokenTo]);

	useEffect(() => {
		form.batch(() => {
			form.change("address", address);
		});
	}, [address, form]);

	return null;
};

type ProvideTokenInformationType = EffectorType & {
	href: string;
	initialState: any;
	withoutEth?: boolean;
	onSubmit(values): void;
};

export const LBPTokenInformation: FC<ProvideTokenInformationType> = ({
	onSubmit,
	onTokenChange,
	address,
	initialState,
	href,
	withoutEth,
}) => {
	const notEtherium = useCallback(
		(token: TokenInfo) => token.address !== "0x0000000000000000000000000000000000000000",
		[]
	);

	const chainId = useChainId();

	return (
		<Form onSubmit={onSubmit} className={styles.form} initialValues={initialState}>
			<Effector address={address} onTokenChange={onTokenChange} />
			<Label className={styles.label} Component="div" label="Launch Token" tooltip="Select a ERC20 token.">
				<SelectTokenField
					name="tokenFrom"
					placeholder="Select a token"
					filter={withoutEth ? notEtherium : undefined}
					required
				/>
			</Label>
			<Label Component="label" className={styles.label} label="Token contact address">
				<TextField
					type="text"
					name="address"
					placeholder="0x00A9b7ED8C71C6910Fb4A9bc41de2391b74c0000"
					readOnly
					required
				/>
			</Label>
			<NavLink
				className={styles.link}
				href={href}
				size="medium"
				variant="text"
				color="dark-grey"
				weight="regular"
			>
				{`View on ${CHAINS_INFO[chainId].explorer.name}`}
			</NavLink>

			<Label className={styles.label} Component="div" label="Collected Token" tooltip="Select a ERC20 token.">
				<SelectTokenField
					name="tokenTo"
					placeholder="Select a token"
					filter={withoutEth ? notEtherium : undefined}
					required
				/>
			</Label>
			<FormSpy>
				{(form) => (
					<PrimaryButton
						className={styles.submit}
						size="large"
						iconAfter={<RightArrow2 width={18} style={{ marginLeft: 12 }} />}
						submit
					>
						{initialState && form.dirty ? "Save" : "Next Step"}
					</PrimaryButton>
				)}
			</FormSpy>
		</Form>
	);
};