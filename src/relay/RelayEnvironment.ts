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

const isServer = typeof window === "undefined";

function fetchRelay(
  request: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null
) {
  console.log(
    `fetching query ${request.name} with ${JSON.stringify(variables)}`
  );
  return fetchGraphQL(isServer, request, variables, cacheConfig, uploadables);
}

export function createRelayEnvironment(records?: RecordMap) {
  const network = Network.create(fetchRelay);
  const source = new RecordSource(records);
  const store = new Store(source, { gcReleaseBufferSize: 10 });
  return new Environment({
    configName: isServer ? "server" : "client",
    isServer,
    network,
    store,
  });
}
