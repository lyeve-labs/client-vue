# Changelog

## [0.1.0] - 2026-07-22

### Added

- Initial release.
- `CmsPlugin` - Vue plugin that provides the CMS HTTP client to the component tree via `app.use()`.
- `useClient` - composable to access the injected HTTP client from any component.
- `useQuery` - composable for async data fetching with reactive `data`, `error`, `loading` state and a `refetch` trigger.
- `useMutation` - composable for async mutations returning a `[trigger, loading]` tuple.
