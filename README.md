# esm-dev-server-limit

This project aims to give some numbers to the speed limit of ESM dev-servers. I often saw people saying that Vite speed is limited by the number of concurrent browser connections.

## Setup

1k modules, each one importing the next one until the last one that adds `Hello world` to the DOM. 4 cases:

- Bun limit: Dead simple Bun server that serve the requested files. Uses absolute ESM imports (`import "src/esm/2.js"`)
- Node limit: Same as Bun, running in Node
- Vite ESM: Same files, running Vite dev server
- Vite JS: JS files, but with relative extensionless imports (`import "./2"`)
- Vite TS: TS files with relative extensionless imports

## Results

```
Bun limit: 1238ms (runs: [1143,1238,1244,1223,1242])
Node limit: 1378ms (runs: [1287,1427,1378,1399,1377])
Vite ESM: 1871ms (runs: [1871,1873,1883,1848,1843])
Vite JS: 1897ms (runs: [1882,1899,1891,1897,1918])
Vite TS: 2235ms (runs: [2303,2245,2235,2231,2227])
```

## Conclusions

- In localhost, 1k browser <-> dev-server round-trips is quite fast. For my machine with Chrome 108, it's close to 1ms. This is probably higher for files with a more realistic number of bytes, but this something that you will also need to pay with a bundled dev-server.
- Extension-less imports seems less an issue than I expected. But I still think we should jump on it with TS 5.
- The overhead of 1k calls to esbuild is also not that big and this something that can become invisible if running inside Bun with the builtin transpiler: https://twitter.com/jarredsumner/status/1617515988165218304

## Faster restart

For dev-server restart, we can use browser caching. This requires to shift away from the "lazy" dev-server. This is something I've played with here: https://github.com/ArnaudBarre/rds. In few points, the design is:

- Transform everything first on the server from root to leafs
- Rewrite imports from leafs to root and include the hash of imported module in the queryParams
- On file change, transform and send the new module. Invalidate the imports transformation from the modules to root.

## Run it yourself

First, if you don't have [Bun](https://bun.sh/), install it:

```bash
curl -fsSL https://bun.sh/install | bash
```

```bash
bun install && bun codegen && bun test
```
