import { SVGAttributes } from "react";

export const Add = (props: SVGAttributes<SVGElement>) => {
	return (
		<svg
			width="36"
			height="36"
			viewBox="0 0 36 36"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect width="36" height="36" rx="18" fill="white" />
			<path d="M12 18H24" stroke="black" strokeWidth="2" strokeLinecap="round" />
			<path d="M18 12L18 24" stroke="black" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
};
