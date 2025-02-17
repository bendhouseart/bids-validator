import { parseOptions } from './setup/options.ts'
import { readFileTree } from './files/deno.ts'
import { fileListToTree } from './files/browser.ts'
import { resolve } from './deps/path.ts'
import { validate } from './validators/bids.ts'
import { consoleFormat } from './utils/output.ts'
import { setupLogging } from './utils/logger.ts'

function inspect(obj: any) {
  console.log(
    Deno.inspect(obj, {
      depth: 6,
      colors: true,
    }),
  )
}

export async function main() {
  const options = await parseOptions(Deno.args)
  setupLogging(options.debug)
  const absolutePath = resolve(options.datasetPath)
  const tree = await readFileTree(absolutePath)

  // Run the schema based validator
  const schemaResult = await validate(tree, options)

  if (options.json) {
    console.log(inspect(schemaResult))
  } else {
    console.log(
      consoleFormat(schemaResult, {
        verbose: options.verbose ? options.verbose : false,
      }),
    )
  }
}

export { validate, fileListToTree }
