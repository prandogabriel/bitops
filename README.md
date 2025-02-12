# BitOps CLI

BitOps is a CLI tool for interacting with Bitbucket. It provides various commands to manage projects, repositories, and users within Bitbucket workspaces.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
3. [Usage](#usage)
  - [Login](#login)
  - [Create a New Project](#create-a-new-project)
  - [Create a New Repository](#create-a-new-repository)
  - [Add a User to a Repository](#add-a-user-to-a-repository)
  - [Update Branch Restrictions](#update-branch-restrictions)
  - [Create a New Resource](#create-a-new-resource)
4. [Components](#components)
  - [Commands](#commands)
5. [Project Command](#project-command)
6. [CI/CD](#cicd)
7. [Development](#development)
8. [License](#license)

## Installation

To install BitOps, you need to have Node.js and npm installed on your machine. Then, you can install BitOps globally using npm:

```sh
npm install -g @prandogabriel/bitops
```

## Configuration

Before using BitOps, you need to create a configuration file with your Bitbucket credentials. The configuration file should be located at `~/.bitops/config.json` and should contain the following information:

```json
{
  "username": "your-bitbucket-username",
  "appPass": "your-bitbucket-app-password"
}
```

### Environment Variables

#### BITBUCKET_CLIENT_ID

You can configure the `BITBUCKET_CLIENT_ID` environment variable to your OAuth client ID. This is necessary for authenticating with Bitbucket using OAuth. To set this environment variable, you can use the following command in your terminal:

```sh
export BITBUCKET_CLIENT_ID=your-oauth-client-id
```

Make sure to replace `your-oauth-client-id` with your actual OAuth client ID.

## Usage

After installing and configuring BitOps, you can use the following commands:

### Login

To login using Bitbucket:

```sh
bitops login
```

> **Note:** This login is via OAuth and will generate a credentials file with the token. However, due to limitations with OAuth for certain endpoints (e.g., adding users to a repository and editing permissions), we had to switch to using app passwords. The OAuth authentication resulted in errors like:
> ```
> error: {
>   type: 'error',
>   error: {
>     message: 'This API is only accessible with the following authentication types: apppassword, session, api_token'
>   }
> },
> status: 403
> ```

### Create a New Project

To create a new project:

```sh
bitops project new -n <project-name> -d <description> -w <workspace>
```

#### Command Options

```sh
Usage: bitops project new|n [options]

Create a new project (project)

Options:
  -n, --name <name>                Create a new project
  -d, --description <description>  Description of the resource
  -w, --workspace <workspace>      Workspace to create the resource
  -h, --help                       Display help for command
```

### Create a New Repository

To create a new repository:

```sh
bitops repo new -n <repository-name> -p <project-key> -w <workspace> [--description <description>]
```

#### Command Options

```sh
Usage: bitops repo new|n [options]

Create a new repository

Options:
  -n, --name <name>                Specifies the name of the new repository
  -p, --project <project-key>      Specifies the project key under which the repository will be created
  -d, --description <description>  (Optional) Provides a description for the new repository
  -h, --help                       Display help for command
```


### Add a User to a Repository

To add a user to a repository:

```sh
```sh
bitops repo add-user -u <user-account-id> --repository <repository-slug> [--role <role>]
```

#### Command Options

```sh
Usage: bitops repo add-user|au [options]

Add a user to a repository

Options:
  -r, --repo <repo>              Repo slug
  -u, --user-id <user_id>        User account id to add
  -w, --workspace <workspace>    Workspace to add the user to
  -P, --permission <permission>  Permission level for the user
  -h, --help                     Display help for command
```

### Update Branch Restrictions

To update branch restrictions for a repository:

```sh
bitops repo update-branch-restriction --repository <repository-slug> --branch <branch-name> --restriction <restriction-type>
```

#### Command Options

```sh
Usage: bitops repo update-branch-restriction|ubr [options]

Update branch restrictions for a repository

Options:
  -r, --repo <repo>              Repo slug
  -b, --branch <branch>          Branch name
  -t, --restriction <type>       Restriction type
  -h, --help                     Display help for command
```

### Create a New Resource

To create a new resource (project or repository):

```sh
bitops new|n [options]
```

Options:
- `-p, --project <name>`: Create a new project
- `-r, --repo <name>`: Create a new repository
- `-d, --description <description>`: Description of the resource
- `-w, --workspace <workspace>`: Workspace to create the resource
- `-h, --help`: Display help for command

## Components

### Commands

- `login`: Handles user authentication with Bitbucket.
- `project`: Manages project-related commands.
  - `new`: Creates a new project.
  - `add-user`: Adds a user to a project.
- `repo`: Manages repository-related commands.
  - `new`: Creates a new repository.
  - `add-user`: Adds a user to a repository.
  - `update-branch-restriction`: Updates branch restrictions for a repository.
- `new|n`: Creates a new resource (project or repository).

## Project Command

```
Usage: bitops project|p [options] [command]

Project related commands

Options:
  -h, --help             display help for command

Commands:
  add-user|au [options]  Add a user to a project
  new|n [options]        Create a new project (project)
  help [command]         display help for command
```

## CI/CD

We have workflows set up to publish the CLI to npm. Additionally, we use automated tests with Vitest, linting with Biome, and Commander for building the CLI in Node.js.

## Development

To build the project, run:

```sh
npm run build
```

To run the project in development mode, use:

```sh
npm run build && node ./dist/index.js <command>
```

To run tests, use:

```sh
npm test
```

To lint and format the code, use:

```sh
npm run lint
npm run format
```

## License

This project is licensed under the MIT License.
