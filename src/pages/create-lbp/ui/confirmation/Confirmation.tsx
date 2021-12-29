import BigNumber from "bignumber.js";
import classNames from "classnames";
import { FC, ReactNode } from "react";

import { OTC_SHORT_NAME_MAPPING, OTC_TYPE } from "@app/api/otc/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { useConvertDate } from "@app/hooks/use-convert-data";
import { Currency } from "@app/modules/currency";
import { defineFlowStep } from "@app/modules/flow/definition";
import { useFlowData } from "@app/modules/flow/hooks";
import { Symbol } from "@app/modules/symbol";
import { BuyingOutType } from "@app/pages/create-otc/ui/buying";
import { SellingOutType } from "@app/pages/create-otc/ui/selling";
import { DescriptionList } from "@app/ui/description-list";

import { Heading3 } from "@app/ui/typography";
import { walletConversion } from "@app/utils/convertWallet";

import { SettingsOutType } from "../settings";
import { TokenOutType } from "../token";

import styles from "./Confirmation.module.scss";
import { ConfirmationView } from "./ConfirmationView";
import { ParameterOutType } from "../lbpParameters/lbpParameters";



type CommonType = {
	type: string;
};

export type ConfirmationInType = TokenOutType & ParameterOutType & SettingsOutType;

export const ConfirmationImp: FC<CommonType> = ({ type }) => {
	const {
		tokenFrom, tokenTo
	} = useFlowData<ConfirmationInType>();

	console.log(tokenFrom, tokenTo)

	return (
		<div>
			<ConfirmationView
				name="Test"
				address={walletConversion("0xF2e62668f6Fd9Bb71fc4E80c44CeF32940E27a45")}
				tokenFrom="ETH"
				declaim="18"
				tokenTo="ETH"
				unitPrice={`1 ETH = 10 ETH`}
				amount={"100 ETH"}
				whitelist="Yes"
				start="Start"
				type="Fixed Swap Auction"
				children={undefined}
			/>
		</div>
	);
};

export const Confirmation = defineFlowStep<ConfirmationInType, {}, MaybeWithClassName & CommonType>(
	{
		Body: ConfirmationImp,
	}
);
