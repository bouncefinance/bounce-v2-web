import { MaybeWithClassName } from '@app/helper/react/types';
import { Button, CommonType, PrimaryButton } from '@app/ui/button/Button';
import { DescriptionList } from '@app/ui/description-list';
import { Spinner } from '@app/ui/spinner';
import { Heading3 } from '@app/ui/typography';
import classNames from 'classnames';
import React, { FC, ReactNode, useState } from 'react'
import styles from './Confirmation.module.scss'
import { SerialNo } from './SerialNo';
import approved from './approved.svg'

type ConfirmationType = {
    name: string;
    type: string;
    address: string;
    tokenFrom: ReactNode;
    declaim: string;
    tokenTo: ReactNode;
    unitPrice: ReactNode;
    amount: ReactNode;
    whitelist: string;
    start: string;
};

export const ConfirmationView: FC<MaybeWithClassName & ConfirmationType & CommonType> = ({
    className,
    name,
    type,
    address,
    tokenFrom,
    declaim,
    tokenTo,
    unitPrice,
    amount,
    whitelist,
    start,
}) => {
    const [approveTokenFrom, setApproveTokenFrom] = useState(false)
    const [approveTokenTo, setApproveTokenTo] = useState(false)
    const [approveTokenFromloading, setApproveTokenFromLoading] = useState(false)
    const [approveTokenToLoading, setApproveTokenToLoading] = useState(false)

    const TOKEN_DATA = {
        "Contact address": address,
        "Token symbol": tokenFrom,
        "Token declaim": declaim,
    };

    const PARAMETERS_DATA = {
        "Pool type": type,
        "Desired Amount": amount,
        "Receipt Currency": tokenTo,
        "Unit Price": unitPrice,
    };

    const SETTINGS_DATA = {
        Participations: whitelist,
        "Start time": start,
    };

    return (
        <div className={classNames(className, styles.component)}>
            <Heading3 className={styles.subTitle}>{'MONICA Token Launch Auction Pool'}</Heading3>
            <div className={styles.body}>
                <div className={styles.leftInfo}>
                    <div className={styles.wrapperBox}>
                        <DescriptionList title="Token Information" data={TOKEN_DATA} />
                    </div>
                    <div className={styles.wrapperBox}>

                        <DescriptionList title="OTC Parameters" data={PARAMETERS_DATA} />
                    </div>
                    <div className={styles.wrapperBox}>

                        <DescriptionList title="Advanced Setting" data={SETTINGS_DATA} />
                    </div>
                </div>
                <div className={styles.rightOption}>
                    <div className={styles.step}>
                        <SerialNo
                            no={1}
                            text='Confirm all parameters and launch the auction'
                            hasNext
                        />

                        <SerialNo
                            no={2}
                            text='Approve interactions with auctioned and collateral tokens'
                        >
                            <div className={styles.approveButtonBox}>
                                <div className={styles.approveFrom}>
                                    <Button
                                        onClick={() => { }}
                                        variant="outlined"
                                        color="primary-white"
                                        disabled={approveTokenFromloading}
                                        size="large"
                                    >
                                        {approveTokenFromloading ?
                                            <Spinner size="small" /> : "Approve MONICA interactions"}
                                    </Button>
                                    <img src={approved} alt="" />
                                </div>


                                <div className={styles.approveTo}>
                                    <Button
                                        onClick={() => { }}
                                        disabled={approveTokenToLoading}
                                        variant='contained'
                                        color="primary-black"
                                        size="large"
                                    >
                                        {approveTokenToLoading ? <Spinner size="small" /> : "Approve ETH interactions"}
                                    </Button>
                                </div>

                                {/*  <Button
                                    size="medium"
                                    variant="outlined"
                                    color="primary-white"
                                    onClick={()=>{history.push('/create/lbp')}}
                                    >
                                        Create Auction
                                    </Button> */}
                            </div>
                        </SerialNo>
                    </div>
                </div>
            </div>
        </div>
    );
};