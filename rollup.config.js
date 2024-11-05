// @ts-check
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import pico from 'picocolors'
import commonJS from '@rollup/plugin-commonjs'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import alias from '@rollup/plugin-alias'
import { entries } from './scripts/aliases.js'
import { minify as minifySwc } from '@swc/core'

/**
 * @template T
 * @template {keyof T} K
 * @typedef { Omit<T, K> & Required<Pick<T, K>> } MarkRequired
 */
/** @typedef {'cjs' | 'esm-bundler' | 'global' } PackageFormat */
/** @typedef {MarkRequired<import('rollup').OutputOptions, 'file' | 'format'>} OutputOptions */

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const masterVersion = require('./package.json').version

const privatePackages = fs.readdirSync('packages-private')
const pkgBase = privatePackages.includes(process.env.TARGET)
  ? `packages-private`
  : `packages`
const packagesDir = path.resolve(__dirname, pkgBase)
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = (/** @type {string} */ p) => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir)

/** @type {Record<PackageFormat, OutputOptions>} */
const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es',
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife',
  },
}

/** @type {ReadonlyArray<PackageFormat>} */
const defaultFormats = ['esm-bundler', 'cjs']
/** @type {ReadonlyArray<PackageFormat>} */
const inlineFormats = /** @type {any} */ (
  process.env.FORMATS && process.env.FORMATS.split(',')
)
/** @type {ReadonlyArray<PackageFormat>} */
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]))

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (packageOptions.prod === false) {
      return
    }
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format))
    }
    if (/^(global)?/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

export default packageConfigs

/**
 *
 * @param {PackageFormat} format
 * @param {OutputOptions} output
 * @param {ReadonlyArray<import('rollup').Plugin>} plugins
 * @returns {import('rollup').RollupOptions}
 */
function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(pico.yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isBundlerESMBuild = /esm-bundler/.test(format)
  const isCJSBuild = format === 'cjs'
  const isGlobalBuild = /global/.test(format)
  const isBrowserBuild = isGlobalBuild || isBundlerESMBuild

  output.banner = `/**
* ${pkg.name} v${masterVersion}
* (c) 2024-present YZY
* @license MIT
**/`

  output.exports = 'named'
  if (isCJSBuild) {
    output.esModule = true
  }
  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false
  // https://github.com/rollup/rollup/pull/5380
  output.reexportProtoFromExternal = false

  if (isGlobalBuild) {
    output.name = packageOptions.name
  }

  function resolveDefine() {
    /** @type {Record<string, string>} */
    const replacements = {
      __COMMIT__: `"${process.env.COMMIT}"`,
      __VERSION__: `"${masterVersion}"`,
      // this is only used during FlexiTable's internal tests
      __TEST__: `false`,
      // If the build is expected to run directly in the browser (global / esm builds)
      __BROWSER__: String(isBrowserBuild),
      __GLOBAL__: String(isGlobalBuild),
      __ESM_BUNDLER__: String(isBundlerESMBuild),
      // is targeting Node (SSR)?
      __CJS__: String(isCJSBuild),
    }

    if (!isBundlerESMBuild) {
      // hard coded dev/prod builds
      replacements.__DEV__ = String(!isProductionBuild)
    }

    // allow inline overrides like
    //__BROWSER__=true pnpm build some-package
    Object.keys(replacements).forEach(key => {
      if (key in process.env) {
        const value = process.env[key]
        assert(typeof value === 'string')
        replacements[key] = value
      }
    })
    return replacements
  }

  // esbuild define is a bit strict and only allows literal json or identifiers
  // so we still need replace plugin in some cases
  function resolveReplace() {
    /** @type {Record<string, string>} */
    const replacements = {}

    if (isBundlerESMBuild) {
      Object.assign(replacements, {
        // preserve to be handled by bundlers
        __DEV__: `!!(process.env.NODE_ENV !== 'production')`,
      })
    }

    if (Object.keys(replacements).length) {
      return [replace({ values: replacements, preventAssignment: true })]
    } else {
      return []
    }
  }

  function resolveNodePlugins() {
    const nodePlugins =
      format === 'cjs' && Object.keys(pkg.devDependencies || {}).length
        ? [
            commonJS({
              sourceMap: false,
            }),
            ...(format === 'cjs' ? [] : [polyfillNode()]),
            nodeResolve(),
          ]
        : []

    return nodePlugins
  }

  return {
    input: resolve('src/index.ts'),
    plugins: [
      json({
        namedExports: false,
      }),
      alias({
        entries,
      }),
      ...resolveReplace(),
      esbuild({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        sourceMap: output.sourcemap,
        minify: false,
        target: isCJSBuild ? 'es2019' : 'es2016',
        define: resolveDefine(),
      }),
      ...resolveNodePlugins(),
      ...plugins,
    ],
    output,
    onwarn: (msg, warn) => {
      if (msg.code !== 'CIRCULAR_DEPENDENCY') {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false,
    },
  }
}

function createProductionConfig(/** @type {PackageFormat} */ format) {
  return createConfig(format, {
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: outputConfigs[format].format,
  })
}

function createMinifiedConfig(/** @type {PackageFormat} */ format) {
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
      format: outputConfigs[format].format,
    },
    [
      {
        name: 'swc-minify',

        async renderChunk(
          contents,
          _,
          { format, sourcemap, sourcemapExcludeSources },
        ) {
          const { code, map } = await minifySwc(contents, {
            module: format === 'es',
            compress: {
              ecma: 2016,
              pure_getters: true,
            },
            safari10: true,
            mangle: true,
            sourceMap: !!sourcemap,
            inlineSourcesContent: !sourcemapExcludeSources,
          })

          return { code, map: map || null }
        },
      },
    ],
  )
}
