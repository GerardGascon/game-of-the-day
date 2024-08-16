import YAML from "yaml";

export function parseIssue(issueText) {
    const lines = issueText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const findValueAfterHeading = (heading) => {
        const index = lines.indexOf(heading) + 1;
        return index <= lines.length ? lines[index] : '';
    };

    const findTextAfterHeading = (heading) => {
        let index = lines.indexOf(heading) + 1;
        let text = lines[index++];
        while (index < lines.length && !lines[index].startsWith('#')){
            text += `\n${lines[index++]}`;
        }
        return index <= lines.length ? text : '';
    };

    const getDevelopers = (text) => {
        return text.split('\n');
    };

    const gameTitle = findValueAfterHeading("### Game Title");
    const fileName = getFileName(gameTitle);
    const link = findValueAfterHeading("### Link");
    const link_name = findValueAfterHeading("### Store Name");
    const coverImage = parseUrl(findTextAfterHeading("### Cover Image"));
    const description = findTextAfterHeading("### Description");
    const screenshots = parseUrls(findTextAfterHeading("### Screenshots"));
    const developers = getDevelopers(findTextAfterHeading("### Developers"));
    console.log(developers);

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

function parseUrl(link){
    const urlRegex = /(https?:\/\/\S+)/g;
    const matches = link.match(urlRegex);
    return matches;
}

function parseUrls(links){
    const urlRegex = /url:\s*(https?:\/\/\S+)/g;
    const urls = [];
    const matches = links.matchAll(urlRegex);

    for (const match of matches) {
        urls.push(match[1]); // match[1] contains the URL
    }
    return urls;
}

function getFileName(title){
    return title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function buildYaml(parsedData) {
    const data = {
        filename: parsedData.filename,
        name: parsedData.name,
        link: parsedData.link,
        link_name: parsedData.link_name,
        cover: parsedData.cover,
        description: parsedData.description,
        screenshots: parsedData.screenshots,
        developers: parsedData.developers
    };

    return YAML.stringify(data, { lineWidth: 0 });
}