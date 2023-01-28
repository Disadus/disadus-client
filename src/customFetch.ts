// eslint-disable-next-line no-eval
const fetchPromise: Promise<typeof fetch> = eval('import("node-fetch")')
  .then((mod: { default: typeof fetch }) => mod.default)
  // eslint-disable-next-line no-eval
  .catch((_: any)=>{});
export const nFetch: typeof globalThis.fetch = (...args) => {
  if (globalThis.fetch) {
    return globalThis.fetch(...args);
  }
  return fetchPromise.then((fetch) => fetch(...args));
};
export default nFetch;
