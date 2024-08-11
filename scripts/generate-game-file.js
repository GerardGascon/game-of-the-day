import * as helper from "./issues/helper.js";

const issueText = `
**Game Title**: Roses  
**Link**: [Roses on itch.io](https://arnaums1.itch.io/roses)  
**Store Name**: itch.io
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

const main = async() => {
    const parsedData = helper.parseIssue(issueText);
    const yamlContent = helper.buildYaml(parsedData);
    console.log(yamlContent);
};
main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
})
