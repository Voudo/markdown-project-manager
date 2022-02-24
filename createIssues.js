import inquirer from 'inquirer'

import searchList from 'inquirer-search-list'
inquirer.registerPrompt('search-list', searchList)

import { markdownToGithubIssue } from './parser/githubIssueMarkdownParser.js'
import { createIssueCardsForProject, createIssuesForRepo } from './githubIssues/create.js'
import { listColumnsForProject, listProjectsForOrg, searchForRepo } from './githubIssues/getRepos.js'

const promptToAddIssuesToAProject = async (issues) => {
  const projects = await listProjectsForOrg('articulate')

  inquirer.prompt({
    type: 'search-list',
    name: 'projectId',
    message: `Add ${issues.length} issue/s to a project?`,
    choices: projects.map((project) => ({ name: project.name, value: project.id })),
  })
    .then(async (response) => {
      const columns = await listColumnsForProject(response.projectId)
      const issueIds = issues.map((issue) => issue?.data?.id)

      createIssueCardsForProject(columns[0]?.id, issueIds)
        .then((response) => {
          console.log(`A-ok! Successfully created ${response.length} new cards!`)
        })
    })
}

const promptRepository = (repositoryName, issues, editorContent) => {
  searchForRepo(repositoryName)
    .then((repositories) => {
      if (repositories?.data?.items.length) {
        inquirer.prompt({
          type: 'search-list',
          name: 'repo',
          message: 'Select a repo:',
          choices: repositories?.data?.items.map((repo) => repo.full_name),
        }).then((selectedRepo) => {
          createIssuesForRepo(selectedRepo.repo, issues)
            .then((response) => {
              promptToAddIssuesToAProject(response)
              console.log(`Woot! ${issues.length} issue/s were created, yo.`)
            })
        })
      } else {
        console.log('ERROR: I couldn\'t find any matching repos. Please try that again.')
        console.log('-------------')
        promptToCreateNewIssuesFromEditorContent(editorContent)
      }
    })
}

const promptToCreateNewIssuesFromEditorContent = (editorContent) => {
  const issues = markdownToGithubIssue(editorContent)

  // TODO: Allow optionally selecting cards to create or save for later or delete. - Chad
  console.log('issues', issues)

  inquirer.prompt({
    type: 'input',
    name: 'repositoryName',
    message: `You're about to create ${issues.length} issue/s.\nWhat repository do they belong in?`,
  }).then((response) => {
    promptRepository(response.repositoryName, issues, editorContent)
  })
}
 
inquirer.prompt({
  type: 'editor',
  name: 'editor',
  message: 'Open your editor to create a markdown file.',
})
.then((editorResponse) => {
  promptToCreateNewIssuesFromEditorContent(editorResponse.editor)
})
