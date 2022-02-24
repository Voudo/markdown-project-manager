import { octokit } from './initializeGitHub.js'

// TODO: Allow pagination. - Chad
export const listProjectsForOrg = async (org) => (
  octokit.request(`GET /orgs/${org}/projects`, {
    per_page: 100,
  })
    .then((projects) => projects?.data?.map((project) => ({
      name: project.name, id: project.id }
    )))
)

export const listColumnsForProject = async (projectId) => (
  octokit.request(`GET /projects/${projectId}/columns`)
    .then((response) => response?.data)
)

export const listReposForOrg = async (org) => (
  octokit.request(`GET /orgs/${org}/repos`, {
    per_page: 100,
    sort: 'full_name',
  })
)

export const searchForRepo = async (search) => (
  octokit.request('GET /search/repositories', {
    q: `${search} in:name org:articulate`,
    per_page: 100,
  })
)
