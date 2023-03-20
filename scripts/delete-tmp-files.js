const fs = require('fs');
const path = require('path');

function deleteAllImage() {
    const directory = __dirname + '/../src/assets/images/temporary/';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

deleteAllImage();