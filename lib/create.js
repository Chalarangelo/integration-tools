const fs = require('fs-extra');
const path = require('path');
const { green, red } = require('kleur');

const replaceTitle = (template, title) => template.replace(/title:\s*.*\n/, `title: ${title}\n`);

const create = (config, template, snippetName, targetDir) => {
  const fileData = replaceTitle(template, snippetName);

  try {
    if(!fs.existsSync(path.join(targetDir, config.snippetPath)))
      fs.mkdirSync(path.join(targetDir, config.snippetPath));

    fs.writeFileSync(path.join(targetDir, config.snippetPath, `${snippetName}.md`), fileData );
    console.log(
      `${green(
        'integration-tools [DONE] '
      )} Snippet creation procedure has created the snippet file.`
    );
  } catch (err) {
    console.log(`${red('integration-tools [ERRR]  ')} Snippet creation procedure prodecure has encountered an error while creating the snippet file: ${err}`);
    process.exit(1);
  }
};

module.exports = create;
