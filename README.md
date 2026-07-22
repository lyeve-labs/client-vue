# @lyeve/cms-client-vue

Vue 3 composables for the LyEve CMS client. A thin wrapper around `@lyeve/cms-client` using the Composition API (`ref`, `computed`, `inject/provide`).

## Install

```sh
pnpm add @lyeve/cms-client @lyeve/cms-client-vue
```

## Setup

Register the plugin with your app. It configures the HTTP client and provides it to the component tree.

```ts
import { createApp } from 'vue';
import { CmsPlugin } from '@lyeve/cms-client-vue';

const app = createApp(App);

app.use(CmsPlugin, {
  // Optional: base URL prefix for all API requests
  baseUrl: 'https://cms.example.com',

  // Optional: return headers to attach to every request (e.g. auth token)
  getHeaders: () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` }),
});
```

## Usage

### useQuery

Fetch data reactively. `data`, `error`, and `loading` are Vue refs that update as the request completes.

```vue
<script setup lang="ts">
import { useQuery } from '@lyeve/cms-client-vue';
import { getSchemas } from '@lyeve/cms-client-rest';

const { data, error, loading, refetch } = useQuery((client) => getSchemas(client));
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

Trigger a write operation and track its loading state.

```vue
<script setup lang="ts">
import { useMutation } from '@lyeve/cms-client-vue';
import { deleteContent } from '@lyeve/cms-client-rest';

const [remove, removing] = useMutation((client, id: string) => deleteContent(id, client));

async function handleDelete(id: string) {
  await remove(id);
  // mutation complete
}
</script>

<template>
  <button :disabled="removing" @click="handleDelete('abc-123')">
    {{ removing ? 'Deleting...' : 'Delete' }}
  </button>
</template>
```

## API

### CmsPlugin

Vue plugin that provides the CMS HTTP client to the component tree.

```ts
interface VueCmsConfig {
  baseUrl?: string;
  getHeaders?: () => Record<string, string>;
}
```

### useQuery

```ts
interface AsyncState<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  refetch: () => void;
}

function useQuery<T>(fetcher: (client: HttpClient) => Promise<T>): AsyncState<T>
```

### useMutation

```ts
function useMutation<T, V>(
  mutator: (client: HttpClient, vars: V) => Promise<T>,
): [(vars: V) => Promise<T>, Ref<boolean>]
```

Returns a tuple: `[trigger, loading]`.

## License

MIT
