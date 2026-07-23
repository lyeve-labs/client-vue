import { createClient, type HttpClient } from '@lyeve/cms-client';
import { ref, inject, type InjectionKey, type Ref, type App } from 'vue';

// Plugin

export interface VueCmsConfig {
  baseUrl?: string;
  getHeaders?: () => Record<string, string>;
}

const CMS_KEY: InjectionKey<HttpClient> = Symbol('cms-client');

/** Vue plugin that provides an HttpClient via app-level dependency injection. */
export const CmsPlugin = {
  install(app: App, config: VueCmsConfig) {
    const base = config.baseUrl ?? '';
    const client = createClient((url, init) => {
      const fullUrl = typeof url === 'string' ? `${base}${url}` : url;
      return fetch(fullUrl, {
        ...init,
        headers: { ...init?.headers, ...config.getHeaders?.() },
      });
    });
    app.provide(CMS_KEY, client);
  },
};

function useClient(): HttpClient {
  const client = inject(CMS_KEY);
  if (!client) throw new Error('CmsPlugin must be installed via app.use(CmsPlugin, config)');
  return client;
}

// Composables

export interface AsyncState<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  loading: Ref<boolean>;
  refetch: () => void;
}

/**
 * Reactive query that fires immediately on mount and exposes loading/data/error state.
 * Re-fetch by calling the returned `refetch` function.
 */
export function useQuery<T>(fetcher: (client: HttpClient) => Promise<T>): AsyncState<T> {
  const client = useClient();
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const loading = ref(true);

  async function run() {
    loading.value = true;
    try {
      data.value = await fetcher(client);
      error.value = null;
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  run();

  return { data, error, loading, refetch: run };
}

/**
 * Returns a mutate function and a reactive state object tracking the latest invocation.
 * The mutate function throws on failure so callers can catch and handle errors inline.
 */
export function useMutation<T, V>(
  mutator: (client: HttpClient, vars: V) => Promise<T>,
): [(vars: V) => Promise<T>, { data: Ref<T | null>; error: Ref<Error | null>; loading: Ref<boolean> }] {
  const client = useClient();
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function run(vars: V): Promise<T> {
    loading.value = true;
    error.value = null;
    try {
      const result = await mutator(client, vars);
      data.value = result;
      return result;
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return [run, { data, error, loading }];
}
