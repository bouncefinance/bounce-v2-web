import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { PrivacyPolicy } from "@app/pages/privacy-policy";

import { pageWithLayout } from "@app/utils/pageInLayout";

const PrivacyPolicyPage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<PrivacyPolicy />
			</NoSsr>
		);
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default PrivacyPolicyPage;
