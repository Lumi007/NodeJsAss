const fs = require('fs');

// Step 1: Create directory/folder named "Students"
fs.mkdirSync('Students');

// Step 2: Create a file named user.js in the Students directory
fs.writeFileSync('Students/user.js', '');

// Step 3: Rename the Students directory to "Names"
fs.renameSync('Students', 'Names');

// Step 4: Add your name as content to the file user.js
fs.writeFileSync('Names/user.js', 'Olumide D. Fakorede');

// Step 5: Update the file and add your personal information
const userInfo = {
  age: 30,
  sex: 'Male',
  nationality: 'Nigerian',
  location: 'Lagos',

};
fs.writeFileSync('Names/user.js', JSON.stringify(userInfo, null, 2));

// Step 6: Update the file user.js to {your_name}.js, e.g., daniel_adesoji.js
const newName = 'olumide_fakorede.js';
fs.renameSync('Names/user.js', `Names/${newName}`);

// Step 7: Read the contents from {your_name}.js using fs.readFile
fs.readFile(`Names/${newName}`, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
  } else {
    console.log(`Contents of ${newName}:`);
    console.log(data);
  }
});

// Step 8: Delete the file {your_name}.js
fs.unlinkSync(`Names/${newName}`);

// Step 9: Delete the directory "Names"
fs.rmdirSync('Names');
