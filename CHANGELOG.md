# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.1.0] - 2026-07-23

### Added

- Initial release.
- `CmsPlugin` - Vue plugin that provides the CMS HTTP client to the component tree via `app.use()`.
- `useClient` - composable to access the injected HTTP client from any component.
- `useQuery` - composable for async data fetching with reactive `data`, `error`, `loading` state and a `refetch` trigger.
- `useMutation` - composable for async mutations returning a `[trigger, loading]` tuple.