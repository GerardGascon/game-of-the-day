import YAML from "yaml";

export function parseIssue(issueText) {
    const lines = issueText.split('\n').map(line => line.trim());

    const gameTitle = lines.find(line => line.startsWith("**Game Title**:")).split(': ')[1].trim();
    const fileName = getFileName(gameTitle);
    const link = lines.find(line => line.startsWith("**Link**:")).match(/\((.*?)\)/)[1].trim();
    const link_name = lines.find(line => line.startsWith("**Store Name**:")).split(': ')[1].trim();
    const coverImage = lines.find(line => line.startsWith("**Cover Image**:")).match(/!\[.*]\((.*?)\)/)[1].trim();

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
        link_name: link_name,
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

export function buildYaml(parsedData) {
    const developers = parsedData.developers.map(dev => ({
        name: dev.name,
        ...(dev.link ? { link: dev.link } : {})
    }));

    const data = {
        filename: parsedData.filename,
        name: parsedData.name,
        link: parsedData.link,
        link_name: parsedData.link_name,
        cover: parsedData.cover,
        description: parsedData.description,
        screenshots: parsedData.screenshots,
        developers: developers
    };

    return YAML.stringify(data, { lineWidth: 0 });
}