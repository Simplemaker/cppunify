#!/usr/bin/env node

import fs from 'fs'
import minimist from 'minimist'
import path from 'path'

const helpMessage = `Usage: cppunify [rootfile] [options]

Description:
  A command-line tool to unify C++ source files.

Options:
  -h, --help       Display this help message.
  -o, --output     Specify the output file.

Examples:
  cppunify rootfile.cpp
  cppunify rootfile.cpp -o unified.cpp
  cppunify rootfile.cpp --output unified.cpp
`

const argv = minimist(process.argv.slice(2))

if(argv._.length != 1 || argv.help || argv.h){
    console.log(helpMessage)
    process.exit()
}

const root_file = path.basename(argv._[0])
const root_dir = path.dirname(argv._[0])
const OUT_NAME = argv.o || argv.output || path.join(root_dir, 'compiled.cpp')

const INCL_REGEX = /#include "(.*?)"\r?\n?/g

function getChildFiles(filename){
    const filedata = fs.readFileSync(path.join(root_dir, filename), 'utf-8')
    const lines = filedata.matchAll(INCL_REGEX)
    return [...lines].map(line => line[1])
}

const queue = [root_file]
const grey = new Set()
const visited = []

// Perform a topological ordering of file DAG
function visitVertex(filename){
    if(visited.includes(filename)) return; // Do not revisit   
    grey.add(filename) // Mark the vertex as "currently being visited"

    // Infer presence of implementations based on header files
    if(/.hpp$/.test(filename)){
        const impl = filename.replace(/.hpp$/, '.cpp')
        if(!grey.has(impl) && !queue.includes(impl) && fs.existsSync(path.join(root_dir, impl))){
            queue.push(impl)
        }
    }
    // Visit all children
    getChildFiles(filename).forEach(visitVertex)
    // Add this to visited
    visited.push(filename)
}

while(queue.length){
    const v = queue.shift()
    visitVertex(v)
}

// Next, we combine each file in order
const filedata = []
for(const file of visited){
    const f = fs.readFileSync(path.join(root_dir, file), 'utf-8')
    filedata.push(
        f.replace(INCL_REGEX, '')
    )
}

fs.writeFileSync(OUT_NAME, filedata.join('\n'), {flag: 'w'})