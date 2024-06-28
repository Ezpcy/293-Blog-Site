# Typescript Setup

## Step 1: Install Node.js

First, ensure you have Node.js installed. TypeScript runs on Node.js, so it's a prerequisite. You can download and install Node.js from [nodejs.org](https://nodejs.org/).

## Step 2: Initialize a New Project

If you’re starting a new project, create a new directory for your project and navigate into it:

```bash
mkdir my-typescript-project
cd my-typescript-project
```

Initialize a new Node.js project:

```bash
npm init -y
```

This command creates a `package.json` file with default values.

## Step 3: Install TypeScript

Install TypeScript globally or locally in your project. For project-specific installations, use:

```bash
npm install --save-dev typescript
```

## Step 1: Install Node.js

First, ensure you have Node.js installed. TypeScript runs on Node.js, so it's a prerequisite. You can download and install Node.js from [nodejs.org](https://nodejs.org/).

## Step 2: Initialize a New Project

If you’re starting a new project, create a new directory for your project and navigate into it:

```bash
mkdir my-typescript-project
cd my-typescript-project
```

Initialize a new Node.js project:

```bash
npm init -y
```

This command creates a `package.json` file with default values.

## Step 3: Install TypeScript

Install TypeScript globally or locally in your project. For project-specific installations, use:

```bash
npm install --save-dev typescript
```

## Step 4: Create a TypeScript Configuration File

Create a `tsconfig.json` file in your project root. This file specifies the root files and the compiler options required to compile the project. You can create this file manually or generate it by running:

```bash
npx tsc --init
```

This command sets up a default `tsconfig.json` with common settings. You might want to adjust some of these settings based on your project needs.

## Step 5: Write Some TypeScript

Create a new file with a `.ts` extension, for example, `index.ts`:

```tsx
function greet(person: string): string {
  return "Hello, " + person;
}

console.log(greet("World"));
```

## Step 6: Compile TypeScript

Run the TypeScript compiler:

```bash
npx tsc
```

This command compiles your TypeScript code into JavaScript according to the settings in `tsconfig.json`.

## Step 7: Run Your JavaScript Code

Run the compiled JavaScript with Node.js:

```bash
node index.js
```

This will execute the JavaScript output from your TypeScript code.

## Optional: Watch Mode

For development, you might want to use the TypeScript compiler in watch mode. This will recompile your code automatically whenever you save a TypeScript file:

```bash
npx tsc --watch
```

This setup will get you started with TypeScript in a new project. As you progress, you might need to install additional typings for existing JavaScript libraries you are using, which can be done using DefinitelyTyped packages (`@types/` packages, e.g., `npm install --save-dev @types/node`).

## Step 4: Create a TypeScript Configuration File

Create a `tsconfig.json` file in your project root. This file specifies the root files and the compiler options required to compile the project. You can create this file manually or generate it by running:

```bash
npx tsc --init
```

This command sets up a default `tsconfig.json` with common settings. You might want to adjust some of these settings based on your project needs.

## Step 5: Write Some TypeScript

Create a new file with a `.ts` extension, for example, `index.ts`:

```tsx
function greet(person: string): string {
  return "Hello, " + person;
}

console.log(greet("World"));
```

## Step 6: Compile TypeScript

Run the TypeScript compiler:

```bash
npx tsc
```

This command compiles your TypeScript code into JavaScript according to the settings in `tsconfig.json`.

## Step 7: Run Your JavaScript Code

Run the compiled JavaScript with Node.js:

```bash
node index.js
```

This will execute the JavaScript output from your TypeScript code.

## Optional: Watch Mode

For development, you might want to use the TypeScript compiler in watch mode. This will recompile your code automatically whenever you save a TypeScript file:

```bash
npx tsc --watch
```

This setup will get you started with TypeScript in a new project. As you progress, you might need to install additional typings for existing JavaScript libraries you are using, which can be done using DefinitelyTyped packages (`@types/` packages, e.g., `npm install --save-dev @types/node`).
