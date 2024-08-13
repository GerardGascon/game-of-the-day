import YAML from "yaml";

export function parseIssue(issueText) {
    const lines = issueText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const findValueAfterHeading = (heading) => {
        const index = lines.indexOf(heading) + 1;
        return index < lines.length ? lines[index] : '';
    };

    const findTextAfterHeading = (heading) => {
        let index = lines.indexOf(heading) + 1;
        let text = lines[index++];
        while (!lines[index].startsWith('#')){
            text += `\n${lines[index++]}`;
        }
        return index < lines.length ? text : '';
    };

    const getDevelopers = (heading) => {
        let index = lines.indexOf(heading) + 1;
        let text = lines[index++];
        return text.split(',');
    };

    const gameTitle = findValueAfterHeading("### Game Title");
    const fileName = getFileName(gameTitle);
    const link = findValueAfterHeading("### Link");
    const link_name = findValueAfterHeading("### Store Name");
    const coverImage = parseUrl(findValueAfterHeading("### Cover Image"));
    const description = findTextAfterHeading("### Description");
    const screenshots = parseUrls(findValueAfterHeading("### Screenshots"));
    const developers = getDevelopers("### Developers");

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
    let urlMatch = link.match(/\((.*?)\)/);
    return urlMatch ? urlMatch[1] : null;
}

function parseUrls(links){
    return links.split(',https://').map((url, index) => {
        if (index === 0)
            return url; // The first URL didn't get split off the delimiter
        return `https://${url}`;
    });
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