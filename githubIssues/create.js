import { octokit } from './initializeGitHub.js'

const createIssue = async (repo, issue) => (
  octokit.request(`POST /repos/${repo}/issues`, issue)
)

const createProjectCardForIssue = async (projectId, issueId) => (
  octokit.request(`POST /projects/columns/${projectId}/cards`, {
    content_id: issueId,
    content_type: 'Issue',
  })
)

export const createIssueCardsForProject = (projectId, issueIds) => (
  Promise.all(issueIds.map(issueId => createProjectCardForIssue(projectId, issueId)))
)

export const createIssuesForRepo = (repo, issues) => (
  Promise.all(issues.map(issue => createIssue(repo, issue)))
)
