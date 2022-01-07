import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { LbpView } from "@app/pages/lbp/LbpView";
import { pageWithLayout } from "@app/utils/pageInLayout";

const LiveLBPPage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<RequireConnectedWallet>
					<LbpView type="live" />
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

export default LiveLBPPage;