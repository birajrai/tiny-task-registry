---
name: wordpress-forensic-audit
title: "WordPress Forensic UI & SEO Audit"
description: "Performs a strict side-by-side audit of WordPress templates against React/HTML sources to ensure pixel-perfection."
version: "1.0.0"
category: "seo"
risk: "safe"
author: "WHOISABHISHEKADHIKARI"
date_added: "2026-04-12"
tags: ["wordpress", "ui-audit", "seo", "pixel-perfect"]
---

# WordPress Forensic UI & SEO Audit 🔍

## Overview
This skill performs a forensic-level audit of WordPress templates by comparing them against original React/HTML source files. It ensures 100% pixel-perfection and SEO structure parity between the design source and the WordPress implementation.

## When to Use This Skill
- Use during the final phase of a WordPress theme development to ensure pixel-perfection.
- Use when migrating a static HTML/React design to WordPress to verify SEO integrity.

## Core Concepts

### Forensic Comparison Table
Every audit must generate a structured comparison table to track discrepancies:
| ID | Component | React/Source Output | WP Template Output | Discrepancy | Severity |
|----|-----------|----------------------|--------------------|-------------|----------|

### Non-Negotiable Rules
- NO changes to layout, spacing, or colors.
- Preserve EXACT Tailwind/CSS classes.
- SEO structure must remain 100% identical (Headings, Schema, Meta).

## Step-by-Step Guide

### 1. Component Scan
Analyze the React/Source component and the corresponding WordPress template file side-by-side.

### 2. Discrepancy Mapping
Identify any deviations in HTML structure, CSS classes, or metadata and record them in the forensic table.

### 3. Action Classification
Mark every required fix with a safety classification:
- **SAFE**: No UI risk.
- **RISKY**: Potential for layout shift.
- **BLOCKED**: Requires clarification before touching code.

## Best Practices
- ✅ **Do:** Maintain 100% identical heading hierarchies (H1-H6).
- ✅ **Do:** Verify that all dynamic WP content matches the source design's sample data.
- ❌ **Don't:** "Eyeball" spacing—use inspector tools to verify exact pixel values.
