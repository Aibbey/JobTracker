import { create } from "zustand";

interface AuthMessage {
	type: "CREAO_AUTH_TOKEN";
	token: string;
	origin: string;
}

type AuthStatus =
	| "authenticated"
	| "unauthenticated"
	| "invalid_token"
	| "loading";

interface AuthState {
	token: string | null;
	status: AuthStatus;
	parentOrigin: string | null;
}

interface AuthStore extends AuthState {

	initializationPromise: Promise<void> | null;
	validationPromise: Promise<boolean> | null;

	setToken: (token: string, origin?: string) => Promise<void>;
	setStatus: (status: AuthStatus) => void;
	setState: (state: Partial<AuthState>) => void;
	clearAuth: () => Promise<void>;
	refreshAuth: () => Promise<boolean>;
	initialize: () => Promise<void>;
	validateToken: (token: string) => Promise<boolean>;
}

const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;

const useAuthStore = create<AuthStore>(
	(set, get): AuthStore => ({

		token: null,
		status: "loading",
		parentOrigin: null,
		initializationPromise: null,
		validationPromise: null,

		setStatus: (status: AuthStatus) => {
			set({ status });
		},

		setState: (newState: Partial<AuthState>) => {
			set(newState);
		},

		validateToken: async (token: string): Promise<boolean> => {
			console.log("Validating token...", { API_BASE_PATH: API_BASE_PATH });

			if (!API_BASE_PATH) {
				console.error("API_BASE_PATH is not set");
				return false;
			}

			try {
				const response = await fetch(`${API_BASE_PATH}/me`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				console.log("Token validation response:", response.status, response.ok);
				return response.ok;
			} catch (error) {
				console.warn("Token validation failed:", error);
				return false;
			}
		},

		setToken: async (token: string, origin?: string): Promise<void> => {
			const { validateToken } = get();
			const isValid = await validateToken(token);

			if (isValid) {
				set({
					token,
					status: "authenticated",
					parentOrigin: origin || get().parentOrigin,
				});

				localStorage.setItem("creao_auth_token", token);
			} else {

				set({
					token: null,
					status: "invalid_token",
					parentOrigin: origin || get().parentOrigin,
				});
				localStorage.removeItem("creao_auth_token");
			}
		},

		clearAuth: async (): Promise<void> => {
			set({
				token: null,
				status: "unauthenticated",
				parentOrigin: null,
			});
			localStorage.removeItem("creao_auth_token");
		},

		refreshAuth: async (): Promise<boolean> => {
			const { token, validateToken } = get();

			if (!token) {
				return false;
			}

			const isValid = await validateToken(token);
			if (!isValid) {
				set({ status: "invalid_token" });
				localStorage.removeItem("creao_auth_token");
				return false;
			}

			set({ status: "authenticated" });
			return true;
		},

		initialize: async (): Promise<void> => {
			console.log("Auth initialization started");
			try {

				await initializeFromStorage(get, set);

				await initializeFromUrl(get);

				setupMessageListener(get);

				const currentStatus = get().status;
				if (currentStatus === "loading") {
					console.log(
						"Auth initialization complete - setting to unauthenticated",
					);
					set({ status: "unauthenticated" });
				} else {
					console.log("Auth initialization complete - status:", currentStatus);
				}
			} catch (error) {
				console.error("Auth initialization failed:", error);
				set({ status: "unauthenticated" });
			}
		},
	}),
);

async function initializeFromStorage(
	get: () => AuthStore,
	set: (state: Partial<AuthStore>) => void,
): Promise<void> {
	console.log("Initializing auth from storage...");
	const storedToken = localStorage.getItem("creao_auth_token");
	if (storedToken) {
		console.log("Found stored token, validating...");
		const { validateToken } = get();
		const isValid = await validateToken(storedToken);
		if (isValid) {
			console.log("Stored token is valid");
			set({
				token: storedToken,
				status: "authenticated",
			});
		} else {
			console.log("Stored token is invalid, clearing...");
			localStorage.removeItem("creao_auth_token");
			set({ status: "invalid_token" });
		}
	} else {
		console.log("No stored token found");
		set({ status: "unauthenticated" });
	}
}

async function initializeFromUrl(get: () => AuthStore): Promise<void> {
	const urlParams = new URLSearchParams(window.location.search);
	const authToken = urlParams.get("auth_token");

	if (authToken) {
		const { setToken } = get();
		await setToken(authToken);

		cleanupUrl();
	}
}

function setupMessageListener(get: () => AuthStore): void {
	window.addEventListener("message", async (event: MessageEvent) => {
		try {
			const data = event.data as AuthMessage;

			if (data?.type === "CREAO_AUTH_TOKEN" && data.token) {
				const { setToken } = get();
				await setToken(data.token, event.origin);
			}
		} catch (error) {
			console.warn("Error processing auth message:", error);
		}
	});
}

function cleanupUrl(): void {
	const url = new URL(window.location.href);
	url.searchParams.delete("auth_token");
	window.history.replaceState({}, document.title, url.toString());
}

const initPromise = (async () => {
	const { initialize } = useAuthStore.getState();
	await initialize();
})();

async function ensureInitialized(): Promise<void> {
	await initPromise;
}

export function useCreaoAuth() {
	const token = useAuthStore((state) => state.token);
	const status = useAuthStore((state) => state.status);
	const parentOrigin = useAuthStore((state) => state.parentOrigin);
	const clearAuth = useAuthStore((state) => state.clearAuth);
	const refreshAuth = useAuthStore((state) => state.refreshAuth);

	return {
		token,
		status,
		parentOrigin,
		isAuthenticated: status === "authenticated" && !!token,
		isLoading: status === "loading",
		hasInvalidToken: status === "invalid_token",
		hasNoToken: status === "unauthenticated",
		clearAuth,
		refreshAuth,
	};
}

export async function initializeAuthIntegration(): Promise<void> {
	await ensureInitialized();
	console.log("Auth integration initialized");
}

export function getAuthToken(): string | null {
	return useAuthStore.getState().token;
}

export async function getAuthTokenAsync(): Promise<string | null> {
	await ensureInitialized();
	return useAuthStore.getState().token;
}

export async function isAuthenticated(): Promise<boolean> {
	await ensureInitialized();

	const { token, status, validateToken, clearAuth } = useAuthStore.getState();

	if (!token) {
		return false;
	}

	if (status === "authenticated") {
		return true;
	}

	if (token) {
		const isValid = await validateToken(token);

		if (isValid) {
			useAuthStore.setState({ status: "authenticated" });
			return true;
		}

		await clearAuth();
		return false;
	}

	return false;
}

export function isAuthenticatedSync(): boolean {
	const { status, token } = useAuthStore.getState();
	return status === "authenticated" && !!token;
}

export function getAuthStatus(): AuthStatus {
	return useAuthStore.getState().status;
}

export async function getAuthStatusAsync(): Promise<AuthStatus> {
	await ensureInitialized();
	return useAuthStore.getState().status;
}

export function hasInvalidToken(): boolean {
	return useAuthStore.getState().status === "invalid_token";
}

export async function hasInvalidTokenAsync(): Promise<boolean> {
	await ensureInitialized();
	return useAuthStore.getState().status === "invalid_token";
}

export function hasNoToken(): boolean {
	return useAuthStore.getState().status === "unauthenticated";
}

export async function hasNoTokenAsync(): Promise<boolean> {
	await ensureInitialized();
	return useAuthStore.getState().status === "unauthenticated";
}

export function isAuthenticating(): boolean {
	return useAuthStore.getState().status === "loading";
}

export function getAuthState(): AuthState {
	const { token, status, parentOrigin } = useAuthStore.getState();
	return { token, status, parentOrigin };
}

export function addAuthStateListener(
	listener: (state: AuthState) => void,
): () => void {

	const currentState = getAuthState();
	listener(currentState);

	const unsubscribe = useAuthStore.subscribe((state) => {
		const { token, status, parentOrigin } = state;
		listener({ token, status, parentOrigin });
	});

	return unsubscribe;
}

export async function clearAuth(): Promise<void> {
	return useAuthStore.getState().clearAuth();
}

export async function refreshAuth(): Promise<boolean> {
	return useAuthStore.getState().refreshAuth();
}

function decodeJwtPayload(token: string): Record<string, any> | null {
	try {

		const parts = token.split(".");
		if (parts.length !== 3) {
			console.warn("Invalid JWT token format");
			return null;
		}

		const payload = parts[1];

		const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
		const paddedBase64 =
			base64 + "=".repeat((4 - (base64.length % 4)) % 4);

		const decodedPayload = atob(paddedBase64);
		return JSON.parse(decodedPayload);
	} catch (error) {
		console.warn("Failed to decode JWT token:", error);
		return null;
	}
}

export function getUserId(): string | null {
	const token = useAuthStore.getState().token;

	if (!token) {
		return null;
	}

	const payload = decodeJwtPayload(token);
	if (!payload) {
		return null;
	}

	return payload.userId || payload.sub || null;
}

export async function getUserIdAsync(): Promise<string | null> {
	await ensureInitialized();
	return getUserId();
}
