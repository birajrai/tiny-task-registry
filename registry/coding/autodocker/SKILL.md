---
name: autodocker
title: 'AutoDocker'
description: 'Expert skill for converting various project types (Laravel, Next.js, WordPress, Node.js, Golang, Python, Java, Ruby, etc.) into Docker-compatible setups, enabling easy deployment.'
version: '1.0.0'
category: 'coding'
risk: 'safe'
author: 'birajrai'
date_added: '2026-04-13'
tags:
  [
    'docker',
    'deployment',
    'laravel',
    'nextjs',
    'wordpress',
    'nodejs',
    'golang',
    'python',
    'django',
    'java',
    'spring-boot',
    'ruby',
    'rails',
    'containerization',
  ]
---

# AutoDocker 🐳📦

## Overview

This skill is designed to assist in containerizing various types of web projects, making them easily deployable using Docker. It provides guidance and generic Dockerfile examples for common frameworks and languages, ensuring projects can be packaged into consistent, isolated environments.

## When to Use This Skill

- When you need to containerize a new or existing web project for consistent deployment.
- When you want to simplify the deployment process across different environments (development, staging, production).
- When you need to ensure dependency consistency and isolation for your application.
- When working with microservices architectures.

## Core Capabilities

### Project Type Identification

The skill helps identify the core technologies and frameworks used in a project to recommend appropriate Dockerization strategies.

### Dockerfile Generation Guidance

Provides best practices and template Dockerfiles tailored for specific project types, including:

- Laravel (PHP-FPM, Nginx/Apache)
- Next.js (Node.js)
- WordPress (PHP-FPM, Nginx/Apache, MySQL)
- Node.js Backend (Express, Koa, etc.)
- Golang Applications
- Python (Django, FastAPI)
- Java (Spring Boot)
- Ruby on Rails

### Deployment Simplification

Aims to streamline the process of getting applications ready for deployment platforms that support Docker (e.g., Kubernetes, Docker Swarm, AWS ECS, Google Cloud Run).

## Step-by-Step Guide

### 1. Identify Project Type, Dependencies, and Versions

Determine the primary language, framework, and any external services (databases, caches) your project relies on.

- **CRITICAL RULE**: You MUST actively search the project for version definitions (e.g., `package.json` engines field, `go.mod`, `.ruby-version`, `composer.json` require field, `.python-version`) to determine the exact version the project is currently running on.

### 2. Choose a Version-Matched Base Image

Select an appropriate base image from Docker Hub that exactly matches the version found in step 1.

- Example: If `package.json` specifies Node.js `v18.16.0`, use `FROM node:18.16.0-alpine`, not `node:lts` or `node:20`.
- Example: If a `pom.xml` or `build.gradle` specifies Java 8, use `FROM eclipse-temurin:8-jdk-alpine`, absolutely do not upgrade them to Java 17 or Java 21 unless explicitly requested.
- **Framework Compatibility Rule**: If the exact language version isn't explicitly defined, you MUST infer the strictest compatible runtime based on the framework version. Examples:
  - **Laravel** (check `composer.json`):
    - Laravel 12.x or 13.x -> MUST use PHP 8.3
    - Laravel 11.x -> MUST use PHP 8.2
    - Laravel 10.x -> MUST use PHP 8.1
  - **Next.js** (check `package.json`):
    - Next.js 14.x or 15.x -> MUST use Node.js 18.17+ or 20.x
    - Next.js 13.x -> MUST use Node.js 16.14+ or 18.x
  - **Django** (check `requirements.txt` or `Pipfile`):
    - Django 5.x -> MUST use Python 3.10, 3.11, or 3.12
    - Django 4.2 -> MUST use Python 3.8, 3.9, 3.10, 3.11, or 3.12
  - **Spring Boot** (check `pom.xml` or `build.gradle`):
    - Spring Boot 3.x -> MUST use Java 17 or Java 21
    - Spring Boot 2.7.x -> MUST use Java 8, Java 11, or Java 17
  - **Ruby on Rails** (check `Gemfile`):
    - Rails 7.1.x or 7.2.x -> MUST use Ruby 3.1+
    - Rails 7.0.x -> MUST use Ruby 2.7+
  - **Always map older framework versions to their officially supported runtimes.**

### 3. Choose the Right Web Server (Nginx vs. Apache)

When containerizing PHP applications (Laravel, WordPress) or serving static files, you must choose the appropriate web server based on the project's performance requirements:

- **Nginx (Lightweight & High Performance)**: Default choice for high-concurrency, microservices, APIs, and serving static assets. Use with `php:fpm` variants (often requires a multi-container setup via Docker Compose or a specialized base image).
- **Apache (Feature-Rich & Compatible)**: Use when the project heavily relies on complex `.htaccess` rules, specific Apache modules, or when simplicity (single container `php:apache`) is prioritized over raw performance.

### 4. Create a `.dockerignore` File

Before copying the application code, you MUST generate a `.dockerignore` file. This prevents sensitive files (like `.env`), massive directories (like `node_modules` or `vendor`), and Git history from bloating the image or causing security leaks.

### 5. Copy Application Code

