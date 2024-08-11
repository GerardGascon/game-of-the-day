import fs from "fs";
import path from "path";

const issueNumber = process.env.ISSUE_NUMBER;
const issueBody = process.env.ISSUE_BODY;

const fileName = `ISSUE_${issueNumber}.md`;
const fileContent = `### Issue Description\n\n${issueBody}`;

fs.writeFileSync(path.join(__dirname, '..', 'data', fileName), fileContent);