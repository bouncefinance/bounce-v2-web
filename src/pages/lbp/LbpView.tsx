import { Button, NavLink } from '@app/ui/button'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import styles from './Lbp.module.scss'

interface LbpType {

}

export const LbpView: FC<LbpType> = () => {
    const history = useRouter()

    return (
        <div className={styles.container}>
            <div className={styles.banner}>

            </div>

            <Button
             size="medium"
              variant="outlined"
               color="primary-white"
               onClick={()=>{history.push('/create/lbp')}}
            >
                Create Auction
            </Button>

        
        </div>
    )
}
