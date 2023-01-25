module.exports = {
  platform: 'gitlab',
  endpoint: 'https://git.example.dev/api/v4/',
  token: process.env.RENOVATE_TOKEN,
  gitAuthor: 'Renovate Bot <renovatebot@example.dev>',
  labels: ['renovate', 'dependencies', 'automated'],
  assignees: ['james', 'adam', 'brad'],
  assigneesSampleSize: 1,
  onboarding: true,
  onboardingConfig: {
    extends: ['config:base'],
  },
};
