import {
  CacheConfig,
  Environment,
  Network,
  RecordSource,
  RequestParameters,
  Store,
  UploadableMap,
  Variables,
} from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { fetchGraphQL } from "./fetchGraphQL";

function fetchRelay(
  request: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null
) {
  console.log(
    `fetching query ${request.name} with ${JSON.stringify(variables)}`
  );
  const isServer = typeof window === "undefined";
  return fetchGraphQL(isServer, request, variables, cacheConfig, uploadables);
}

export function createRelayEnvironment(records?: RecordMap) {
  const isServer = typeof window === "undefined";
  const network = Network.create(fetchRelay);
  const source = new RecordSource(records);
  const store = new Store(source, { gcReleaseBufferSize: 10 });
  return new Environment({
    configName: isServer ? "server" : "client",
    network,
    store,
  });
}
