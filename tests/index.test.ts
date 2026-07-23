import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createApp, type App } from "vue";
import {
  CmsPlugin,
  useQuery,
  useMutation,
  type VueCmsConfig,
} from "../src/index.js";

function installPlugin(config: VueCmsConfig = {}): App {
  const app = createApp({ template: "<div></div>" });
  app.use(CmsPlugin, config);
  return app;
}

describe("CmsPlugin", () => {
  it("installs without error", () => {
    const app = createApp({ template: "<div></div>" });
    expect(() =>
      app.use(CmsPlugin, { baseUrl: "http://localhost:3001" }),
    ).not.toThrow();
  });

  it("install is a function", () => {
    expect(typeof CmsPlugin.install).toBe("function");
  });
});

describe("useQuery", () => {
  let app: App;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async (_url: string, _init?: RequestInit) =>
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
      ),
    );
    app = installPlugin({ baseUrl: "http://localhost:3001" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns data, error, loading, refetch shape", () => {
    app.runWithContext(() => {
      const state = useQuery((c) => c.get("/test"));
      expect(state).toHaveProperty("data");
      expect(state).toHaveProperty("error");
      expect(state).toHaveProperty("loading");
      expect(state).toHaveProperty("refetch");
      expect(typeof state.refetch).toBe("function");
    });
  });

  it("starts loading", () => {
    app.runWithContext(() => {
      const state = useQuery((c) => c.get("/test"));
      expect(state.loading.value).toBe(true);
    });
  });

  it("throws error when CmsPlugin is not installed", () => {
    expect(() => useQuery((c) => c.get("/test"))).toThrow(
      "CmsPlugin must be installed via app.use(CmsPlugin, config)",
    );
  });
});

describe("useMutation", () => {
  let app: App;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const body = JSON.parse((init as RequestInit).body as string);
        return new Response(JSON.stringify({ id: "new-1", ...body }), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      }),
    );
    app = installPlugin({ baseUrl: "http://localhost:3001" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a mutate function and loading ref", () => {
    app.runWithContext(() => {
      const [mutate, { loading }] = useMutation((c, v: { name: string }) =>
        c.post("/items", v),
      );
      expect(typeof mutate).toBe("function");
      expect(loading).toHaveProperty("value");
      expect(loading.value).toBe(false);
    });
  });

  it("mutate calls the endpoint and returns result", async () => {
    app.runWithContext(async () => {
      const [mutate, { loading }] = useMutation((c, v: { name: string }) =>
        c.post<{ id: string }>("/items", v),
      );
      const result = await mutate({ name: "test" });
      expect(result).toEqual({ id: "new-1", name: "test" });
    });
  });

  it("sets loading to true during mutation", async () => {
    app.runWithContext(async () => {
      const [mutate, { loading }] = useMutation((c, v: { name: string }) =>
        c.post("/items", v),
      );
      const promise = mutate({ name: "test" });
      // loading should be true while mutation is in flight
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });
  });
});
