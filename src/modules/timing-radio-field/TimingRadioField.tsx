import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

type SelectFieldType = {
	className?: string;
	options: any[];
	value?: string;
	name: string;
};

export const SelectField: FC<SelectFieldType & MaybeWithClassName> = ({
	className,
	options,
	name,
	value,
}) => {
	return (
		<Field name={name} value={value}>
			{({ input }) => (
				<TimingRadio
					className={className}
					options={options}
					name={input.name}
					value={input.value}
					onChange={input.onChange}
				/>
			)}
		</Field>
	);
};
