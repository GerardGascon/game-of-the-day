import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const issueNumber = process.env.ISSUE_NUMBER;
const issueBody = process.env.ISSUE_BODY;

const fileName = `ISSUE_${issueNumber}.md`;
const fileContent = `### Issue Description\n\n${issueBody}`;

fs.writeFileSync(path.join(__dirname, '..', 'data', fileName), fileContent);