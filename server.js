const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const FOLDER_PATH = path.join(__dirname, 'files');

let message = "Welcome to the File API Service";

// Ensure the folder exists
if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH);
}

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve an HTML response at the root URL
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>File API</title>
        </head>
        <body>
            <h1>${message}</h1>
            <p>This is the home page of the File API service.</p>
            <p>Available endpoints:</p>
            <ul>
                <li>Create File: POST /create-file</li>
                <li>List Files: GET /list-files</li>
                <li>Set Message: POST /set-message</li>
            </ul>
        </body>
        </html>
    `);
});

// Endpoint to set the message
app.post('/set-message', (req, res) => {
    if (req.body && req.body.message) {
        message = req.body.message;
        res.status(200).send('Message updated successfully');
    } else {
        res.status(400).send('Invalid request: Message not provided');
    }
});

// Create an API endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const timestamp = new Date().toISOString();
    const filename = `${timestamp.replace(/:/g, '-')}.txt`;
    const filepath = path.join(FOLDER_PATH, filename);

    fs.writeFile(filepath, timestamp, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing file');
        }
        res.status(201).json({ message: `File created successfully: ${filename}` });
    });
});

// Create an API endpoint to retrieve all text files in the folder
app.get('/list-files', (req, res) => {
    fs.readdir(FOLDER_PATH, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading directory');
        }
        const textFiles = files.filter(file => path.extname(file) === '.txt');
        res.status(200).json(textFiles);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
