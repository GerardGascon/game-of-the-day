import * as helper from "./issues/helper.js";

const issueText = `
### Game Title

Roses

### Link
https://arnaums1.itch.io/roses

### Store Name

itch.io

### Cover Image

![Roses](roses.png)

### Description

Ajuda'ns a fer florir el català!  
Make a garden flourish while you write in Catalan language.

### Screenshots

![Screenshot 1](roses/image1.png)  
![Screenshot 2](roses/image2.png)

### Developers

Geri - https://x.com/G_of_Geri
Arnau - https://x.com/arnau555
Raquel
Índigo
Iván
`;

const main = async() => {
    const body = process.env.ISSUE_BODY;
    const parsedData = helper.parseIssue(body);
    const yamlContent = helper.buildYaml(parsedData);
    console.log(yamlContent);
};
main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
})