Add your application's source code into the Docker image (respecting the `.dockerignore`).

### 6. Install Dependencies

Install language-specific dependencies (e.g., `composer install`, `npm install`, `go mod download`).

### 7. Configure Environment

Set up environment variables and any necessary configurations for the application within the container.

### 8. Expose Ports

Declare the port(s) your application listens on.

### 9. Define Startup Command

Specify the command to run your application when the container starts.

## Examples

### The Universal `.dockerignore`

Always include a comprehensive `.dockerignore` file alongside the Dockerfile to prevent bloated images and accidental secret leaks.

**.dockerignore**

```gitignore
# Version control
.git
.gitignore

# Environment variables and secrets
.env
.env.*
*.pem
*.key
credentials.json
secrets.yml

# IDEs and Editors
.idea/
.vscode/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Node.js
node_modules/
npm-debug.log
yarn-error.log

# Python
__pycache__/
*.py[cod]
*$py.class
.pytest_cache/
venv/
env/
.venv/

# PHP / Composer
vendor/
phpunit.xml

# Go
bin/
obj/

# Build outputs (Next.js, React, etc.)
.next/
out/
build/
dist/

# Docker related
docker-compose.yml
.dockerignore
Dockerfile*
```

### Example 1: Laravel Project (Using Official PHP Apache - Best for Compatibility)

**Dockerfile**

```dockerfile
# Use official PHP Apache image for Laravel
FROM php:8.2-apache


# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# Update Apache DocumentRoot to point to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --no-scripts --no-autoloader

# Copy application files
COPY . .

# Generate optimized autoload files
RUN composer dump-autoload --optimize

# Set proper permissions for Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Change to a non-root user (optional, but highly recommended)
# Note: In Apache images, running as non-root requires further port configuration (e.g., binding to 8080)
# USER www-data

EXPOSE 80

CMD ["apache2-foreground"]
```

### Example 2: Laravel Project (PHP-FPM + Nginx - Best for High Performance/Lightweight)

_Note: This is intended for use in a multi-container `docker-compose.yml` environment, where one container runs PHP-FPM and another runs Nginx. The Dockerfile below defines the `app` service._

**Dockerfile (for PHP-FPM service)**

```dockerfile
# Use the lightweight alpine version of PHP-FPM
FROM php:8.2-fpm-alpine

# Install essential dependencies
RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    oniguruma-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --no-scripts --no-autoloader

# Copy application files
COPY . .

# Generate optimized autoload files
RUN composer dump-autoload --optimize

# Change ownership to the standard web user in Alpine
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
```

### Example 3: Next.js Project

**Dockerfile**

```dockerfile
# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else npm install; \
  fi

# Rebuild the source code by copying new files
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
```

### Example 4: Node.js Backend (Express)

**Dockerfile**

```dockerfile
FROM node:20-alpine

# Use the non-root user provided by the node image
USER node

# Create app directory with proper permissions
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", "server.js" ]
```

### Example 5: Golang Application

**Dockerfile**

```dockerfile
# Build stage
FROM golang:1.22-alpine AS builder

# Create an unprivileged user
ENV USER=appuser
ENV UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

# Build the binary statically
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .

# Run stage (using scratch for maximum security and minimal size)
FROM scratch

# Import the user and group files from the builder
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

COPY --from=builder /app/main /main

# Use an unprivileged user
USER appuser:appuser

EXPOSE 8080

CMD ["/main"]
```

### Example 6: Python (Django/FastAPI)

**Dockerfile**

```dockerfile
FROM python:3.11-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000

# For Django (Gunicorn):
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]

# For FastAPI (Uvicorn/uvicorn-worker):
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Example 7: Java (Spring Boot)

**Dockerfile**

```dockerfile
# Build stage
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Run stage
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

EXPOSE 8080

ENTRYPOINT ["java","-cp","app:app/lib/*","com.example.Application"]
```

### Example 8: Ruby on Rails

**Dockerfile**

```dockerfile
FROM ruby:3.2.2-slim-bookworm

# Install system dependencies
RUN apt-get update -qq && apt-get install -y \
    build-essential \
    libpq-dev \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /myapp

# Install Ruby gems
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle install

# Copy application code
COPY . /myapp

# Precompile assets (if applicable)
# RUN RAILS_ENV=production bundle exec rake assets:precompile

EXPOSE 3000

# Start the main process
CMD ["rails", "server", "-b", "0.0.0.0"]
```

## Best Practices

- ✅ **Do:** Use multi-stage builds to create smaller, more secure images.
- ✅ **Do:** Use `.dockerignore` to exclude unnecessary files from the build context.
- ✅ **Do:** Pin base image versions to exactly match the project's current runtime (e.g., if a project relies on `node:18.16.0`, use exactly that image).
- ❌ **Don't:** Use `latest` or generic version tags (like `node:20` when the project is on `18`) without confirming the project supports it.
- ❌ **Don't:** Include sensitive information (API keys, passwords) directly in your Dockerfile. Use environment variables.
- ❌ **Don't:** Run containers as root in production environments. Use non-root users.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Awesome Docker](https://github.com/veggiemonk/awesome-docker)
