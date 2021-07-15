# Publish Wizard

The easiest way to publish packages for projects using Lerna and NPM.

## Table of Contents

- [The problem it solves](#the-problem-it-solves)
- [How it works](#how-it-works)
- [Actions](#actions)
  - [Publish prerelease](#publish-prerelease)
  - [Publish release](#publish-release)
  - [Show the update queue](#show-the-update-queue)
- [Usage](#usage)
- [Advanced usage](#advanced-usage)

## The problem it solves

When publishing packages, it is necessary to follow the correct sequence of updates.

For example, we have three packages: A, B, C. B depends on A. C depends on B.<br />
If we want to update A, we need to update B and C (A -> B -> C).

We can specify versions of dependencies flexibly, but this does not help in the case of publishing an unstable version of a package (with `next` tag, for example). Adding more packages will only make the problem of queuing worse.

Publish Wizard helps you not to think about the problem of queuing, allowing you to focus on what's important.

## How it works

https://user-images.githubusercontent.com/8722478/125296270-c9e28b00-e32e-11eb-9938-adcd705e1912.mp4

1. Select a package from the list
1. Select the [action](#actions):
   - Publish a prerelease
   - Publish a release (soon)
   - Show the update queue

### Actions

#### Publish prerelease

1. Select a tag from the list
2. Select the extent of changes
3. Accept publish

Publish Wizard will repeat the cycle of questions for all the packages that need to be updated.

It will result in a queue of packages that have been published.

<details><summary><b>Output example</b></summary>

```sh
Published packages:

1. my-awesome-package@1.0.0-next.3
2. kitty@3.0.2-alpha.0
3. mushroom@7.1.3-nightly.4
```

</details>

#### Publish release

_Soon..._

#### Show the update queue

Publish Wizard will display the queue of packages that need to be updated.

<details><summary><b>Output example</b></summary>

```sh
Bump packages in order:

1. my-awesome-package
2. kitty
3. mushroom
5. sandbox
```

</details>

## Usage

1. Make sure that the project uses Lerna and NPM
2. Make sure that the [prepublishOnly](https://docs.npmjs.com/cli/v7/using-npm/scripts#life-cycle-scripts) script is present in the packages:

```json
{
  "name": "my-awesome-package",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "prepublishOnly": "<do-smth-before-publish>"
  }
}
```

3. Install `@space307/publish-wizard`:

```sh
npm install --save-dev @space307/publish-wizard

# or

yarn add @space307/publish-wizard --dev
```

4. Add the `publish-wizard` script to your **root** package.json:

```diff
  {
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "publish-wizard": "publish-wizard"
    }
  }
```

5. Run Publish Wizard:

```sh
npm run publish-wizard

# or

yarn run publish-wizard
```

## Advanced usage

You can specify `custom postfixes` and `publish command` through the config.

Publish Wizard supports three ways to define config.

1. `publish-wizard` section in `package.json`:

```json
"publish-wizard": {
  "postfixes": ["my", "awesome", "postfixes"],
  "publishCommand": "run my-awesome-command"
}
```

2. or a separate `.publish-wizard.json` config file:

```json
{
  "postfixes": ["my", "awesome", "postfixes"],
  "publishCommand": "run my-awesome-command"
}
```

Options description:

- **postfixes**: list of postfixes that will be added to the standard list.

- **publishCommand**: the command that will be called to publish. `publish` by default.

All options are optional.
