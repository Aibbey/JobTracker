

import * as NewAuth from "@/sdk/core/auth";
import { platformApi, platformRequest } from "@/sdk/core/request";

export const getAuthToken = NewAuth.getAuthToken;

export const getAuthTokenAsync = NewAuth.getAuthTokenAsync;

export const isAuthenticated = NewAuth.isAuthenticated;

export const isAuthenticatedSync = NewAuth.isAuthenticatedSync;

export const getAuthStatus = NewAuth.getAuthStatus;

export const getAuthStatusAsync = NewAuth.getAuthStatusAsync;

export const hasInvalidToken = NewAuth.hasInvalidToken;

export const hasInvalidTokenAsync = NewAuth.hasInvalidTokenAsync;

export const hasNoToken = NewAuth.hasNoToken;

export const hasNoTokenAsync = NewAuth.hasNoTokenAsync;

export const isLoading = NewAuth.isAuthenticating;

export const getAuthState = NewAuth.getAuthState;

export const addAuthStateListener = NewAuth.addAuthStateListener;

export const createAuthenticatedFetch = () => platformRequest.bind(null);

export const authenticatedFetch = platformRequest;

export const clearAuth = NewAuth.clearAuth;

export const refreshAuth = NewAuth.refreshAuth;

export const authApi = platformApi;

export const useCreaoAuth = NewAuth.useCreaoAuth;

export default {
	getAuthToken,
	getAuthTokenAsync,
	isAuthenticated,
	isAuthenticatedSync,
	getAuthStatus,
	getAuthStatusAsync,
	hasInvalidToken,
	hasInvalidTokenAsync,
	hasNoToken,
	hasNoTokenAsync,
	isLoading,
	getAuthState,
	addAuthStateListener,
	createAuthenticatedFetch,
	authenticatedFetch,
	clearAuth,
	refreshAuth,
	authApi,
	useCreaoAuth,
};
