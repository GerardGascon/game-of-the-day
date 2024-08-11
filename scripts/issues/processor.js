import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
   auth: process.env.GITHUB_TOKEN
});

async function run() {
    const issueNumber = process.env.ISSUE_NUMBER;
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

    try {
        const { data: issue } = await octokit.issues.get({
            owner,
            repo,
            issue_number: issueNumber,
        });

        console.log(`Issue Title: ${issue.title}`);
    } catch (error) {
        console.log(`Error fetching issue: ${error.message}`);
        process.exit(1);
    }
}

run();