import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Swap.module.scss'
import settingIcon from './assets/setting.svg'
import translateIcon from './assets/translate.svg'
import { Form } from "@app/modules/form";
import { FormSpy } from 'react-final-form'
import { Label } from '@app/modules/label'
import { Symbol } from "@app/modules/symbol";
import { Currency } from '@app/modules/currency'
import { TextField } from '@app/modules/text-field'
import { Button, PrimaryButton } from '@app/ui/button';
import { TokenInfo } from '@uniswap/token-lists';
import Bignumber from 'bignumber.js'
import ClickAwayListener from 'react-click-away-listener';
import { approveLbpVault, FundManagement, getBounceProxyContract, getLbpVaultAllowance, getLiquidityBootstrappingPoolContract, getVaultContract, LbpSwap, SingleSwap } from '@app/web3/api/bounce/lbp';
import { useAccount, useChainId, useWeb3Provider } from '@app/web3/hooks/use-web3';
import { OPERATION } from './LBPDetail';
import { getUserDate } from '../create-lbp/createLBP';
import { numToWei, toWei, unlimitedAuthorization } from '@app/utils/bn/wei';
import { isEqualZero } from '@app/utils/validation';
import { getTokenContract } from '@app/web3/api/bounce/erc';
import { isLessThan } from '@app/utils/bn';
import { LBPPairData } from './LBPPairData';

const RATIO = 0.005

const slipConfig = [0.5, 1, 2]
export interface ISwapparams {
    token0: TokenInfo,
    token1: TokenInfo,
    token0Amount: number
    token1Amount: number
    setOperation: React.Dispatch<React.SetStateAction<OPERATION>>
}

