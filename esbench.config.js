import { defineConfig } from "esbench/host";
import { inProcessExecutor } from "esbench";

export default defineConfig({
	// config options...
    toolchains: [{
		// ...
		executors: [inProcessExecutor],
	}],
});