import { FC } from "react";

import { OTC_TYPE } from "@app/api/otc/const";
import { MaybeWithClassName } from "@app/helper/react/types";

export const CreateLBP: FC<MaybeWithClassName & { type: OTC_TYPE }> = ({ type }) => {
	return (
        <h1>Create LBP Page</h1>
    )
};
