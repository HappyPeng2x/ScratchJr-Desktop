## Official disclaimer
Scratch and ScratchJr are trademarks of Massachusetts Institute of Technology, which does not sponsor, endorse, or authorize this content. See scratchjr.org for more information.

---

## Experimental Electron upgrade — Linux / Debian

> **Status: experimental.**
> This fork upgrades the original [jfo8000/ScratchJr-Desktop](https://github.com/jfo8000/ScratchJr-Desktop)
> from Electron 1.x (2017) to a modern Electron stack. It has only been tested on **Debian 13 (Trixie)**.
> Other platforms (Windows, macOS, older Debian/Ubuntu) are untested and may require additional work.

### What was upgraded

| Component | Before | After |
|---|---|---|
| **Electron** | 1.8.2-beta.3 | 33.4.x |
| **Electron Forge** | 4.3.0 | 7.11.x |
| **Build system** | electron-compile + Babel 6 | esbuild 0.24.x |
| **Node.js target** | Node 6 / Chromium 59 | Chromium 130 |

### What changed in the code

- `forge.config.js` rewritten for Electron Forge v7 format; esbuild runs as a `generateAssets` hook to bundle `appEntry.js` into `appEntry.bundle.js`
- `src/main.js`: removed deprecated `BrowserView`, replaced `new Buffer()` with `Buffer.from()`, switched to `win.loadFile()`, added explicit `webPreferences` (`nodeIntegration: true`, `contextIsolation: false`)
- `src/electronClient.js`: removed the `remote` module (removed in Electron v14), replaced `DEBUG` flag retrieval with an IPC call, removed `webFrame.setLayoutZoomLevelLimits()` (removed in Electron v15)
- All four HTML pages updated to load `appEntry.bundle.js` instead of `appEntry.js`

### Known limitations / future work

- `nodeIntegration: true` is kept for compatibility; a proper preload + `contextBridge` migration is the next step
- RPM packaging is disabled; it does not work on Debian
- CI configs (`.travis.yml`, `appveyor.yml`) target the old stack and are not functional

---

## Downloads
[Download ScratchJr for Desktop](https://jfo8000.github.io/ScratchJr-Desktop/) *(original upstream release)*


## The geeky stuff

This repository contains a port of ScratchJr for Desktop.

It has been ported with love from the iPad / Android editions to Mac/Windows
as an independent, open source community project.


If you are looking for the Official ScratchJr build from MIT for Android and iPad, visit
the LLK/ScratchJr (https://github.com/LLK/scratchjr) repository.

## About Electron and Electron Forge

This port makes use of Electron to host the ScratchJR HTML5 application on desktop platforms.

Electron (https://electronjs.org/) is a framework for creating native applications with web technologies like JavaScript, HTML, and CSS.

Electron Forge (https://electronforge.io/) provides a complete toolchain for building, packaging, and distributing Electron applications.


## Architecture Overview

![Scratch Jr. Architecture Diagram](docs/scratchjr_electron_overview.png)

* The HTML5 side of Scratch Jr is very close to the original iOS / Android versions. Some changes had to be made to load modules correctly inside the Electron environment.
* Minor changes were made to the CSS stylesheets to support resizing.
* Touch events were translated to mouse events.


## ElectronDesktopInterface as a third tabletInterface

The original HTML implementation called out to a `tabletInterface` to make calls to
the host operating system (Android / iOS) for filesystem access and audio and video recording.

`ElectronDesktopInterface` handles these calls and either handles them itself in HTML5
(e.g. audio and video recording are achieved through the HTML5 WebRTC APIs) or passes them
onto the Electron main process to read and write files / db.


## Sql.js

As the database is rather small we were able to use a version of SQLite that has been compiled into JavaScript.

The database is largely the same format as the original iOS / Android version, but it adds
a third table called PROJECTFILES. Instead of writing individual SVG, video, and audio files out to
the filesystem they are all stored within the PROJECTFILES table. This was done so that
you can make a set of Scratch Jr projects as a starter kit.

## Building

You will need Node.js installed (https://nodejs.org/en/) and git.

```bash
npm install
npm run start
```

## Building a .deb package for Debian / Ubuntu

These steps were tested on **Debian 13 (Trixie)**. You will need `fakeroot` and `dpkg` installed:

```bash
sudo apt install fakeroot dpkg
```

Then:

```bash
npm install
npm run make
```

The `.deb` is produced under `out/make/deb/`. Install it with:

```bash
sudo dpkg -i out/make/deb/**/*.deb
```

Unlike the original Electron 1.x release, this build does **not** require `libgconf-2-4` (removed from Debian 12+).

## Packaging for Windows / Mac

Untested with the current Electron 33 upgrade. For Windows installers, you must build from a Windows machine; same for Mac.

```bash
npm run package
```

## Running lint

We use eslint to verify the code. The configuration is similar to airbnb, however several style rules were adapted to avoid changing the original Scratch sources.

```bash
npm run lint
```

## Debugging

To debug the HTML files, audio, and video recording:

```bash
npm run start
```

A Chrome DevTools window will appear by default.

To debug writing to the filesystem and database queries, debug the main Electron process:

```bash
npm run debugMain
```

Then open `chrome://inspect` in Chrome and connect to the Electron main process.

## Directory Structure

* `package.json` — dependencies, build scripts, eslint config
* `forge.config.js` — Electron Forge v7 config (makers, esbuild hook)
* `src/main.js` — Electron main process (filesystem, database, IPC handlers)
* `src/electronClient.js` — renderer-side Electron integration (`window.tablet`)
* `src/app/` — shared JavaScript/HTML/CSS (close to original iOS/Android source)
* `src/icons/` — platform icons (Mac, Windows)
* `out/` — build output (gitignored)
* `docs/` — developer documentation


## Acknowledgments

Thank you to the official Scratch team and their supporters. Their contributions are listed here:
https://github.com/LLK/scratchjr

Thank you to jfo8000 and contributors for the original ScratchJr-Desktop port.

Thank you to the folks working on Electron, Electron Forge, esbuild, and Sql.js.


## Disclaimers

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


For more information, see [CONTRIBUTING.md](CONTRIBUTING.md).
