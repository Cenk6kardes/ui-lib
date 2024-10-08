# Rbn Common Library

Angular Version: 14.2.0

## Steps to build in local machine

1. Build the library
```
npm run buildlib
```
The build artifacts will be stored in the `dist/` directory

2. To create a package on local
```
 cd dist/rbn-common-lib
 npm pack
```

## Running unit tests
Run `ng test rbn-common-lib  --code-coverage` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Checklist for commiting changes

1. Add JIRA id and appropirate commit message
```
git add .
git commit -m "AFH-xxx: your commit message"
```

## Checklist before pushing changes to bitbucket/remote

1. Make sure the branch is upto date
```
git pull
```
2. If there are any conflicts resolve it
3. Make sure the build is running properly in local machine.
```
# Follow 'Steps to build in local machine' and make sure it is successful
```
4. Run unit tests and make sure all tests are passing
```
npm run test
```
5. Push changes to remote
```
git push
```

## Run the build and verify

1. Start the Jenkins build
- Open `http://gbpljnk02.genband.com:8081/job/Angular-UI/job/COMMON-UI-PIPELINE-ANGULAR14/build?delay=0sec`
- Click "Build"

2. Make sure build is successful
- Recent builds and there status were listed in `http://gbpljnk02.genband.com:8081/job/Angular-UI/job/COMMON-UI-PIPELINE-ANGULAR14/`

## Required on creating new branch
- modify file JenkinsFile: change the value of the variable "GIT_BRANCH_NAME" to the name of a new branch.
- modify file project\rbn-common-lib\build\build.xml: replace all `<arg value="name old branch"/>` to `<arg value="name new branch"/>`
