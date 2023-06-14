const { addPath, getInput, setFailed } = require("@actions/core")
const { downloadTool: dltmp, extractZip } = require("@actions/tool-cache")
const { coerce: coerceSemVer } = require("semver")
const { arch, platform } = require("os")
const { join } = require("path")
const { exec: _exec } = require("child_process")

const BASE_URL2 = "https://github.com/WebAssembly/binaryen/releases/download/"
const BASE_URL = "https://github.com/WebAssembly/wabt/releases/download/"
const PLATFORM = platform()
const ARCH = arch()
const IS_WINDOWS = PLATFORM.startsWith("win")

function wabtdir(version) {
  return join(process.env.HOME || process.env.USERPROFILE, `.wabt_${version}`)
}

function binaryendir(version) {
  return join(process.env.HOME || process.env.USERPROFILE, `.binaryen_${version}`)
}

function exec(cmd) {
  return new Promise((resolve, reject) =>
    _exec(cmd, (err, stdout, stderr) => {
      if (stdout) console.log(stdout)
      if (stderr) console.error(stderr)
      err ? reject(err) : resolve()
    })
  )
}

function rm(file) {
  return exec(IS_WINDOWS ? `del /f "${file}"` : `rm -f "${file}"`)
}

// function addPath(path) {
//   return exec(...
// }

function dlurl(version) {
  if (IS_WINDOWS) {
    const os = "windows"
    return `${BASE_URL}${version}/wabt-${version}-${os}.tar.gz`
  } else if (PLATFORM === "darwin") {
    return `${BASE_URL}${version}/wabt-${version}-macos-12.tar.gz`
  } else {
    return `${BASE_URL}${version}/wabt-${version}-ubuntu.tar.gz`
  }
}

function dlurl2(version) {
  if (IS_WINDOWS) {
    const os = "windows"
    return `${BASE_URL2}version_${version}/binaryen-version_${version}-x86_64-${os}.tar.gz`
  } else if (PLATFORM === "darwin") {
    return `${BASE_URL2}version_${version}/binaryen-version_${version}-x86_64-macos.tar.gz`
  } else {
    return `${BASE_URL2}version_${version}/binaryen-version_${version}-x86_64-linux.tar.gz`
  }
}

// async function extract(archive, dir) {
//   if (IS_WINDOWS) {
//     await extractZip(archive, dir)
//   } else {
//     await exec(`mkdir -p "${dir}"`)
//     await exec(
//       `tar --extract --gunzip --verbose --strip-components=1 --file="${archive}" --directory="${dir}"`
//     )
//   }
// }

async function extract2(archive, dir) {
  await exec(`mkdir -p "${dir}"`)
  await exec(
    `tar --extract --gunzip --verbose --strip-components=1 --file="${archive}" --directory="${dir}"`
  )
}

async function main() {
  let archive

  try {
    // const version = "1.0.33"
    let version = coerceSemVer(getInput("version"))
    let version2 = getInput("version2")

    if (!version) {
      const release = "v1.0.33" // await latestRelease("WebAssembly", "wabt")
      version = release.replace(/^v/, "")
    }
    if (!version2) {
      version2 = "113"
    }

    const dir = wabtdir(version)
    const dir2 = binaryendir(version2)

    // console.log(dir)

    archive = await dltmp(dlurl(version))
    archive2 = await dltmp(dlurl2(version2))

    await extract2(archive, dir)
    await extract2(archive2, dir2)

    // Add Path does not seem to work, so copy these binaries to your path
    // addPath(dir)
    // addPath(dir2)
  } catch (err) {
    setFailed((err && err.message) || "setup_wabt failed")
  } finally {
    await rm(archive)
  }
}

main()
