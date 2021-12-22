import { useWeb3React } from "@web3-react/core";
import { FC, useEffect, useState } from "react";

import { FormSpy } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";
import { Form } from "@app/modules/form";

import { ALERT_TYPE } from "@app/ui/alert";
import { PrimaryButton } from "@app/ui/button";
import { RightArrow2 } from "@app/ui/icons/arrow-right-2";

import { fromWei } from "@app/utils/bn/wei";
import {
    isFromToTokensDifferent,
} from "@app/utils/validation";
import { getBalance, getEthBalance, getTokenContract } from "@app/web3/api/bounce/erc";
import { isEth } from "@app/web3/api/eth/use-eth";
import { useTokenSearch } from "@app/web3/api/tokens";
import { useWeb3, useWeb3Provider } from "@app/web3/hooks/use-web3";

import styles from "./setting.module.scss";

type BuyingViewType = {
    onSubmit(values): void;
    tokenFrom: string;
    balance: number;
    initialValues: any;
};

export const AdvancedSettingForLbp: FC<MaybeWithClassName & BuyingViewType> = ({
    onSubmit,
    tokenFrom,
    balance,
    initialValues,
}) => {
    const [alert, setAlert] = useState<AlertType | undefined>();
    const [tokenTo, setTokenTo] = useState();
    const [newBalance, setNewBalance] = useState(0);
    const findToken = useTokenSearch();
    const web3 = useWeb3();
    const provider = useWeb3Provider();
    const { account } = useWeb3React();
    const tokenContract = getTokenContract(provider, findToken(tokenTo)?.address);

    type AlertType = {
        title: string;
        text: string;
        type: ALERT_TYPE;
    };

    useEffect(() => {
        if (!tokenTo) {
            return;
        }

        if (!isEth(findToken(tokenTo).address)) {
            getBalance(tokenContract, account).then((b) =>
                setNewBalance(parseFloat(fromWei(b, findToken(tokenTo).decimals).toFixed(6, 1)))
            );
        } else {
            getEthBalance(web3, account).then((b) =>
                setNewBalance(parseFloat(fromWei(b, findToken(tokenTo).decimals).toFixed(4, 1)))
            );
        }
    }, [web3, tokenContract, account, findToken, tokenTo]);

    return (
        <Form
            onSubmit={onSubmit}
            className={styles.form}
            initialValues={initialValues}
            validate={(values) => {
                setTokenTo(values.tokenTo);

                return { tokenTo: isFromToTokensDifferent<string>(tokenFrom, values.tokenTo) };
            }}
        >
            <h1>AdvancedSettingForLbp Page</h1>

            <FormSpy>
                {(form) => (
                    <PrimaryButton
                        className={styles.submit}
                        size="large"
                        iconAfter={<RightArrow2 width={18} style={{ marginLeft: 12 }} />}
                        submit
                    >
                        {initialValues.amount && form.dirty ? "Save" : "Next Step"}
                    </PrimaryButton>
                )}
            </FormSpy>
        </Form>
    );
};
