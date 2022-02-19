import { Octokit } from '@octokit/core'

export const octokit = new Octokit({ auth: process.env.GH_TOKEN || process.env.GITHUB_TOKEN })
