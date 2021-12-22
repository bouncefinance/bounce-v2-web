import { useRouter } from "next/router";

import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { pageWithLayout } from "@app/utils/pageInLayout";
import { LBPDetail } from "@app/pages/lbp-detail";

const OtcViewPage = pageWithLayout(
	() => {
		const {
			query: { poolID },
		} = useRouter();

		return (
			<NoSsr>
				<RequireConnectedWallet>
					<LBPDetail poolID={+poolID}  />
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

export default OtcViewPage;
