
# CPPUnify
A command line tool for unifying cpp code into a single file. Useful for submitting code to HackerRank. Necessary files are inferred based upon the `#include`s of the given root file. Implementations are also inferred based upon the name of header files.

## Usage
```
Usage: cppunify [rootfile] [options]

Description:
  A command-line tool to unify C++ source files.

Options:
  -h, --help       Display this help message.
  -o, --output     Specify the output file.

Examples:
  cppunify rootfile.cpp
  cppunify rootfile.cpp -o unified.cpp
  cppunify rootfile.cpp --output unified.cpp
```

## Installation
Clone this repo, then run the following: 
```
cd cppunify
npm install
npm install -g // May require administrator privileges
```