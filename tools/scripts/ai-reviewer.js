const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * AI-powered Reviewer Script
 * Mimics CodeRabbit-like behavior for local skill analysis.
 */

const SKILL_PATH = process.argv[2];

if (!SKILL_PATH) {
  console.error('❌ Error: Please provide a path to a skill file (e.g., registry/seo/my-skill/SKILL.md)');
  process.exit(1);
}

const fullPath = path.resolve(SKILL_PATH);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ Error: File not found at ${fullPath}`);
  process.exit(1);
}

console.log(`\n🐰 CodeRabbit-style AI Reviewer: Analyzing ${path.basename(fullPath)}...\n`);

const content = fs.readFileSync(fullPath, 'utf8');
const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

const reviewResults = {
  score: 100,
  feedback: [],
  security: [],
  quality: [],
};

// 1. Frontmatter Analysis
if (!match) {
  reviewResults.score -= 40;
  reviewResults.feedback.push('❌ CRITICAL: Missing YAML frontmatter. This skill is invalid.');
} else {
  try {
    const metadata = yaml.load(match[1]);
    
    // Check metadata completeness
    const requiredFields = ['name', 'title', 'version', 'risk', 'author'];
    requiredFields.forEach(field => {
      if (!metadata[field]) {
        reviewResults.score -= 10;
        reviewResults.quality.push(`⚠️ Missing recommended field: "${field}"`);
      }
    });

    // Check versioning
    if (metadata.version && !metadata.version.match(/^\d+\.\d+\.\d+$/)) {
      reviewResults.score -= 5;
      reviewResults.quality.push('⚠️ Version does not follow SemVer (e.g., 1.0.0).');
    }

    // Risk assessment
    if (metadata.risk === 'high') {
      reviewResults.security.push('🚨 HIGH RISK: This skill is marked as high risk. Ensure extra validation.');
    }

  } catch (e) {
    reviewResults.score -= 30;
    reviewResults.feedback.push(`❌ PARSE ERROR: Frontmatter is malformed: ${e.message}`);
  }
}

// 2. Content Analysis (Heuristics)
const body = content.replace(/^---[\s\S]*?---/, '');

// Check for required sections
const sections = ['## Overview', '## When to Use This Skill', '## Step-by-Step Guide', '## Examples'];
sections.forEach(section => {
  if (!body.includes(section)) {
    reviewResults.score -= 10;
    reviewResults.quality.push(`⚠️ Missing section: "${section}"`);
  }
});

// Check for length (too short skills are usually poor quality)
if (body.length < 200) {
  reviewResults.score -= 15;
  reviewResults.quality.push('⚠️ Content is very brief. Consider adding more detailed instructions or examples.');
}

// Check for forbidden patterns (AI "tics")
const aiTics = [/as an AI language model/i, /I cannot/i, /I don't have feelings/i];
aiTics.forEach(tic => {
  if (tic.test(body)) {
    reviewResults.score -= 10;
    reviewResults.quality.push('⚠️ Found common AI-generated filler phrases. Use more direct language.');
  }
});

// Check for security patterns (API keys, etc.)
const secretPatterns = [/api_key/i, /password/i, /secret/i, /token/i];
secretPatterns.forEach(pattern => {
  if (pattern.test(body) && !body.includes('ENVIRONMENT_VARIABLE')) {
    reviewResults.security.push('🚨 POTENTIAL SECRET: Found a suspicious string that might be a hardcoded credential.');
  }
});

// 3. Output Results
console.log('--- REVIEW SUMMARY ---');
console.log(`Score: ${reviewResults.score}/100`);
console.log('');

if (reviewResults.feedback.length > 0) {
  console.log('🛑 BLOCKERS:');
  reviewResults.feedback.forEach(f => console.log(`  ${f}`));
  console.log('');
}

if (reviewResults.security.length > 0) {
  console.log('🛡️ SECURITY:');
  reviewResults.security.forEach(s => console.log(`  ${s}`));
  console.log('');
}

if (reviewResults.quality.length > 0) {
  console.log('✨ QUALITY SUGGESTIONS:');
  reviewResults.quality.forEach(q => console.log(`  ${q}`));
  console.log('');
}

if (reviewResults.score >= 90 && reviewResults.feedback.length === 0) {
  console.log('🚀 READY: This skill looks excellent and is ready for production!');
} else if (reviewResults.score >= 70) {
  console.log('⚠️ ALMOST THERE: Address the quality suggestions to improve the skill.');
} else {
  console.log('❌ NEEDS WORK: Significant improvements are needed before this can be merged.');
}

console.log('\n--- END OF REVIEW ---');
