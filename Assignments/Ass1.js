const path = require('path');
const os = require('os');

// Print out the current working directory
console.log('Current Working Directory:', process.cwd());

// Example file path for demonstration
const filePath = '/path/to/somefile.txt';

// Print out the separator of a given file path
console.log('File Path Separator:', path.sep);

// Print out the extension name of a file path
console.log('File Extension Name:', path.extname(filePath));

// Print out the process id of the current running process
console.log('Process ID:', process.pid);

// Print out the user information of the os
const userInfo = os.userInfo();
console.log('User Info:', userInfo);

// Print out the platform of an operating system
console.log('OS:', os.platform());



