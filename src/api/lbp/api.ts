import { getJson } from "@app/api/network/json";
import { getAPIByNetwork } from "@app/api/utils";
import { WEB3_NETWORKS } from "@app/web3/networks/const";

import { ILBPHistory, ILBPList } from "./types";

type APIResponse<T> = {
	code: 200 | 500;
	error_msg: string;
	data: T;
	total: number;
};

const fetchInformation = async <T = any>(
	chainId: WEB3_NETWORKS,
	url: string,
	params
): Promise<APIResponse<T>> => {
	const apiPrefix = getAPIByNetwork(chainId);

	return getJson(undefined, `${apiPrefix}/${url}`, params);
};

export const fetchLbpList = async (
	chainId: WEB3_NETWORKS,
	status: number | undefined,
	pagination: {
		page: number;
		perPage: number;
	}
): Promise<{
	data: ILBPList[];
	meta: {
		total: number;
	};
}> => {
	const res = await fetchInformation<ILBPList[]>(chainId, "lbp", {
		status,
		offset: pagination.page * pagination.perPage,
		limit: pagination.perPage,
	});

	if (!res.data) {
		console.error(res);
		throw new Error("failed to load data:" + res.error_msg);
	}

	return {
		data: res.data,
		meta: {
			total: res.total,
		},
	};
};

// lbp 详情 history
export const fetchLbpHistory = async (
	chainId: WEB3_NETWORKS,
	address: string,
	pagination: {
		page: number;
		perPage: number;
	}
): Promise<{
	data: ILBPHistory[];
	meta: {
		total: number;
	};
}> => {
	const res = await fetchInformation<ILBPHistory[]>(chainId, "lbp/history", {
		address,
		offset: pagination.page * pagination.perPage,
		limit: pagination.perPage,
	});

	if (!res.data) {
		console.error(res);
		throw new Error("failed to load data:" + res.error_msg);
	}

	return {
		data: res.data,
		meta: {
			total: res.total,
		},
	};
};
