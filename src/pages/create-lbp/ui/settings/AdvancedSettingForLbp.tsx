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
import { Label } from "@app/modules/label";
import { TextArea } from "@app/modules/text-area";
import { TextField } from "@app/modules/text-field";
import { RadioField } from "@app/modules/radio-field";
import { RadioGroup } from "@app/ui/radio-group";

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
            initialValues={{
                ...initialValues,
                Radio_1: 1,
                Radio_2: 1,
                Radio_3: 1,
            }}
            validate={(values) => {
                setTokenTo(values.tokenTo);

                return { tokenTo: isFromToTokensDifferent<string>(tokenFrom, values.tokenTo) };
            }}
        >

            <Label Component="label" className={styles.label} label="Token Launch Description">
                <TextArea
                    type="text"
                    name="description"
                    placeholder="Enter pool description (less than 2000 words)."
                    maxLength={2000}
                    className={styles.description}
                    required
                />
            </Label>

            <div className={styles.Secondary}>
                <Label Component="label" className={styles.label} label="Learn More Link">
                    <TextField
                        type="text"
                        name="socialLink"
                        placeholder="Enter a URL"
                        maxLength={100}
                    />
                    <p>Please enter a valid URL that starts with http:// or https://</p>
                </Label>
                <Label Component="label" className={styles.label} label="Trading Fee (%)">
                    <TextField
                        type="number"
                        name="tradingFee"
                        placeholder="1.00"
                        hasTip={true}
                        required
                        validate={(value: string)=>{
                            const num = Number(value)
                            if(!num){
                                return 'You have entered a non-numeric'
                            }
                            if(num < 1 || num > 3){
                                return 'Please enter a number from 1 % to 3 %'
                            }
                        }}
                    />
                    <p>Recommend to enter a trading fee between 1% - 3%.</p>
                </Label>
            </div>

            <div className={styles.radioBox}>
                <Label Component="div" label="Select Creation Typedsada">
                    <RadioGroup count={3}>
                        <RadioField
                            name="Radio_1"
                            label="Can pause swapping"
                            value={1}
                            tooltip="Create your preferred type of auction."
                        // checked={true}
                        />
                        <RadioField
                            name="Radio_2"
                            label="Can change swap fee"
                            value={1}
                            tooltip="(Over-the-Counter)  It  means  off-exchange  trading  is  done  directly  between  two  parties, without the supervision of an exchange."
                        />

                        <RadioField
                            name="Radio_3"
                            label="Can change weights"
                            value={1}
                            tooltip="Liquidity Providers Auction"
                        />
                    </RadioGroup>
                </Label>
            </div>

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
