# Publish Wizard

The easiest way to publish packages for projects using Lerna and NPM.

## The problem it solves

When publishing packages, it is necessary to follow the correct order of updates.

For example, we have three packages: A, B, C. B depends on A. C depends on B.<br />
If we want to update A, we need to update B and C (A -> B -> C). We can specify versions of dependencies flexibly, but this does not help in the situation of publishing an unstable version of a package (with `next` postfix, for example).

Adding more packages will make the queuing problem worse.

Publish Wizard helps you not to think about the problem of queuing, allowing you to focus on what's important.

## Demonstration

// сюда демо-гифку

## Usage
