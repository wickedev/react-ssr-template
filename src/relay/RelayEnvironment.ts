import {
  CacheConfig,
  Environment,
  Network,
  RecordSource,
  RequestParameters,
  Store,
  UploadableMap,
  Variables
} from "relay-runtime";
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
  return fetchGraphQL(request, variables, cacheConfig, uploadables);
}

const network = Network.create(fetchRelay);

const source = new RecordSource({});
const store = new Store(source, { gcReleaseBufferSize: 10 });

export const relayEnvironment = new Environment({
  configName: "server",
  network,
  store,
});
