import React, { useCallback, useState } from 'react'
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

const RATIO = 0.005

const slipConfig = [0.5, 1, 2]
export interface ISwapparams {
    token0: TokenInfo,
    token1: TokenInfo,
    token0Amount: number
    token1Amount: number
}

export const Swap = ({
    token0, token1, token0Amount, token1Amount
}: ISwapparams) => {
    const [isResver, setIsResver] = useState(false)
    const [tokenFrom, setTokenFrom] = useState(token0)
    const [tokenTo, setTokenTo] = useState(token1)
    const [tragger, setTragger] = useState<'from' | 'to'>('from')
    const [isSlip, setIsSlip] = useState(false)

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

    return (

        <div className={styles.swapWrapper}>
            <Form
                onSubmit={() => {
                    alert('Exchange')
                }}
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
