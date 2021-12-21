import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { Lbp as LbpComponent} from "@app/pages/lbp";

import { pageWithLayout } from "@app/utils/pageInLayout";

const Lbp = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<LbpComponent />
			</NoSsr>
		);
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default Lbp;