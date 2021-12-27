import React, { FC } from "react";
import { Field } from "react-final-form";

import { MaybeWithClassName } from "@app/helper/react/types";

import { DateInterval } from "@app/ui/calendar/types";
import { DatePicker, DropdownPositionType, QuickNavType } from "@app/ui/date-picker";
import { isDateRequired } from "@app/utils/validation";
import { Slider, Tooltip } from "@material-ui/core";
import styles from './SliderField.module.scss'

type DateFieldType = {
	className?: string;
	value?: Date;
	name: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	labels: string[];
	quickNav?: Array<QuickNavType>;
	dropdownWidth?: string;
	dropdownPosition?: DropdownPositionType;
	min?: string;
	max?: string;
	selection?: DateInterval;
};

function ValueLabelComponent(props) {
	const { children, open, value } = props;

	return (
		<Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
			{children}
		</Tooltip>
	);
}

export const SliderField: FC<DateFieldType & MaybeWithClassName> = ({
	className,
	name,
	placeholder,
	readOnly,
	value,
	required,
	labels,
	quickNav,
	dropdownWidth,
	dropdownPosition,
	min,
	max,
	selection,
}) => {
	return (
		<Field name={name} value={value} validate={required ? isDateRequired : undefined}>
			{({ input, meta }) => (
				<Slider
					ValueLabelComponent={ValueLabelComponent}
					aria-label="custom thumb label"
					defaultValue={20}
					className={styles.slider}
					step={1}
					// color={'#4B70FF'}
				/>
			)}
		</Field>
	);
};
