import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { Layout } from "../src/layout";
import NoSsr from "../src/modules/no-ssr/NoSsr";
import { Farm } from "../src/pages/farm";
import { pageWithLayout } from "../src/utils/pageInLayout";

const Index = pageWithLayout(
	() => {
		return (
			<RequireConnectedWallet>
				<Farm />
			</RequireConnectedWallet>
		);
	},
	({ children }) => (
		<NoSsr>
			<Layout title="" description="">
				{children}
			</Layout>
		</NoSsr>
	)
);

export default Index;
