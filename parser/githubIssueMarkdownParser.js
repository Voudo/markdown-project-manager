// TODO: allow referencing parent/children cards by id with special syntax. - Chad

const removeLineForMatch = (input, match) => input.split('\n').filter((line) => !match.test(line)).join('\n')

const matchTitle = 'title:\\s'
const matchLabels = 'labels:\\s'

const getMatchLines = (key) => new RegExp(`(?<=(^|\n)${key})(.)+?(?=\n)`, 's')
const getMatchToMatchOrFileEnd = new RegExp(`(?<=^|\n)${matchTitle}[^\n]*\n(.*?)(?=\n${matchTitle}|$)`, 'gs')

const buildItemFromSection = (section) => {
  const labelMatches = section.match(getMatchLines(matchLabels)) || ['']
  const parsedLabels = labelMatches[0].split(',').filter((label) => label).map((label) => label.trim())

  const contentWithoutTitle = removeLineForMatch(section, new RegExp(matchTitle, 's'))
  const contentWithoutLabel = removeLineForMatch(contentWithoutTitle, new RegExp(matchLabels, 's'))

  const content = contentWithoutLabel.trim().replace(/\n+/, '')

  return {
    title: section.match(getMatchLines(matchTitle))[0],
    labels: parsedLabels,
    body: content,
  }
}

export const markdownToGithubIssue = (text) => {
  const sections = text.match(getMatchToMatchOrFileEnd)

  return sections.map(buildItemFromSection)
}