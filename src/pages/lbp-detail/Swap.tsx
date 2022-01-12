import React, { useCallback, useMemo, useState } from 'react'
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
import { FundManagement, getBounceProxyContract, getVaultContract, LbpSwap, SingleSwap } from '@app/web3/api/bounce/lbp';
import { useAccount, useChainId, useWeb3Provider } from '@app/web3/hooks/use-web3';
import { OPERATION } from './LBPDetail';
import { getUserDate } from '../create-lbp/createLBP';
import { toWei } from '@app/utils/bn/wei';

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
    token0, token1, token0Amount, token1Amount, setOperation
}: ISwapparams) => {
    const [isResver, setIsResver] = useState(false)
    const [tokenFrom, setTokenFrom] = useState(token0)
    const [tokenTo, setTokenTo] = useState(token1)
    const [tragger, setTragger] = useState<'from' | 'to'>('from')
    const [isSlip, setIsSlip] = useState(false)
    const provider = useWeb3Provider();
    const chainId = useChainId();
    const account = useAccount();
    const contract = useMemo(() => getVaultContract(provider, chainId), [chainId, provider]);

    const handleTranslate = useCallback(({ values, form }) => {
        const temp = tokenFrom
        setIsResver(!isResver)

        setTokenFrom(tokenTo)
        setTokenTo(temp)

        if (tragger === 'from') {
            const tempAmount = values.amountFrom
            form.change('amountFrom', values.amountTo)
            form.change('amountTo', tempAmount)
        } else {
            const tempAmount = values.amountFrom
            form.change('amountFrom', values.amountTo)
            form.change('amountTo', tempAmount)
        }

    }, [tokenFrom, tokenTo, tragger])

    const POOLID = '0x7dcb29e2db6f6db2da5d9e9de575a3a7cd8223ba000200000000000000000097'

    const handleSubmit = async () => {
        const singleSwap: SingleSwap = {
            poolId: POOLID,
            kind: 1,    // 0 转入   1  转出
            assetIn: '0x5e26fa0fe067d28aae8aff2fb85ac2e693bd9efa',  // Auction 
            assetOut: '0xc7ad46e0b8a400bb3c915120d284aafba8fc4735', // DAI
            amount: toWei(0.01, 18).toString(),
            userData: await getUserDate([toWei(0.01, 18).toString(), toWei(0.95, 18).toString()])
        }

        const fundManagement: FundManagement = {
            sender: account,
            fromInternalBalance: false,
            recipient: account,
            toInternalBalance: false
        }

        await LbpSwap(contract, account, {
            swap_struct: singleSwap,
            fund_struct: fundManagement,
            limit: 0,
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
                                    label={token0.address === tokenFrom.address ? "Launch Token Amount" : 'Currency'}
                                    after={
                                        <span className={styles.balance}>
                                            Balance: {isResver ? token1Amount : token0Amount} <Symbol token={tokenFrom.address} />
                                        </span>
                                    }
                                >
                                    <TextField
                                        type="number"
                                        name="amountFrom"
                                        placeholder="0.00"
                                        className={styles.inputBox}
                                        onChange={(e) => {
                                            setTragger('from')
                                            console.log(e.target.value)
                                        }}
                                        after={
                                            <div className={styles.amount}>
                                                <FormSpy>
                                                    {({ form }) => (
                                                        <button
                                                            className={styles.max}
                                                            onClick={() => {
                                                                const max = token1.address === tokenFrom.address ? token0Amount : token1Amount
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
                                                    <Currency coin={tokenFrom} small />
                                                }
                                            </div>
                                        }
                                    />
                                </Label>

                                <div className={styles.translate}>
                                    <img
                                        onClick={() => { handleTranslate(props) }}
                                        className={token1.address === tokenFrom.address ? styles.translated : ''}
                                        src={translateIcon}
                                        alt=""
                                    />
                                </div>

                                <Label
                                    Component="label"
                                    className={styles.row}
                                    label={token1.address === tokenFrom.address ? "Launch Token Amount" : 'Currency'}
                                    after={
                                        <span className={styles.balance}>
                                            Balance: {isResver ? token0Amount : token1Amount} <Symbol token={tokenTo.address} />
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
                                                                const max = token1.address === tokenFrom.address ? token1Amount : token0Amount
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
                                                    <Currency coin={tokenTo} small />
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
                                {'Exchange'}
                            </PrimaryButton>
                        )}
                    </FormSpy>
                </div>
            </Form >
        </div >
    )
}
