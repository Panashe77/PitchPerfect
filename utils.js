// utils.js
const fs = require('fs');
const path = require('path');

const dataPath = './data'; // Create this directory to store JSON files

const readJSONFile = (fileName) => {
    const filePath = path.join(dataPath, fileName);
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        return JSON.parse(fileContent);
    }
    return [];
};

const writeJSONFile = (fileName, data) => {
    const filePath = path.join(dataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readJSONFile, writeJSONFile };
