// Maintain in repo: cs-template
// Reports named anchors that nothing links to, and #fragment links whose target
// heading or anchor does not exist. Only files under ai/ and .ai-instructions are
// reported on; every tracked Markdown file is scanned for headings, anchors and links.

const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const FENCE = /^[ \t\r\n\v\f]*(```|~~~)/;
const HEADING = /^#+[ \t\r\n\v\f]/;
const HEADING_MARKER = /^#+[ \t\r\n\v\f]+/;
const INLINE_CODE = /`[^`]*`/g;
const EXPLICIT_ANCHOR = /<a id="([^"]*)"/g;
const INLINE_LINK = /\]\(([^) ]*#[^) ]+)\)/g;
const REFERENCE_DEFINITION = /^ {0,3}\[[^\]]+\]:[ \t]*<?([^ \t<>]*#[^ \t<>]+)>?/;
const URL_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

function slug(heading) {
    return heading
        .toLowerCase()
        .replace(/<[^>]*>/g, '')
        .replace(/[^a-z0-9_ -]/g, '')
        .replace(/ /g, '-');
}

function isChecked(file) {
    return file.startsWith('ai/') || file === '.ai-instructions';
}

function normalise(relativePath) {
    const stack = [];

    for (const part of relativePath.split('/')) {
        if (part === '' || part === '.') {
            continue;
        }

        if (part === '..') {
            stack.pop();
            continue;
        }

        stack.push(part);
    }

    return stack.join('/');
}

function directoryOf(file) {
    return file.slice(0, file.lastIndexOf('/') + 1);
}

function resolveTarget(file, target) {
    return target === '' ? file : normalise(directoryOf(file) + target);
}

function anchorKey(file, id) {
    return `${file}\0${id}`;
}

function linkTargetsOnLine(line) {
    const links = [...line.matchAll(INLINE_LINK)].map((match) => match[1]);
    const definition = line.match(REFERENCE_DEFINITION);

    return definition ? [...links, definition[1]] : links;
}

function scanFile(file, content, state) {
    if (content === '') {
        return;
    }

    state.knownFiles.add(file);
    const seenSlugs = new Map();
    let inFence = false;

    content.split('\n').forEach((text, index) => {
        const lineNumber = index + 1;

        if (FENCE.test(text)) {
            inFence = !inFence;
            return;
        }

        if (inFence) {
            return;
        }

        if (HEADING.test(text)) {
            const headingSlug = slug(text.replace(HEADING_MARKER, ''));
            const suffix = seenSlugs.get(headingSlug);
            seenSlugs.set(headingSlug, (suffix ?? 0) + 1);
            state.anchors.add(anchorKey(file, suffix === undefined ? headingSlug : `${headingSlug}-${suffix}`));
        }

        const line = text.replace(INLINE_CODE, '');

        for (const match of line.matchAll(EXPLICIT_ANCHOR)) {
            const key = anchorKey(file, match[1]);
            state.anchors.add(key);
            state.explicitAnchors.set(key, { file, id: match[1], line: lineNumber });
        }

        for (const link of linkTargetsOnLine(line)) {
            const hash = link.indexOf('#');
            const target = link.slice(0, hash);

            if (URL_SCHEME.test(target)) {
                continue;
            }

            state.references.push({
                file,
                line: lineNumber,
                target: resolveTarget(file, target),
                fragment: link.slice(hash + 1),
            });
        }
    });
}

function danglingLinkProblems(state) {
    return state.references
        .filter((reference) => isChecked(reference.file))
        .filter((reference) => !state.anchors.has(anchorKey(reference.target, reference.fragment)))
        .map((reference) => {
            const reason = state.knownFiles.has(reference.target) ? 'no heading or anchor with that name' : 'target file not found';

            return {
                file: reference.file,
                line: reference.line,
                message: `Dangling link to ${reference.target}#${reference.fragment} (${reason})`,
            };
        });
}

function orphanedAnchorProblems(state) {
    const referenced = new Set(state.references.map((reference) => anchorKey(reference.target, reference.fragment)));

    return [...state.explicitAnchors]
        .filter(([key, anchor]) => isChecked(anchor.file) && !referenced.has(key))
        .map(([, anchor]) => ({
            file: anchor.file,
            line: anchor.line,
            message: `Orphaned anchor #${anchor.id} has no incoming links`,
        }));
}

function trackedMarkdownFiles(root) {
    return execFileSync('git', ['ls-files', '-z', '--', '*.md', '.ai-instructions'], { cwd: root, encoding: 'utf8' })
        .split('\0')
        .filter(Boolean);
}

function findProblems(root, files) {
    const state = {
        knownFiles: new Set(),
        anchors: new Set(),
        explicitAnchors: new Map(),
        references: [],
    };

    for (const file of files) {
        scanFile(file, readFileSync(path.join(root, file), 'utf8'), state);
    }

    return [...danglingLinkProblems(state), ...orphanedAnchorProblems(state)];
}

module.exports = async ({ core }) => {
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
    const files = trackedMarkdownFiles(root);

    if (files.length === 0) {
        core.info('ℹ️ No Markdown files to check.');
        return;
    }

    const problems = findProblems(root, files);

    if (problems.length > 0) {
        for (const problem of problems) {
            core.error(problem.message, { file: problem.file, startLine: problem.line });
        }

        core.setFailed('❌ Found orphaned anchors or dangling fragment links.');
        return;
    }

    core.info('✅ All anchors are linked and all fragment links resolve.');
};

if (require.main === module) {
    const consoleCore = {
        info: (message) => console.log(message),
        error: (message, properties) => console.error(`${properties.file}:${properties.startLine}: ${message}`),
        setFailed: (message) => {
            console.error(message);
            process.exitCode = 1;
        },
    };

    module.exports({ core: consoleCore });
}
