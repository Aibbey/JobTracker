

export type IFrameMessage =
	| IFrameErrorMessage
	| IFrameMCPMessage
	| IFramePlatformRequestMessage
	| IFrameUIEventMessage;

export interface IFrameErrorMessage {
	type: "error";
	timestamp: string;

	error: IFrameError;
	source?: IFrameSource;

	mcpRequest?: IFrameMCPRequest;
	componentType?: string;
	componentInfo?: Record<string, unknown>;
	eventType?: string;
}

export interface IFrameMCPMessage {
	type: "mcp";

	[key: string]: unknown;
}

export interface IFramePlatformRequestMessage {
	type: "platform-request";
	timestamp: string;

	url: string;
	method: string;
	status: number;
	responseHeaders: Record<string, string>;
}

export interface IFrameUIEventMessage {
	type: "ui-event";
	timestamp: string;

	componentType?: string;
	eventType?: string;
	source?: IFrameSource;
}

type IFrameError = {
	message: string;
	stack?: string;
};

type IFrameMCPRequest = {
	serverUrl: string;
	method: string;
	url: string;
	transportType: string;
	params?: unknown;
};

type IFrameSource = {
	filePath: string;
	line?: number;
	column?: number;
};
