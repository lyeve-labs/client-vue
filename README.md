# @lyeve-labs/client-vue

Vue 3 composables for the LyEve Core. `useQuery`, `useMutation`, and the
`CmsPlugin` provider. Thin wrapper around `@lyeve-labs/client` using the
Composition API.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883.svg)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org)

```bash
pnpm add @lyeve-labs/client @lyeve-labs/client-vue
```

```ts
import { createApp } from "vue";
import { CmsPlugin } from "@lyeve-labs/client-vue";

const app = createApp(App);
app.use(CmsPlugin, {
  baseUrl: "https://cms.example.com",
  getHeaders: () => ({ Authorization: `Bearer ${token}` }),
});
```

One plugin at the root, reactive refs everywhere else. No ceremony.

---

## What's in the box

- **CmsPlugin:** Vue plugin that provides the CMS HTTP client to the entire
  component tree via `inject`/`provide`.
- **useQuery:** reactive data fetching composable. Returns `data`, `error`,
  `loading` as Vue `Ref`s, plus a `refetch` function.
- **useMutation:** mutation composable returning `[trigger, loading]`. The
  trigger returns a Promise of the result; `loading` is a `Ref<boolean>`.

## Requirements

- **Node 20** or newer
- **Vue 3.0** or newer
- **[@lyeve-labs/client](https://www.npmjs.com/package/@lyeve-labs/client)** `>=0.1.0`

## Install

```bash
pnpm add @lyeve-labs/client @lyeve-labs/client-vue
# or npm install @lyeve-labs/client @lyeve-labs/client-vue
# or yarn add @lyeve-labs/client @lyeve-labs/client-vue
```

## Use

### Setup

```ts
import { createApp } from "vue";
import { CmsPlugin } from "@lyeve-labs/client-vue";

const app = createApp(App);
app.use(CmsPlugin, {
  baseUrl: "https://cms.example.com",
  getHeaders: () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  }),
});
app.mount("#app");
```

### useQuery

```vue
<script setup lang="ts">
import { useQuery } from "@lyeve-labs/client-vue";
import { getSchemas } from "@lyeve-labs/client-rest";

const { data, error, loading, refetch } = useQuery((client) =>
  getSchemas(client),
);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <ul v-else>
    <li v-for="schema in data" :key="schema.id">{{ schema.name }}</li>
  </ul>
</template>
```

### useMutation

```vue
<script setup lang="ts">
import { useMutation } from "@lyeve-labs/client-vue";
import { deleteContent } from "@lyeve-labs/client-rest";

const [remove, removing] = useMutation((client, id: string) =>
  deleteContent(id, client),
);

async function handleDelete(id: string) {
  await remove(id);
}
</script>

<template>
  <button :disabled="removing" @click="handleDelete('abc-123')">
    {{ removing ? "Deleting..." : "Delete" }}
  </button>
</template>
```

## API

### CmsPlugin

```ts
interface VueCmsConfig {
  baseUrl?: string;
  getHeaders?: () => Record<string, string>;
}
```

### useQuery

```ts
function useQuery<T>(fetcher: (client: HttpClient) => Promise<T>): {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  refetch: () => void;
};
```

### useMutation

```ts
function useMutation<T, V>(
  mutator: (client: HttpClient, vars: V) => Promise<T>,
): [(vars: V) => Promise<T>, Ref<boolean>];
```

Returns a tuple: `[trigger, loading]`.

## Local development

```bash
pnpm install            # install dependencies
pnpm test               # run unit tests
pnpm check              # type-check
pnpm build              # tsup + publint -> dist/
```

## Project layout

```
src/
  index.ts           # CmsPlugin, useQuery, useMutation
tests/               # vitest test suite
```

## Versioning

`@lyeve-labs/client-vue` follows [SemVer](https://semver.org). While under `1.0`,
breaking changes bump the **minor** version; additive changes bump the **patch**.
Every release is logged in [`CHANGELOG.md`](CHANGELOG.md).

## Contributing

Bug reports and feature requests are welcome. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the development setup and conventions.

## License

MIT. See [`LICENSE`](LICENSE).
