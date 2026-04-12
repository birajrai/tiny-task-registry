const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../../registry/schema.json'), 'utf8'));
const validate = ajv.compile(schema);

const REGISTRY_PATH = path.join(__dirname, '../../registry');

function validateSkills(dir) {
    const items = fs.readdirSync(dir);
    let hasError = false;

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            validateSkills(fullPath);
        } else if (item === 'SKILL.md') {
            const content = fs.readFileSync(fullPath, 'utf8');
            const match = content.match(/^---\n([\s\S]*?)\n---/);
            
            if (!match) {
                console.error(`❌ Missing frontmatter in ${fullPath}`);
                hasError = true;
                continue;
            }

            try {
                const metadata = yaml.load(match[1]);
                const valid = validate(metadata);
                
                if (!valid) {
                    console.error(`❌ Validation failed for ${fullPath}:`);
                    console.error(validate.errors);
                    hasError = true;
                } else {
                    console.log(`✅ Validated: ${fullPath}`);
                }
            } catch (e) {
                console.error(`❌ Parse error in ${fullPath}: ${e.message}`);
                hasError = true;
            }
        }
    }

    if (hasError) process.exit(1);
}

console.log('🔍 Starting registry validation...');
validateSkills(REGISTRY_PATH);
console.log('✨ Validation complete!');
