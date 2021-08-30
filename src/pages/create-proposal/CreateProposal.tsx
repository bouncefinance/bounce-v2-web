import { useRouter } from "next/router";
import { FC } from "react";

import { MaybeWithClassName } from "@app/helper/react/types";
import { useControlPopUp } from "@app/hooks/use-control-popup";
import { CreateFlowForProposal } from "@app/modules/create-flow-for-proposal";
import { defineFlow } from "@app/modules/flow/definition";

import { ProcessingPopUp } from "@app/modules/processing-pop-up";
import { useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./CreateProposal.module.scss";
import { Confirmation, ConfirmationInType } from "./ui/confirmation";
import { Description } from "./ui/description";
import { Settings } from "./ui/settings";

const CREATE_PROPOSAL_STEPS = defineFlow(Description, Settings, Confirmation);

enum OPERATION {
	default = "default",
	approval = "approval",
	confirm = "confirm",
	pending = "pending",
	success = "success",
	error = "error",
	cancel = "cancel",
}

const TITLE = {
	[OPERATION.approval]: "Bounce requests wallet approval",
	[OPERATION.confirm]: "Bounce requests wallet interaction",
	[OPERATION.pending]: "Bounce waiting for transaction settlement",
	[OPERATION.success]: "Auction successfully published",
	[OPERATION.error]: "Transaction failed on Bounce",
	[OPERATION.cancel]: "Transaction canceled on Bounce",
};

const CONTENT = {
	[OPERATION.approval]: "Please manually interact with your wallet",
	[OPERATION.confirm]:
		"Please open your wallet and confirm in the transaction activity to proceed your order",
	[OPERATION.pending]:
		"Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement",
	[OPERATION.success]:
		"Congratulations! Your auction is live and is now listed in designated area. Please find more information about the next steps in the pool page",
	[OPERATION.error]:
		"Oops! Your transaction is failed for on-chain approval and settlement. Please initiate another transaction",
	[OPERATION.cancel]: "Sorry! Your transaction is canceled. Please try again.",
};

const onComplete = () => {
	return console.log("onComplete");
};

export const CreateProposal: FC<MaybeWithClassName> = () => {
	const { popUp, close, open } = useControlPopUp();

	const { push: routerPush } = useRouter();

	return (
		<>
			<div className={styles.component}>
				<CreateFlowForProposal steps={CREATE_PROPOSAL_STEPS} onComplete={onComplete} />
			</div>
			{popUp.defined ? (
				<ProcessingPopUp
					title={"PopUp Title"}
					text={"PopUp Text"}
					onSuccess={() => {
						// routerPush(`${AUCTION_PATH}/${type}/${poolId}`);
						// setOperation(OPERATION.default);
						close();
					}}
					onTry={() => console.log("tryAgainAction")}
					isSuccess={false}
					isLoading={false}
					isError={false}
					control={popUp}
					close={() => {
						close();
					}}
				/>
			) : undefined}
		</>
	);
};
