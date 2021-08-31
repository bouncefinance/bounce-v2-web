import { Layout } from "@app/layout";
import NoSsr from "@app/modules/no-ssr/NoSsr";
import { RequireConnectedWallet } from "@app/modules/require-connected-wallet";
import { CreateProposal } from "@app/pages/create-proposal";
import { pageWithLayout } from "@app/utils/pageInLayout";

const CreateProposalPage = pageWithLayout(
	() => {
		return (
			<NoSsr>
				<RequireConnectedWallet>
					<CreateProposal />
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

export default CreateProposalPage;
