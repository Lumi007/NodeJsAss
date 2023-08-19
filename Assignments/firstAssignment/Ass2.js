const fs = require('fs');

// Step 1: Create directory/folder named "Students"
fs.mkdir('Students', (err) => {
  if (err) {
    console.error('Error creating Students directory:', err);
  } else {
    console.log('Students directory created.');

    // Step 2: Create a file named user.js in the Students directory
    fs.writeFile('Students/user.js', '', (err) => {
      if (err) {
        console.error('Error creating user.js file:', err);
      } else {
        console.log('user.js file created.');

        // Step 3: Rename the Students directory to "Names"
        fs.rename('Students', 'Names', (err) => {
          if (err) {
            console.error('Error renaming directory:', err);
          } else {
            console.log('Directory renamed to Names.');

            // Step 4: Add your name as content to the file user.js
            fs.writeFile('Names/user.js', 'Olumide D. Fakorede', (err) => {
              if (err) {
                console.error('Error writing to user.js:', err);
              } else {
                console.log('Name added to user.js.');

                // Step 5: Update the file and add your personal information
                const userInfo = {
                  age: 30,
                  sex: 'Male',
                  nationality: 'Nigerian',
                  phoneNumber: '08051106313',
                  // Add any other information about yourself here
                };
                fs.writeFile('Names/user.js', JSON.stringify(userInfo, null, 2), (err) => {
                  if (err) {
                    console.error('Error updating user.js:', err);
                  } else {
                    console.log('Personal information added to user.js.');

                    // Step 6: Update the file user.js to {your_name}.js
                    const newName = 'olumide_fa.js';
                    fs.rename('Names/user.js', `Names/${newName}`, (err) => {
                      if (err) {
                        console.error('Error renaming user.js:', err);
                      } else {
                        console.log('File renamed to', newName);

                        // Step 7: Read the contents from {your_name}.js using fs.readFile
                        fs.readFile(`Names/${newName}`, 'utf8', (err, data) => {
                          if (err) {
                            console.error('Error reading file:', err);
                          } else {
                            console.log(`Contents of ${newName}:`);
                            console.log(data);

                            // Step 8: Delete the file {your_name}.js
                            fs.unlink(`Names/${newName}`, (err) => {
                              if (err) {
                                console.error('Error deleting file:', err);
                              } else {
                                console.log(`${newName} deleted.`);

                                // Step 9: Delete the directory "Names"
                                fs.rmdir('Names', (err) => {
                                  if (err) {
                                    console.error('Error deleting directory:', err);
                                  } else {
                                    console.log('Names directory deleted.');
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});
