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
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { fetchGraphQL } from "./fetchGraphQL";
import { RequestContext } from "./request-context/RequestContext";

function fetchRelay(context: RequestContext) {
  return async (
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null
  ) => {
    console.log(
      `fetching query ${request.name} with ${JSON.stringify(variables)}`
    );

    return await fetchGraphQL(
      context,
      request,
      variables,
      cacheConfig,
      uploadables
    );
  };
}

export function createRelayEnvironment(
  context: RequestContext,
  records?: RecordMap
) {
  const network = Network.create(fetchRelay(context));
  const source = new RecordSource(records);
  const store = new Store(source, { gcReleaseBufferSize: 10 });
  return new Environment({
    configName: context.isServer ? "server" : "client",
    isServer: context.isServer,
    network,
    store,
  });
}
