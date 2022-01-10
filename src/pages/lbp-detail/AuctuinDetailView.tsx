import styles from './ExtensionInfo.module.scss'
import { Icon } from '@app/modules/icon'
import { TokenInfo } from '@uniswap/token-lists'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from './assets/copy.svg'
import React from 'react'

interface AuctuinDetailViewParams {
    tokenFrom: TokenInfo
}

export const AuctuinDetailView = ({ tokenFrom }: AuctuinDetailViewParams) => {
    return (
        <div>
            <div className={styles.tokenInfo}>
                <div className={styles.tokenInfoTop}>
                    <Icon src={tokenFrom.logoURI} />
                    <h4>{tokenFrom.name}</h4>
                    <div>{tokenFrom.symbol}</div>
                </div>
                <div className={styles.tokenInfoBottom}>
                    <span>{tokenFrom.address}</span>
                    <CopyToClipboard text={tokenFrom.address}
                        onCopy={() => { }}>
                        <img src={copyIcon} alt="" />
                    </CopyToClipboard>
                </div>
            </div>
            <div className={styles.infoContent}>
                <div className={styles.infoContentLeft}>
                    <h4>Launch Description</h4>
                    <p>Task Description:
                        Create notifications for users when other people Like or Comment on your discussion post.

                        Task Requirement:
                        For every post and comment a user creates, the user should receive notifications for receiving likes and comments. Clicking on the notification should direct the user to the post for viewing.

                        Task Description:
                        Create notifications for users when other people Like or Comment on your discussion post.

                        Task Requirement:
                        For every post and comment a user creates, the user should receive notifications for receiving likes and comments.
                    </p>
                    <h5>Learn More Links</h5>
                    <p>
                        Https://www.fangible.com
                        <br />
                        Https://www.fangible.com/Create/PoolName/No125
                    </p>
                </div>

                <div className={styles.infoContentRight}>
                    <h4>Auction Details</h4>
                    <h5>Auction Period</h5>
                    <p>Dec 9, 2021 10:00 - Dec 12, 2021 20:00 </p>

                    <h5>Weights Settings</h5>
                    <p>
                        Start:  80% MONICA + 20% ETH
                        <br />
                        End:  50% MONICA + 50% ETH
                    </p>

                    <h5>Start Balances</h5>
                    <p>
                        100000.00 ETH
                        <br />
                        10000000.00 MONICA
                    </p>

                    <h5>Current Balances</h5>
                    <p>
                        120000.00 ETH
                        <br />
                        9000000.00 MONICA
                    </p>

                    <h5>Total Sold</h5>
                    <p>
                        100000.00 MONICA
                    </p>

                    <h5>Total Raised</h5>
                    <p>
                        10000.00 ETH
                    </p>
                </div>
            </div>
        </div>
    )
}