export const Swap = ({
    token0: tokenFrom, token1: tokenTo, token0Amount, token1Amount, setOperation
}: ISwapparams) => {
    const POOL_ADDRESS = '0x05cdd556040c1b1a2d1c45d02d3889a318a3ce0b'
    const POOL_ID = '0x05cdd556040c1b1a2d1c45d02d3889a318a3ce0b000200000000000000000099'

    const [isResver, setIsResver] = useState(false)
    const [tokenIsApprove, setTokenIsApprove] = useState(false)
    const [tragger,] = useState<'from' | 'to'>('from')
    const [isSlip, setIsSlip] = useState(false)
    const provider = useWeb3Provider();
    const chainId = useChainId();
    const account = useAccount();
    const vaultContract = useMemo(() => getVaultContract(provider, chainId), [chainId, provider]);
    const lbpPairContract = useMemo(() => getLiquidityBootstrappingPoolContract(provider, POOL_ADDRESS), [provider, POOL_ADDRESS]);

    const handleTranslate = useCallback(({ values, form }) => {
        setIsResver(!isResver)

        if (tragger === 'from') {
            const tempAmount = values.amountFrom
            form.change('amountFrom', values.amountTo)
            form.change('amountTo', tempAmount)
        } else {
            const tempAmount = values.amountFrom
            form.change('amountFrom', values.amountTo)
            form.change('amountTo', tempAmount)
        }
    }, [tokenFrom, tokenTo, tragger, isResver])

    useEffect(() => {
        (async () => {
            try {
                if (isEqualZero(tokenFrom.address)) return setTokenIsApprove(true)
                const tokenContract = getTokenContract(provider, tokenFrom.address);
                const allowance = await getLbpVaultAllowance(
                    tokenContract,
                    chainId,
                    account
                );


                if (!isLessThan(allowance, isResver ? token1Amount : token0Amount)) {
                    setTokenIsApprove(true)
                } else {
                    setTokenIsApprove(false)
                }
            } catch (error) {

            }
        })()
    }, [tokenFrom])

    const handleApprove = useCallback(async () => {
        if (isEqualZero(tokenFrom.address)) return
        const tokenContract = getTokenContract(provider, tokenFrom.address);
        approveLbpVault(tokenContract, chainId, account, unlimitedAuthorization)
            .on("transactionHash", (h) => {
                setOperation(OPERATION.approval);
            })
            .on("receipt", (r) => {
                setOperation(OPERATION.success);
                setTokenIsApprove(true)
            })
            .on("error", (e) => {
                setOperation(OPERATION.error);
            });
    }, [tokenFrom])

    const pairDate = new LBPPairData(lbpPairContract, vaultContract)

    const updatePrice = useCallback(async () => {
        console.log(await pairDate.getPoolIdByte32())
    }, [])

    updatePrice()

    const handleSubmit = async () => {
        if (!tokenIsApprove) return handleApprove()

        const singleSwap: SingleSwap = {
            poolId: POOL_ID,
            kind: 0,    // 0 转入   1  转出
            assetIn: '0x5e26fa0fe067d28aae8aff2fb85ac2e693bd9efa',  // AUCTION 
            assetOut: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b', // USDC
            amount: toWei(0.03, 18).toString(),
            userData: await getUserDate([toWei(0.033, 18).toString(), toWei(0.01, 6).toString()])
        }

        const fundManagement: FundManagement = {
            sender: account,
            fromInternalBalance: false,
            recipient: account,
            toInternalBalance: false
        }

        await LbpSwap(vaultContract, account, {
            swap_struct: singleSwap,
            fund_struct: fundManagement,
            // limit: toWei(0.0002, 6).toString(),
            limit: '0',
            deadline: new Bignumber(99999999999999).multipliedBy(new Bignumber(10).pow(5)).toString()
        })
            .on("transactionHash", (h) => {
                // console.log("hash", h);7
                setOperation(OPERATION.pending);
            })
            .on("receipt", (r) => {
                // console.log("receipt", r);
                setOperation(OPERATION.success);
                // setLastOperation(null);
                // setPoolId(r.events.Created.returnValues[0]);
            })
            .on("error", (e) => {
                // console.error("error", e);
                setOperation(OPERATION.error);
            });
    }

    return (
        <div className={styles.swapWrapper}>
            <Form
                onSubmit={handleSubmit}
                className={styles.form}
            // initialValues={''}
            >
                <div className={styles.header}>
                    <h4 className={styles.title}>Join The Pool</h4>
                    <div className={styles.setting}>
                        <img src={settingIcon} onClick={() => { setIsSlip(!isSlip) }} alt="" />
                        {isSlip &&
                            <ClickAwayListener onClickAway={() => {
                                setIsSlip(false)
                            }}>
                                <div className={styles.slip}>
                                    <span>Slippage tolerance</span>
                                    <FormSpy>
                                        {
                                            ({ form, values }) => (
                                                <div>
                                                    {slipConfig.map(item => {
                                                        return <Button
                                                            variant={
                                                                values.slip === item ? 'contained' : 'outlined'
                                                            } color={
                                                                values.slip === item ? 'primary-black' : 'primary-white'
                                                            }
                                                            onClick={() => {
                                                                form.change('slip', item)
                                                            }}> {new Bignumber(item).toFixed(1).toString()}%
                                                        </Button>
                                                    })}
                                                    <TextField
                                                        className={styles.slipInput}
                                                        name='slip'
                                                        type="number"
                                                        placeholder='0.1'
                                                        after={
                                                            <span className={styles.inputAfter}>%</span>
                                                        }
                                                        onChange={(e) => {
                                                            if (Number(e.target.value) > 99) {
                                                                form.change('slip', 99)
                                                            } else if (Number(e.target.value) < 0) {
                                                                form.change('slip', 0)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }
                                    </FormSpy>
                                </div>
                            </ClickAwayListener>
                        }
                    </div>
                </div >

                <div className={styles.showPrice}>
                    <strong>Current Price</strong>
                    <p>1 {tokenTo.symbol} = ~{
                        isResver ? new Bignumber(RATIO).dp(6).toString() : new Bignumber(1).div(RATIO).dp(6).toString()
                    } {tokenFrom.symbol} </p>
                </div>

                <div className={styles.container}>

                    <FormSpy subscription={{ values: true }}>
                        {(props) => (
                            <>
                                <Label
                                    Component="label"
                                    className={styles.row}
                                    label={isResver ? 'Currency' : "Launch Token Amount"}
                                    after={
                                        <span className={styles.balance}>
                                            Balance: {isResver ? token1Amount : token0Amount} <Symbol token={(isResver ? tokenTo : tokenFrom).address} />
                                        </span>
                                    }
                                >
                                    <TextField
                                        type="number"
                                        name="amountFrom"
                                        placeholder="0.00"
                                        className={styles.inputBox}
                                        onChange={(e) => {
                                            ('from')
                                            console.log(e.target.value)
                                        }}
                                        after={
                                            <div className={styles.amount}>
                                                <FormSpy>
                                                    {({ form }) => (
                                                        <button
                                                            className={styles.max}
                                                            onClick={() => {
                                                                const max = isResver ? token1Amount : token0Amount
                                                                form.change(
                                                                    "amountFrom",
                                                                    max
                                                                )
                                                            }
                                                            }
                                                            type="button"
                                                        >
                                                            MAX
                                                        </button>

                                                    )}
                                                </FormSpy>
                                                {
                                                    <Currency coin={isResver ? tokenTo : tokenFrom} small />
                                                }
                                            </div>
                                        }
                                    />
                                </Label>

                                <div className={styles.translate}>
                                    <img
                                        onClick={() => { handleTranslate(props) }}
                                        className={isResver ? styles.translated : ''}
                                        src={translateIcon}
                                        alt=""
                                    />
                                </div>

                                <Label
                                    Component="label"
                                    className={styles.row}
                                    label={isResver ? "Launch Token Amount" : 'Currency'}
                                    after={
                                        <span className={styles.balance}>
                                            Balance: {isResver ? token0Amount : token1Amount} <Symbol token={(isResver ? tokenFrom : tokenTo).address} />
                                        </span>
                                    }
                                >
                                    <TextField
                                        type="number"
                                        name="amountTo"
                                        placeholder="0.00"
                                        after={
                                            <div className={styles.amount}>
                                                <FormSpy>
                                                    {({ form }) => (
                                                        <button
                                                            className={styles.max}
                                                            onClick={() => {
                                                                const max = isResver ? token0Amount : token1Amount
                                                                form.change(
                                                                    "amountTo",
                                                                    max
                                                                )
                                                            }
                                                            }
                                                            type="button"
                                                        >
                                                            MAX
                                                        </button>

                                                    )}
                                                </FormSpy>
                                                {
                                                    <Currency coin={isResver ? tokenFrom : tokenTo} small />
                                                }
                                            </div>
                                        }
                                    />
                                </Label>
                                <div className={styles.tradingFee}>
                                    <span>Trading Fee is 1%</span>
                                </div>
                            </>
                        )}
                    </FormSpy>
                    <FormSpy>
                        {(form) => (
                            <PrimaryButton
                                className={styles.submit}
                                size="large"
                                submit
                            >
                                {
                                    tokenIsApprove ? 'Exchange' : `Approve ${tokenFrom.symbol}`
                                }
                            </PrimaryButton>
                        )}
                    </FormSpy>
                </div>
            </Form >
        </div >
    )
}
