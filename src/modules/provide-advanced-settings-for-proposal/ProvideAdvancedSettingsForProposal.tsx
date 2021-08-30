import { FC, useEffect, useState } from "react";
import { FormSpy, Field } from "react-final-form";

import { Form } from "@app/modules/form";
import { Label } from "@app/modules/label";
import { TextArea } from "@app/modules/text-area";
import { TimingRadio } from "@app/ui/timing-radio";
import { PrimaryButton } from "@app/ui/button";

import styles from "./ProvideAdvancedSettingsForProposal.module.scss";

type ProvideAdvancedSettingsForProposalType = {
	// initialState: any;
	onSubmit(values): void;
};

export const ProvideAdvancedSettingsForProposal: FC<ProvideAdvancedSettingsForProposalType> = ({
	onSubmit,
	// initialState,
}) => {
	const timingList = [1, 3, 5, 6, 7];
	const [selectedTiming, setSelectedTiming] = useState(timingList[0]);

	useEffect(() => {
		console.log("selectedTiming: ", selectedTiming);
	}, [selectedTiming]);

	return (
		<Form onSubmit={onSubmit} className={styles.form} /* initialValues={initialState} */>
			<Label Component="label" className={styles.label} label="For">
				<TextArea type="text" name="forText" placeholder="Formulate clear For position" required />
			</Label>
			<Label Component="label" className={styles.label} label="Against">
				<TextArea
					type="text"
					name="againstText"
					placeholder="Formulate clear Against position"
					required
				/>
			</Label>
			<Label Component="div" label="Proposal Timing">
				<Field name="timing">
					{({ input }) => {

						return (
							<TimingRadio
								timingList={timingList}
								value={selectedTiming}
								onChange={(timing) => {
									console.log("timing: ", timing);
									props.form.change("timing", timing);
									setSelectedTiming(timing);
								}}
							/>
						);
					}}
				</Field>
			</Label>
			<PrimaryButton className={styles.submit} size="large" submit>
				Create
			</PrimaryButton>
		</Form>
	);
};
