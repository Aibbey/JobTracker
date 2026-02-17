

import { MCP_SERVERS, type McpServerId } from "../constants/mcp-server";
import { getAuthTokenAsync, isAuthenticatedSync } from "./auth";
import { APP_CONFIG } from "./global";
import { reportToParentWindow } from "./internal/creao-shell";
import type { IFrameMessage } from "./internal/internal-types";
import { platformRequest } from "./request";

const MCP_API_BASE_PATH = import.meta.env.VITE_MCP_API_BASE_PATH;

export interface MCPRequest {
	jsonrpc: "2.0";
	id: string;
	method: string;
	params?: unknown;
}

export interface MCPResponse {
	jsonrpc: "2.0";
	id: string;
	result?: unknown;
	error?: {
		code: number;
		message: string;
		data?: unknown;
	};
}

export interface MCPToolResponse {
	content: Array<{
		type: "text";
		text: string;
	}>;
}

async function internalCallService(
	serverUrl: string,
	mcpId: string,
	request: MCPRequest,
	transportType = "streamable_http",
): Promise<unknown> {
	const token = await getAuthTokenAsync();
	const isAuthenticated = isAuthenticatedSync();

	if (!isAuthenticated) {
		throw new Error("User not authenticated");
	}

	const baseReportData = {
		serverUrl,
		method: request.method,
		params: request.params,
		url: `${MCP_API_BASE_PATH}/execute-mcp/v2`,
		transportType,
	};

	try {

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			"X-CREAO-MCP-ID": mcpId,
		};

		const { taskId, projectId } = APP_CONFIG;
		if (taskId) headers["X-CREAO-API-TASK-ID"] = taskId;
		if (projectId) headers["X-CREAO-API-PROJECT-ID"] = projectId;

		const response = await platformRequest("/execute-mcp/v2", {
			method: "POST",
			headers,
			body: JSON.stringify({
				transportType,
				serverUrl,
				request,
			}),
		});

		if (!response.ok) {
			const errorMessage = `HTTP error! status: ${response.status}`;

			reportToParentWindow({
				type: "mcp",
				subType: "http-error",
				success: false,
				payload: {
					...baseReportData,
					error: {
						message: errorMessage,
						type: "http",
						status: response.status,
					},
				},
			} as IFrameMessage);
			throw new Error(errorMessage);
		}

		const data: MCPResponse = await response.json();

		if (data.error) {
			const errorMessage = data.error.message || "MCP request failed";

			reportToParentWindow({
				type: "mcp",
				subType: "data-error",
				success: false,
				payload: {
					...baseReportData,
					error: {
						message: errorMessage,
						type: "mcp-data",
						code: data.error.code,
						data: data.error.data,
					},
				},
			} as IFrameMessage);
			throw new Error(errorMessage);
		}

		reportToParentWindow({
			type: "mcp",
			subType: "response-success",
			success: true,
			payload: {
				...baseReportData,
				response: data,
			},
		} as IFrameMessage);

		return data.result;
	} catch (error) {

		if (error instanceof Error) {
			reportToParentWindow({
				type: "mcp",
				subType: "runtime-error",
				success: false,
				payload: {
					...baseReportData,
					error: {
						message: error.message,
						type: "runtime",
					},
				},
			} as IFrameMessage);
		}
		throw error;
	}
}

export async function listMCPTools(
	mcpId: McpServerId,
): Promise<unknown> {
	const { url, id } = MCP_SERVERS[mcpId] || findServerByUrl(mcpId);
	return internalCallService(url, id, {
		jsonrpc: "2.0",
		id: `list-tools-${Date.now()}`,
		method: "tools/list",
	});
}

export async function callMCPTool<
	TOutput = unknown,
	TInput = Record<string, unknown>,
>(
	mcpId: McpServerId,
	toolName: string,
	args: TInput,
): Promise<TOutput> {
	const { url, id } = MCP_SERVERS[mcpId] || findServerByUrl(mcpId);
	return internalCallService(url, id, {
		jsonrpc: "2.0",
		id: `call-tool-${Date.now()}`,
		method: "tools/call",
		params: {
			name: toolName,
			arguments: args,
		},
	}) as Promise<TOutput>;
}

function findServerByUrl(expected: string) {
	const lowerExpected = expected.toLowerCase().trim();
	const items = Object.values(MCP_SERVERS) as { url: string, name: string, id: string }[]
	for (const item of items) {
		if (
			item.url.toLowerCase().trim() === lowerExpected ||
			item.id.toLowerCase().trim() === lowerExpected ||
			item.name.toLowerCase() === lowerExpected
		) {
			return item;
		}
	}
	throw new Error(`Server not found for URL: ${expected}`);
}
