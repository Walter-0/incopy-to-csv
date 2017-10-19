const fs = require ('fs')
const convert = require('xml-js')

const file = fs.readFileSync('incopy_2.icml', 'utf8')
const result = JSON.parse(convert.xml2json(file, {compact: true}))
const content = result.Document.Story.ParagraphStyleRange.CharacterStyleRange[0].Content
const output = content.filter((value) => {
  return value._text !== undefined
}).map((value) => {
  return value._text
})
console.log(output)

fs.writeFile('export.csv', JSON.stringify(content), 'utf8', (err) => {
  if (err) { throw err }
  console.log('Export successful!')
})
