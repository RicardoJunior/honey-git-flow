'use strict';

const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;
const util = require('util');
const config = loadConfiguration();
const ERROR_CODE = 1;
const SUCCESS_CODE = 0;
let noError = true;

function errorMessage(message) {
    console.log(`\u001b[41m${message}\u001b[49m`);
}

function successMessage(message) {
    console.log(`\u001b[42m${message}\u001b[49m`);
}

function error() {
    errorMessage(`Git Conventions: ${util.format.apply(null, arguments)}`);
    noError = false;
}

function success(local) {
    successMessage(`Git Conventions: ${local} is perfect!`);
}

function loadConfiguration () {
    try {
        return JSON.parse(fs.readFileSync('./gitValidations.json'));
    }
    catch (exception) {
        console.log(exception);
    }
}

function getCurrentBranch () {
    let branch = exec('git symbolic-ref HEAD 2> /dev/null || git rev-parse --short HEAD 2> /dev/null');

    if (!branch) {
        throw new Error('Unable to determine branch name using git command.');
    }

    return branch.toString().split('\n')[0].replace('refs/heads/', '').toLowerCase();
}

function validateCommitMessage(message) {
    if (message === '') {
        error('Empty commit message');
        return false;
    }
    else if (message.toString().substring(0, 7) !== 'issue #') {
        error(`Commit message does not follow [${config.commitMessage}]. Start your commit with "issue #".`);
        return false;
    }
    else if (message.toString().indexOf('|') <= 0) {
        error(`Commit message does not follow [${config.commitMessage}]. Missing pipe.`);
        return false;
    }
    else if (message.toString().indexOf(' | ') <= 0) {
        error(`Commit message does not follow [${config.commitMessage}]. Missing spaces between pipe.`);
        return false;
    }
    else {
        let number = message.toString().split(' | ')[0].replace('issue #', '');

        if (number.match(/^\d+$/)) {
            success('commit');
            return true;
        }
        else {
            error('Commit message does not follow [${config.commitMessage}]. Illegal issue number.');
            return false;
        }
    }
}

function validateBranchName() {
    const branchName = getCurrentBranch();
    const branchNameAuxiliar = branchName.split('/')[0];
    const branchAuxiliars = config.branchNames.map(name => name.split('/')[0]);

    if (config.branchMasters.indexOf(branchName) >= 0) {
        return true;
    }

    if (branchName.indexOf('/') <= 0) {
        error('Invalid branch name or review branchMasters and branchNames in your config.');
        return false;
    }

    let i = 0;

    for (let len = branchAuxiliars.length; i < len; i++) {
        if (branchNameAuxiliar === branchAuxiliars[i]) {
            break;
        }
    }

    let indexIssue;

    if (config.branchNames[i]) {
      indexIssue = config.branchNames[i].split('/').indexOf('#ID_ISSUE');
    }

    const message = branchName.split('/')[indexIssue];

    if (indexIssue < 0) {
        error('Invalid branch name! Illegal issue number.');
        return false;
    } else if (branchName.indexOf('/#') < 0) {
        error('Invalid branch name! Missing "#" in branch name.');
        return false;
    } else if (message[indexIssue].replace('#', '').match(/^\d+$/)) {
        success('branch');
        return true;
    } else {
        error('Commit message does not follow [${branchAuxiliars[i]}]. Illegal issue number.');
        return false;
    }
}

function finalProccess() {
    if (noError) {
        process.exit(SUCCESS_CODE);
    } else {
        process.exit(ERROR_CODE);
    }
}

function validate(raw) {
    let returns = validateBranchName(raw);

    if (returns) {
        returns = validateCommitMessage(raw);
        finalProccess();
    }
    else {
        finalProccess();
        return returns;
    }
}

function hasToString(x) {
    return x && typeof x.toString === 'function';
}

if (!config) {
  errorMessage("The config isn't loaded");
  return;
}

if (process.argv && process.argv.length >= 3) {
    switch (process.argv[2]) {
        case "rebase": {
            errorMessage("The use of rebase is locked. Please don't do this and respect standards!");
            process.exit(ERROR_CODE);
            break;
        }
        case "commit": {
            let messageFile = path.resolve(process.cwd(), '.git/COMMIT_EDITMSG');

            fs.readFile(messageFile, (err, buffer) => {
                function getCommitMessage(buffer) {
                    return hasToString(buffer) && buffer.toString();
                };
                validate(getCommitMessage(buffer));
            });
        }
    }
}
