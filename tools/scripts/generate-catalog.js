const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const REGISTRY_PATH = path.join(__dirname, '../../registry');
const CATALOG_PATH = path.join(__dirname, '../../data/catalog.json');

function generateCatalog() {
    const catalog = {
        generatedAt: new Date().toISOString(),
        skills: []
    };

    function traverse(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                traverse(fullPath);
            } else if (item === 'SKILL.md') {
                const content = fs.readFileSync(fullPath, 'utf8');
                const match = content.match(/^---\n([\s\S]*?)\n---/);
                
                if (match) {
                    try {
                        const metadata = yaml.load(match[1]);
                        catalog.skills.push({
                            ...metadata,
                            path: path.relative(path.join(__dirname, '../../'), fullPath)
                        });
                    } catch (e) {
                        console.error(`Error parsing ${fullPath}: ${e.message}`);
                    }
                }
            }
        }
    }

    traverse(REGISTRY_PATH);
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2));
    console.log(`✨ Catalog generated at ${CATALOG_PATH}`);
}

generateCatalog();
