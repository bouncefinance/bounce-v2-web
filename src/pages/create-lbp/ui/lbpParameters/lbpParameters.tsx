import { defineFlowStep } from '@app/modules/flow/definition';
import { useFlowControl, useFlowData } from '@app/modules/flow/hooks';
import { TokenInfo } from '@uniswap/token-lists';
import { useMemo } from 'react';
import { LbpParametersView } from './LbpParametersView';


type ParameterInType = {
    tokenFrom: TokenInfo
	tokenTo: TokenInfo
};

export type ParameterOutType = {
    tokenTo: string;
    unitPrice: number;
    amount: number;
    buyingFormValues: any;
};

const LbpParameterImp = () => {
    const { moveForward, addData, data } = useFlowControl<ParameterOutType>();
    const { tokenFrom, tokenTo } = useFlowData<ParameterInType>();
  
    const initialValues = useMemo(
        () => ({ tokenFrom, allocation: "limited", ...data.buyingFormValues }),
        [data.buyingFormValues, tokenFrom]
    );

    // const findToken = useTokenSearch();
    // const web3 = useWeb3();
    // const provider = useWeb3Provider();
    // const { account } = useWeb3React();

    // const [balance, setBalance] = useState(0);
    // const tokenContract = getTokenContract(provider, findToken(tokenFrom).address);

    // useEffect(() => {
    // 	if (!isEth(findToken(tokenFrom).address)) {
    // 		getBalance(tokenContract, account).then((b) =>
    // 			setBalance(parseFloat(fromWei(b, findToken(tokenFrom).decimals).toFixed(6, 1)))
    // 		);
    // 	} else {
    // 		getEthBalance(web3, account).then((b) =>
    // 			setBalance(parseFloat(fromWei(b, findToken(tokenFrom).decimals).toFixed(4, 1)))
    // 		);
    // 	}
    // }, [web3, tokenContract, account, findToken, tokenFrom]);

    const onSubmit = async (values: any) => {
        addData({
            // tokenTo: values.tokenTo,
            // unitPrice: parseFloat(values.unitPrice),
            // amount: parseFloat(values.amount),
            // buyingFormValues: values,
        });

        moveForward();
    };

    return (
        <LbpParametersView
            onSubmit={onSubmit}
            tokenFrom={''}
            balance={0.888}
            initialValues={initialValues}
        />
    );
};


export const lbpParameters = defineFlowStep<ParameterInType, ParameterOutType, {}>({
    Body: LbpParameterImp,
});

