# Renovate Bot

A repo containing the renovate bot configuration

## Using Renovate's Docker image directly while overwriting the Entrypoint for the use with Gitlab CI

The Entrypoint in a docker image/container is actually the command which is run after a docker image is built and every time on startup of the container. So this is the point where the renovate process is triggered for the Renovate Bot docker image. Luckily Gitlab CI allows to overwrite this Entrypoint from within the .gitlab-ci.yml:

```
image:
name: renovate/renovate
entrypoint: [""]
```

This allows us to put the renovate config into the right spot before actually executing the renovate job.

## Tutorial

To get your Renovate Bot running inside Gitlab CI updating all of your projects' dependencies you first need an account for the bot on the Gitlab instance. Log in to the newly created bot user account and go to the user settings and chose Access Tokens. There you need to generate a personal access token with the api scope for renovate to access the repositories and create the branches and merge requests containing the dependency updates.

Then create a (private/internal) repository for the configuration etc. of renovate. Renovate will basically live in this repo then, as it will use those CI Pipelines. Go to the project's settings and paste your Gitlab token under CI / CD > Variables as a new variable and give it the name RENOVATE_TOKEN. You probably also want to set it to protected and masked to hide the token from the CI logs and to only use it for Pipelines starting on protected branches (your master branch is protected by default).
You'll also need a Github access token with the repos scope (see this how-to). Paste it as an other variable with the name GITHUB_COM_TOKEN. This is just needed to read sources and changelogs of dependencies hosted on Github and it's therefore not important what Github account is used. It's just needed because Github's rate-limiting would block your bot from getting this info pretty fast if it's making unauthenticated requests.

Now you'll want to create two files and push them to the master branch of your repo: a .gitlab-ci.yml and a config.js.

In the .gitlab-ci.yml you need to define the docker image to use and you overwrite said entrypoint we discussed earlier. You define a pipeline stage for renovate and in the before_script you copy the config from the working directory to the directory renovate expects to find it. In the last part you actually define the job: in which stage it's to be executed and you also restrict it to only be executed on the master branch of the bot config repo. Finally in the script session you call the actual renovate job with node:

```
image:
  name: renovate/renovate
  entrypoint: [""]

stages:
  - renovate

before_script:
  - cp config.js /usr/src/app/config.js

renovate:
  stage: renovate
  only: - master
  script: 'node /usr/src/app/dist/renovate.js'
```

.gitlab-ci.yml

In the config.js you define your renovate config. You set the type of platform, which is Gitlab in our case, the api endpoint to your instance and the token which is injected securely over the environment variable. Then you can set some defaults which can be overwritten from a renovate.json in each project which is to be renovated: the author for the git commits made by renovate, labels and the user which is to be assigned to the merge request. Onboarding is whether renovate should create starter merge requests containing a config for new repositories.
Last but not least you define the repositories which are to be renovated. Remember that your Renovate Bot user needs developer access rights to those repositories, otherwise it can't create merge requests.

```
module.exports = {
  platform: 'gitlab',
  endpoint: 'https://gitlab.instance.domain/api/v4/',
  token: process.env.RENOVATE_TOKEN,
  gitAuthor: 'Renovate Bot <git-commit@email.example>',
  labels: ['renovate', 'dependencies', 'automated'],
  assignees: ['jonas'],
  onboarding: true,
  onboardingConfig: {
    extends: ['config:base'],
  },
  repositories: [
    'jonas/repo-to-renovate',
  ],
};
```

config.js

As a last step you probably want to schedule Renovate Bot or better your Gitlab CI to run Renovate regularly. You can do this in the bot's config project / repository under CI / CD > Schedules by creating a new schedule and chosing the frequency to run your bot.

[From this blog](https://violoncello.ch/blog/2019/11/automated-dependency-updates-with-renovate-bot-integrated-into-gitlab-ci)
