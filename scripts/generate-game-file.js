import fs from "fs";
import path from "path";
import url from "url";
import YAML from "yaml";

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const issueNumber = process.env.ISSUE_NUMBER;
// const issueBody = process.env.ISSUE_BODY;
//
// const fileName = `ISSUE_${issueNumber}.md`;
// const fileContent = `### Issue Description\n\n${issueBody}`;
//
// fs.writeFileSync(path.join(__dirname, '..', 'data', fileName), fileContent);

function parseIssue(issueText) {
    const lines = issueText.split('\n').map(line => line.trim());

    const gameTitle = lines.find(line => line.startsWith("**Game Title**:")).split(': ')[1].trim();
    const fileName = getFileName(gameTitle);
    const link = lines.find(line => line.startsWith("**Link**:")).match(/\((.*?)\)/)[1].trim();
    const coverImage = lines.find(line => line.startsWith("**Cover Image**:")).match(/!\[.*\]\((.*?)\)/)[1].trim();

    const descriptionStartIndex = lines.indexOf("### Description") + 1;
    const descriptionEndIndex = lines.indexOf("### Screenshots");
    const description = lines.slice(descriptionStartIndex, descriptionEndIndex).join('\n').trim();

    const screenshotsStartIndex = lines.indexOf("### Screenshots") + 1;
    const screenshotsEndIndex = lines.indexOf("### Developers");
    const screenshots = lines.slice(screenshotsStartIndex, screenshotsEndIndex).filter(str => str !== '').slice(0, 3)
        .map(line => line.match(/\(([^\)]+)\)/)[1].trim());

    const developersStartIndex = lines.indexOf("### Developers") + 1;
    const developersEndIndex = lines.indexOf("### End");
    const developers = lines.slice(developersStartIndex, developersEndIndex).filter(str => str !== '')
        .map(dev => {
            const nameMatch = dev.match(/\*\*(.*?)\*\*/);
            const linkMatch = dev.match(/\((.*?)\)/);
            return {
                name: nameMatch ? nameMatch[1] : null,
                link: linkMatch ? linkMatch[1] : null
            };
        });

    return {
        filename: fileName,
        name: gameTitle,
        link: link,
        cover: coverImage,
        description: description,
        screenshots: screenshots,
        developers: developers
    };
}

function getFileName(title){
    return title
        .normalize('NFD')                    // Normalize to decompose accents
        .replace(/[\u0300-\u036f]/g, '')     // Remove diacritical marks
        .toLowerCase()                       // Convert to lowercase
        .replace(/[^a-z0-9]+/g, '-')         // Replace non-alphanumeric characters with hyphens
        .replace(/^-+|-+$/g, '');
}

function buildYaml(parsedData) {
    const developers = parsedData.developers.map(dev => ({
        name: dev.name,
        ...(dev.link ? { link: dev.link } : {})
    }));

    const data = {
        filename: parsedData.filename,
        name: parsedData.name,
        link: parsedData.link,
        cover: parsedData.cover,
        description: parsedData.description,
        screenshots: parsedData.screenshots,
        developers: developers
    };

    return YAML.stringify(data, { lineWidth: 0 });
}

const issueText = `
**Game Title**: Roses  
**Link**: [Roses on itch.io](https://arnaums1.itch.io/roses)  
**Cover Image**: ![Roses](roses.png)

### Description
Ajuda'ns a fer florir el català!  
Make a garden flourish while you write in Catalan language.

### Screenshots
![Screenshot 1](roses/image1.png)  
![Screenshot 2](roses/image2.png)

### Developers
- **Geri** - [Twitter](https://x.com/G_of_Geri)
- **Arnau** - [Twitter](https://x.com/arnau555)
- **Raquel**
- **Índigo**
- **Iván**

### End
`;
const parsedData = parseIssue(issueText);
const yamlContent = buildYaml(parsedData);
console.log(yamlContent);
