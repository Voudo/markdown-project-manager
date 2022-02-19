import inquirer from 'inquirer'

import searchList from 'inquirer-search-list'
inquirer.registerPrompt('search-list', searchList)

import { markdownToGithubIssue } from './parser/githubIssueMarkdownParser.js'
import { createIssuesForRepo } from './githubIssues/create.js'
import { listReposForOrg } from './githubIssues/getRepos.js'


const questions = (repoNames) => ([
  {
    type: 'search-list',
    name: 'repo',
    message: 'Select a repo:',
    choices: repoNames,
  },
  {
    type: 'list',
    name: 'input',
    message: 'How do you want to create the issues?',
    choices: [
      'Create in editor',
      { name: 'Load from a markdown file', disabled: 'Coming soon...' },
    ],
    validate(answer) {
      return answer.length != 1
        ? 'You must select an input.'
        : true
    },
  },
])

inquirer
  .prompt({
    type: 'input',
    name: 'organization',
    message: 'What organization are you in?',
  })
  .then((orgResponse) => {
    listReposForOrg(orgResponse.organization)
      .then((repos) => {
        const repoNames = repos.data.map((repo) => repo.full_name)

        inquirer
          .prompt(questions(repoNames))
          .then((responses) => {
            if (responses.input === 'Create in editor') {
              inquirer.prompt({
                type: 'editor',
                name: 'editor',
                message: 'Open your editor to create a markdown file.',
              })
              .then((editorResponse) => {
                const issues = markdownToGithubIssue(editorResponse.editor)
        
                // TODO: Allow optionally selecting cards to create or save for later or delete. - Chad
                console.log('issues', issues)
        
                inquirer.prompt({
                  type: 'confirm',
                  name: 'confirm',
                  message: `Create ${issues.length} issues?`,
                }).then((response) => {
                  if (response.confirm === true) {
                    createIssuesForRepo(responses.repo, issues)
                  } else {
                    // TODO: prompt to return to editor or end. - Chad
                  }
                })
              })
            } else {
              inquirer.prompt({
                type: 'editor',
                name: 'editor',
                message: 'What is the path to the markdown file?',
              })
              .then((path) => {
                // TODO: Load markdown file, then parse, then createIssue. - Chad
              })
            }
          })
      })
  })
