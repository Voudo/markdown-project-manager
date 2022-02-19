import { octokit } from './initializeGitHub.js'

// TODO: Allow pagination. - Chad
export const listReposForOrg = async (org) => (
  octokit.request(`GET /orgs/${org}/repos`, {
    per_page: 50,
    sort: 'full_name',
  })
)
