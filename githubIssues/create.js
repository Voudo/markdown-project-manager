import { octokit } from './initializeGitHub.js'

const createIssue = async (repo, issue) => (
  octokit.request(`POST /repos/${repo}/issues`, issue)
)

export const createIssuesForRepo = (repo, issues) => {
  Promise.all(issues.map(issue => {
    createIssue(repo, issue)
  }))
}