# honey-git-flow
A new git flow with hooks for waffle.io. And now you have a Waffle with honey.

## Configure
### Init
You need create in your root folder a gitValidations.json

```
{
    "branchMasters": [
        "master",
        "develop"
    ],
    "branchNames": [
        "feature/#ID_ISSUE/shortest_description",
        "fix/#ID_ISSUE/shortest_description"
    ],
    "commitMessage": "issue #ID_ISSUE | Clear and informative description"
}

```
BranchMasters: It's a property reference for name of your branchs without pattern.
BranchNames: It's a property reference for name of your branchs with pattern.
CommitMessage: It's a template of your commit pattern.

***(remembering that it is necessary everywhere the ids of the issue)***

### Pre-commmit
Add in scripts of your package.json
```
"commitmsg": "honey-commit"
````

### Rebase Blocker (Its a extra)
```
"prerebase": "honey-rebase"
````

## Usage

### Example of commit message
```
git commit -m "issue #000 | meu commit lalalalal"
```

### Example of branch name
```
feature/#000/test-feature
bug/#000/test-feature
test/#000/test-feature
```

### Example of PR name
```
closes #000 | test message lalalalal
```
