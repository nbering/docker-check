# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2021-09-06
### Removed
- MongoDB Health Check

### Changed
- Docker image built with NodeJS 16.x and Debian 11

## [0.0.2] - 2019-04-03
### Added
- MongoDB healthceck support
- Some sanity checks for S3 bucket config
- Support a config file to allow a generic route responder (with CORS support)

### Changed
- Target ES6 from Typescript build

### Security
- Update vulnerable dependencies

[Unreleased]: https://github.com/nbering/docker-check/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nbering/docker-check/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/nbering/docker-check/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/nbering/docker-check/releases/tag/v0.0.1
