import { $fetch, FetchError, FetchOptions } from "ohmyfetch";
import { UploadableMap } from "relay-runtime/lib/network/RelayNetworkTypes";
import { RequestParameters } from "relay-runtime/lib/util/RelayConcreteNode";
import {
  CacheConfig,
  Variables
} from "relay-runtime/lib/util/RelayRuntimeTypes";
import { RequestContext } from "./request-context/RequestContext";

interface RequestInit {
  method: string;
  body?: FormData | string;
  credentials: "include";
  headers: { [key: string]: string };
}

export async function fetchGraphQL(
  context: RequestContext,
  request: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null
) {
  const requestInit: FetchOptions<"json"> = {
    method: "POST",
    credentials: "include",
    headers: {},
  };

  if (context.accessToken) {
    requestInit.headers = {
      ...requestInit.headers,
      Authorization: `Bearer ${context.accessToken}`,
    };
  }

  if (uploadables && request.text) {
    if (!window.FormData) {
      throw new Error("Uploading files without `FormData` not supported.");
    }

    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: request.text,
        variables: variables,
      })
    );

    const uploadableMap: {
      [key: string]: string[];
    } = {};

    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        uploadableMap[key] = [`variables.${key}`];
      }
    });

    formData.append("map", JSON.stringify(uploadableMap));

    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(key, uploadables[key]);
      }
    });

    requestInit.body = formData;
  } else {
    requestInit.headers = {
      ...requestInit.headers,
      "Content-Type": "application/json",
    };
    requestInit.body = {
      query: request.text,
      operationName: request.name,
      variables,
    };
  }

  return await $fetch(
    context.isServer ? `http://localhost:3000/graphql` : "/graphql",
    requestInit
  ).catch((error) => {
    console.log(error);

    if (error instanceof FetchError) {
      if (error.response?.status === 401) {
        context.onLogout();
      }
    }
    return error?.message || "unkown error";
  });
}
