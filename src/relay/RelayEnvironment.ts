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
import { IRequestContext } from "./RequestContext";

function fetchRelay(context: IRequestContext) {
  return (
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null
  ) => {
    console.log(
      `fetching query ${request.name} with ${JSON.stringify(variables)}`
    );
    return fetchGraphQL(context, request, variables, cacheConfig, uploadables);
  };
}

export function createRelayEnvironment(
  context: IRequestContext,
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
