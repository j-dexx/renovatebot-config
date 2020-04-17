module.exports = {
  platform: 'gitlab',
  endpoint: 'https://git.clickds.dev/api/v4/',
  token: process.env.RENOVATE_TOKEN,
  gitAuthor: 'Renovate Bot <renovatebot@clickds.dev>',
  labels: ['renovate', 'dependencies', 'automated'],
  assignees: ['james', 'adam', 'brad'],
  assigneesSampleSize: 1,
  onboarding: true,
  onboardingConfig: {
    extends: ['config:base'],
  },
  repositories: ['internal/laravel-ci-cd'],
};
