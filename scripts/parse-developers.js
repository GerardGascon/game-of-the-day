import {loadData} from "./utils.js";
import fs from "fs";

function extractDeveloperName(inputStr) {
    const regex = /(.*)\((.*)\)/;
    const match = inputStr.match(regex);

    return match && match.length === 3 ? match[1].trimEnd() : inputStr.trimEnd();
}

const data = loadData();
const developerProjects = {};

data.forEach(project => {
    project.content.developers.forEach(developer => {
        const devName = extractDeveloperName(developer);
        if (!developerProjects[devName]) {
            developerProjects[devName] = [];
        }

        developerProjects[devName].push(project.content.name);
    });
});

const sortedDeveloperProjects = Object.entries(developerProjects)
    .sort((a, b) => {
        const projectCountDiff = b[1].length - a[1].length;
        if (projectCountDiff === 0) {
            return a[0].localeCompare(b[0]);
        }
        return projectCountDiff;
    });

const sortedDeveloperProjectsObj = Object.fromEntries(sortedDeveloperProjects);
fs.writeFileSync("developers.json", JSON.stringify(sortedDeveloperProjectsObj, null, 2), 'utf8');

console.log(sortedDeveloperProjectsObj);