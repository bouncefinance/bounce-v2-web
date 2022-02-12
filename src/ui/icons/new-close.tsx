import { SVGAttributes } from "react";

export const NewClose = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg width={18} viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M1.51471 17.9706L18.4853 1.00002"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<path
				d="M18.4853 17.9706L1.51473 1.00002"
				stroke={props.color}
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
};
