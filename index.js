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
const sourceFiles = fs.readdirSync(path.join(__dirname, 'incopy'), function (err, files) {
  return files
})
sourceFiles.forEach((sourceFile) => {
  const incopy = fs.readFileSync(path.join(__dirname, 'incopy', sourceFile), 'utf8')
  const convertedJSON = JSON.parse(convert.xml2json(incopy, {compact: true}))
//  const convertedXML = convertedJSON.Document.Story.ParagraphStyleRange.CharacterStyleRange[0].Content
  const convertedXML = convertedJSON.Document.Story.ParagraphStyleRange.CharacterStyleRange[0]
  console.log(convertedXML)
//  let output = convertedXML.filter((value) => {
//    return value._text !== undefined
//  }).map((value) => {
//    return value._text.slice(value._text.indexOf(':') + 2)
//  })
})

//console.log(sourceFiles)

// const a = new CSVRow(...output)
//const row = new CSVRow(output[0])
//const data = [
//  {
//    'Title': row.title,
//    'Page title': row.pageTitle,
//    'Deck': row.deck,
//    'Roofline': row.roofline,
//    'Description': row.description,
//    'Page Number': row.pageNumber
//  }
//]
//
//const csv = json2csv({ data: data, fields: fields })
//
//fs.writeFile('export.csv', csv, function(err) {
//  if (err) throw err
//  console.log('file saved')
//})
