import { useRouter } from "next/router";

import { OTC_TYPE } from "@app/api/otc/const";
import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { pageWithLayout } from "@app/utils/pageInLayout";
import { CreateLBP } from "@app/pages/create-lbp";

const LBPCreatePage = pageWithLayout(
	() => {
		const router = useRouter();
		const { type } = router.query;

		return (
			<NoSsr>
				<RequireConnectedWallet>
					<CreateLBP />
				</RequireConnectedWallet>
			</NoSsr>
		);
	},
	({ children }) => (
		<Layout title="" description="">
			{children}
		</Layout>
	)
);

export default LBPCreatePage;
