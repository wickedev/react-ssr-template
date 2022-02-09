import { $fetch, FetchOptions } from "ohmyfetch";
import { UploadableMap } from "relay-runtime/lib/network/RelayNetworkTypes";
import { RequestParameters } from "relay-runtime/lib/util/RelayConcreteNode";
import {
  CacheConfig,
  Variables,
} from "relay-runtime/lib/util/RelayRuntimeTypes";

interface RequestInit {
  method: string;
  body?: FormData | string;
  credentials: "include";
  headers: { [key: string]: string };
}

export async function fetchGraphQL(
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

  const isServer = typeof window === "undefined";

  return await $fetch(`http://localhost:3000/graphql`, requestInit)
    .catch((error) => {
      console.error(error);
      return error?.message || "unkown error";
    });
}
