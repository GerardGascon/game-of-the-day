const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dataFilePath = path.join(__dirname, '..', 'data', 'data.json');
const templateFilePath = path.join(__dirname, '..', 'templates', 'template.html');
const htmlFilePath = path.join(__dirname, '..', 'public', 'index.html');

const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
const htmlContent = fs.readFileSync(templateFilePath, 'utf8');

const page = generatePage(htmlContent, data[0]);
fs.writeFileSync(htmlFilePath, page);

function generatePage(template, data){
    const $ = cheerio.load(htmlContent);

    $(`#game-title`).html(data.name);
    $(`.game-link`).html(data.link_name).attr('href', data.link);
    $(`#cover`).attr('src', `images/covers/${data.cover}`);
    $(`#description`).html(data.description.replace('\n', '<br>'));

    $(`#screenshots`).html('');
    for (const i in data.screenshots) {
        const imgElement = `<img src="images/screenshots/${data.screenshots[i]}" alt="Screenshot ${i+1}">`;
        $(`#screenshots`).append(imgElement);
    }

    let namesString = '';
    for (const i in data.developers) {
        if (i != 0)
            namesString += ', ';
        const link = `<a href="${data.developers_link[i]}" target="_blank">${data.developers[i]}</a>`;
        namesString += link;
    }
    const updatedText = $(`#developers`).html().replace('%names%', namesString);
    $(`#developers`).html(updatedText);
    return $.html();
}