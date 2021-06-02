# bismuth loader progress indicator

> Progress indicator UI used internally by `@bsmth` webpack loaders.

## Installation

```
yarn add --dev @bsmth/loader-progress
```

```
npm i --save-dev @bsmth/loader-progress
```

---

## Usage

Inside your project you can now import images like so:

```typescript
import { trackJob } from "@bsmth/loader-progress";

const completeJob = trackJob({
	reportName: "some/file",
	text: "making progress",
});

// some time later

completeJob();
```

---

## License

© 2021 the project bismuth authors, licensed under MIT.
