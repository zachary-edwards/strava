import * as fs from 'fs'

const formatFileName = (fileName?: string) => `./files/${fileName ?? "test"}.txt`.toLowerCase();

const fileExists = (fileName: string): boolean => fs.existsSync(formatFileName(fileName))

const readFile = (fileName?: string): any | undefined => {
  if (fileExists(fileName)) {
    const buffer: Buffer = fs.readFileSync(formatFileName(fileName))

    return JSON.parse(buffer.toString())
  }
  return undefined
}

const writeFile = (fileName?: string, content?: any) => {
  fs.writeFile(formatFileName(fileName), JSON.stringify(content), err => {
    if (err) throw err
  })
}

export { fileExists, readFile, writeFile }