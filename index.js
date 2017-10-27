const fs = require ('fs')
const path = require ('path')
const convert = require('xml-js')
const json2csv = require('json2csv')

class CSVRow {
  constructor (pageTitle, title, deck, roofline, description, pageNumber) {
    this.pageTitle = pageTitle
    this.title = title
    this.deck = deck
    this.roofline = roofline
    this.description = description
    this.pageNumber = pageNumber
  }
}

const fields = ['Page title', 'Title', 'Deck', 'Roofline', 'Description', 'Page Number']
const data = []
console.log('Checking source directory.............')
let sourceFiles = fs.readdirSync(path.join(__dirname, 'incopy'), function (err, files) {
  if (err) throw err
  return files
})
sourceFiles = sourceFiles.filter((e) => e !== '.DS_Store')
sourceFiles.forEach((sourceFile) => {
  const incopy = fs.readFileSync(path.join(__dirname, 'incopy', sourceFile), 'utf8')
  const convertedJSON = JSON.parse(convert.xml2json(incopy, {compact: true}))
//  const convertedXML = convertedJSON.Document.Story.ParagraphStyleRange.CharacterStyleRange.Content
  const convertedXML = convertedJSON.Document.Story.ParagraphStyleRange.map((e) => {
    return e.CharacterStyleRange.Content
  }).reduce((a, b) => {
    return a.concat(b)
  },[])
  let output = convertedXML.filter((value) => {
    return value !== undefined
  }).map((value) => {
    let begin = '--BEGIN CSV FIELDS--'
    let end = '--END CSV FIELDS--'
    if (Object.values(value)[0] === begin) {
      return true
    } else if (Object.values(value)[0] === end) {
      return false
    } else {
      return value._text.slice(value._text.indexOf(':') + 2)
    }
  })
  output = output.slice(output.indexOf(true) + 1, output.indexOf(false))
  const row = new CSVRow(...output)
  data.push(
    {
      'Title': row.title,
      'Page title': row.pageTitle,
      'Deck': row.deck,
      'Roofline': row.roofline,
      'Description': row.description,
      'Page Number': row.pageNumber
    }
  )
})

const csv = json2csv({ data: data, fields: fields })

fs.writeFile('export.csv', csv, function(err) {
  if (err) throw err
  console.log('Exported successfully!')
})
