# Intro

This is a partial rewrite of the bids-validator JavaScript implementation designed to read the [bids-specification schema](https://github.com/bids-standard/bids-specification/tree/master/src/schema) to apply the majority of validation rules.

Deno is a JavaScript and TypeScript runtime that is used to run the schema based validator. Deno is simpler than Node.js and only requires one tool to use, the Deno executable itself. To install Deno, follow these [install instructions for your platform](https://deno.land/manual/getting_started/installation).

At the root of the repository there are two directories, `bids-validator` and `bids-validator-web`. These are separate npm packages, the Deno validator lives within the bids-validator package within the `src` directory.

# Schema validator examples

Deno by default sandboxes applications like a web browser. To validate datasets located on your local system, you need to use the --allow-read flag to read local files. --allow-env is also required to allow for detection of OS specific features. These flags are included in the script line of the `./bids-validator-deno` script.

```shell
# Run from within the /bids-validator directory
cd bids-validator
# Run validator:
./bids-validator-deno path/to/dataset
```

By default only schema derived validation rules are run. The legacy validator can be run at the same time with `--legacy` and this may improve coverage for issues not yet implemented in the schema variant.

```shell
./bids-validator-deno --legacy path/to/dataset
```

# Schema validator test suite

```shell
# Run tests:
deno test --allow-env --allow-read --allow-write src/
```

This test suite includes running expected output from bids-examples and may throw some expected failures for bids-examples datasets where either the schema or validator are misaligned with the example dataset while under development.

# Refreshing latest specification

If you are validating with the latest specification instead of a specific version, the validator will hold onto a cached version. You can request the newest version by adding the `--reload` argument to obtain the newest specification definition.

`deno run --reload=https://bids-specification.readthedocs.io/en/latest/schema.json src/main.ts`
