import { Button } from '@app/ui/button'
import { getBounceProxyContract, setPoolEnabled, withDrawAllLbpPool } from '@app/web3/api/bounce/lbp'
import { useAccount, useChainId, useWeb3Provider } from '@app/web3/hooks/use-web3'
import { ListItem, ListItemSecondaryAction, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { useMemo, useState } from 'react'
import styles from './ExtensionInfo.module.scss'
import { OPERATION } from './LBPDetail'


const useStyles = makeStyles({
    root: {
        '.MuiSwitch-colorPrimary.Mui-checked': {
            color: '#000'
        }
    }
})

interface IAuctionSettingViewParams {
    setOperation: React.Dispatch<React.SetStateAction<OPERATION>>
}

export const AuctionSettingView = ({
    setOperation
}: IAuctionSettingViewParams) => {
    const [isEnabled, setIsEnabled] = useState(false)
    const [isEnabledLoading, setIsEnabledALoading] = useState(false)
    const classes = useStyles();
    const provider = useWeb3Provider();
    const chainId = useChainId();
    const account = useAccount();
    const contract = useMemo(() => getBounceProxyContract(provider, chainId), [chainId, provider]);

    const handleWithdraw = async () => {
        try {
            await withDrawAllLbpPool(contract, account,
                {
                    pool: '0xac4df2d3de5d4ebf7be1ec7eeee78f58c1aec903',
                    minAmountsOut: [0, 0],
                    maxBPTTokenOut: [0, 0]
                }
            )
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
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeEnable = async () => {
        if (isEnabledLoading) return
        setIsEnabledALoading(true)
        const willEnable = !isEnabled

        setIsEnabled(willEnable)
        try {
            await setPoolEnabled(contract, account, {
                poolAddress: '0xac4df2d3de5d4ebf7be1ec7eeee78f58c1aec903',
                swapEnabled: willEnable
            })
                .on("transactionHash", (h) => {
                    // console.log("hash", h);7
                    setOperation(OPERATION.pending);
                    setIsEnabledALoading(false)
                })
                .on("receipt", (r) => {
                    // console.log("receipt", r);
                    setOperation(OPERATION.success);
                    
                })
                .on("error", (e) => {
                    // console.error("error", e);
                    setOperation(OPERATION.error);
                    setIsEnabled(!willEnable)
                });
        } catch (error) {
            console.log(error)
            setIsEnabled(!willEnable)
            setIsEnabledALoading(false)
        }
    }

    return (
        <div>
            <div className={styles.centerWrapper}>
                <h4>Trading Status</h4>
                <div className={styles.enabled}>
                    <ListItem>
                        <p>Buy/Sell function is enabled</p>
                        <ListItemSecondaryAction>
                            <Switch
                                color='primary'
                                classes={classes}
                                size='medium'
                                edge="end"
                                onChange={handleChangeEnable}
                                checked={isEnabled}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </div>

                <h4>Pool Balances</h4>
                <div className={styles.poolCard}>
                    <div>
                        <h5>Current Balances</h5>
                        <p>
                            120000.00 ETH
                            <br />
                            9000000.00 MONICA
                        </p>

                        <h5>Swap Fees Collected By Project</h5>
                        <p>
                            50.00 ETH
                        </p>
                    </div>
                    <div className={styles.poolCardRight}>
                        <Button
                            className={styles.withdrawBtn}
                            color='primary-black'
                            variant='contained'
                            onClick={handleWithdraw}
                        >
                            Withdraw All
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

