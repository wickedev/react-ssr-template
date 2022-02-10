import type { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";

declare global {
  interface Window {
    __PRELOADED_STATE__: RecordMap;
  }
}
