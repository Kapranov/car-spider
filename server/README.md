# crspdr-api

The crspdr api

## Installation

    $ git clone git@github.com:beeman/crspdr-api.git
    $ npm install

## Development

    $ npm run dev

## Docker

    $ npm run docker

## Development Workflow

Below we describe the development workflow as used in this project. Note that steps 4 to 7 can be repeated until the
functionality as described in the story is fully implemented

1. You wil work on a GitHub issue: `#123 Add New Functionality`
1. Assign yourself to this story
1. Create a local branch with the your initials, a description and story ID in the name

    ```
    $ git checkout -b bb/new-functionality-123
    ```

1. Implement the new functionality
1. Run the tests
1. Commit the changes and make sure the commit message has the story ID in it: [#123]
1. Push the changes

    ```
    $ git push --set-upstream origin bb/new-functionality-123
    ```

1. Merge master with the developent branch

    ```
    $ git fetch --all
    $ git merge master
    ```

1. Create a pull request for your branch on GitHub and assign to reviewer
1. Add message on the issue and ask the reviewer to review the pull request
1. Assign the issue to the reviewer
1. If the reviewer thinks the code needs more work it comments on the code and/or the issue
1. If the reviewer thinks the code is ok it merges the pull request
1. Verify that the issue is finished and close it
