const fs = require('fs');
const path = require("path");
export const getWords = () => {
    // leemos el contenido del archivo
    const realPath = path.join(__dirname, `/words.txt`);
    console.info({ realPath });
    const lines = [];
    const fileContent = fs.readFileSync(realPath, 'utf-8');
    // dividimos el contenido en líneas
    fileContent.split(/\r?\n/).forEach(line => {
        console.log(`Line from file: ${line}`);
        lines.push(line.trim());
    });
    // devolvemos un array con las palabras de cada línea
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    return lines;
};
