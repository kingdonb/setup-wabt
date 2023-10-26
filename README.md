# setup-wabt

![ci](https://github.com/chiefbiiko/setup-wabt/workflows/ci/badge.svg)

A Github action that sets up the [WebAssembly Binary Toolkit](https://github.com/WebAssembly/wabt), and also binaryen. It uses published release artifacts and was adapted as a fork based on `chiefbiiko/setup-wabt`.

## Usage

Simply use setup-wabt as a step in your workflow.

``` yaml
env:
  WABT_VERSION: 1.0.33
  BINARYEN_VERSION: "116"

jobs:
  release:
    steps:
      - name: Install wabt, binaryen
        uses: kingdonb/setup-wabt@v1.0.5
        with:
          version: ${{ env.WABT_VERSION }}
          version2: ${{ env.BINARYEN_VERSION }}
```

A more detailed example in amidst a real-world use case is [here](https://github.com/kingdonb/stats-tracker-ghcr/blob/9c92a792622bd68c17cfaade15fd3943b3adac41/.github/workflows/develop.yaml#L97-L102).

```
        if: "${{ github.event.inputs.dockerTarget == 'base' && steps.cache.outputs.cache-hit != 'true' }}"
```

You should install these tools in your development base image, since they are not upgraded very often and not likely to be needed at runtime.

## License

[MIT](./LICENSE)
