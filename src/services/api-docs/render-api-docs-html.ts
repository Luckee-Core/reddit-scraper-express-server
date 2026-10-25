import type {
  ApiDocsCatalog,
  ApiDocsEndpoint,
  ApiDocsGroup,
} from './types';

/**
 * Escapes text for safe HTML embedding.
 */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Builds a URL-safe anchor id from a group name.
 */
const groupAnchorId = (name: string): string =>
  `group-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

/**
 * Renders description prose as HTML paragraphs.
 */
const renderDescriptionParagraphs = (description: string): string =>
  description
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');

/**
 * Renders a JSON example block.
 */
const renderExample = (label: string, example: unknown): string => {
  const text =
    typeof example === 'string' ? example : JSON.stringify(example, null, 2);
  return `<div class="example"><h4>${escapeHtml(label)}</h4><pre><code>${escapeHtml(text)}</code></pre></div>`;
};

/**
 * Renders one API endpoint card.
 */
const renderEndpoint = (endpoint: ApiDocsEndpoint): string => {
  const methodClass = `method method-${endpoint.method.toLowerCase()}`;
  const parts = [
    `<article class="endpoint">`,
    `<div class="endpoint-header">`,
    `<span class="${methodClass}">${escapeHtml(endpoint.method)}</span>`,
    `<code class="path">${escapeHtml(endpoint.path)}</code>`,
    `</div>`,
    `<h3>${escapeHtml(endpoint.summary)}</h3>`,
  ];

  if (endpoint.description) {
    parts.push(`<p>${escapeHtml(endpoint.description)}</p>`);
  }

  if (endpoint.requestBody) {
    parts.push(
      `<p><strong>Request body</strong> (${escapeHtml(endpoint.requestBody.contentType)})</p>`,
    );
    parts.push(renderExample('Example', endpoint.requestBody.example));
  }

  if (endpoint.responses.length > 0) {
    parts.push('<h4>Responses</h4>');
    for (const response of endpoint.responses) {
      parts.push(
        `<p><strong>${response.status}</strong> — ${escapeHtml(response.description)}</p>`,
      );
      parts.push(
        renderExample(`Example (${response.status})`, response.example),
      );
    }
  }

  parts.push('</article>');
  return parts.join('');
};

/**
 * Renders one catalog group section.
 */
const renderGroup = (group: ApiDocsGroup, isOverview: boolean): string => {
  const anchorId = groupAnchorId(group.name);
  const parts = [`<section id="${anchorId}" class="group">`];

  if (isOverview) {
    parts.push(`<h1>${escapeHtml(group.name)}</h1>`);
  } else {
    parts.push(`<h2>${escapeHtml(group.name)}</h2>`);
  }

  if (group.description) {
    parts.push(renderDescriptionParagraphs(group.description));
  }

  for (const endpoint of group.endpoints) {
    parts.push(renderEndpoint(endpoint));
  }

  parts.push('</section>');
  return parts.join('');
};

/**
 * Renders the full API docs catalog as self-contained HTML.
 */
export const renderApiDocsHtml = (catalog: ApiDocsCatalog): string => {
  const overviewGroup = catalog.groups.find((group) => group.name === 'Overview');
  const otherGroups = catalog.groups.filter((group) => group.name !== 'Overview');

  const sidebarLinks = catalog.groups
    .map(
      (group) =>
        `<li><a href="#${groupAnchorId(group.name)}">${escapeHtml(group.name)}</a></li>`,
    )
    .join('');

  const metaBlock = [
    `<p class="meta"><strong>Version:</strong> ${escapeHtml(catalog.version)}</p>`,
    `<p class="meta"><strong>Base URL:</strong> <code>${escapeHtml(catalog.baseUrl)}</code></p>`,
    `<p class="meta"><strong>Response envelope:</strong> <code>${escapeHtml(catalog.responseEnvelope)}</code></p>`,
  ].join('');

  const mainContent = [
    overviewGroup ? renderGroup(overviewGroup, true) : '',
    metaBlock,
    ...otherGroups.map((group) => renderGroup(group, false)),
  ].join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Reference — Reddit Scraper Express Server</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      color: #1a1a1a;
      background: #f8f9fa;
    }
    .layout {
      display: grid;
      grid-template-columns: 220px 1fr;
      min-height: 100vh;
    }
    nav {
      background: #fff;
      border-right: 1px solid #e2e8f0;
      padding: 1.5rem 1rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }
    nav h2 {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin: 0 0 0.75rem;
    }
    nav ul { list-style: none; padding: 0; margin: 0; }
    nav a {
      display: block;
      padding: 0.35rem 0;
      color: #334155;
      text-decoration: none;
      font-size: 0.9rem;
    }
    nav a:hover { color: #0f172a; text-decoration: underline; }
    main {
      padding: 2rem 2.5rem;
      max-width: 900px;
    }
    h1 { margin-top: 0; font-size: 1.75rem; }
    h2 { margin-top: 2.5rem; font-size: 1.35rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
    h3 { margin: 0 0 0.5rem; font-size: 1rem; }
    h4 { margin: 0.75rem 0 0.25rem; font-size: 0.85rem; color: #475569; }
    .meta { margin: 0.25rem 0; font-size: 0.9rem; color: #475569; }
    .group p { color: #334155; }
    .endpoint {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin: 1rem 0;
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .method {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .method-get { background: #dbeafe; color: #1d4ed8; }
    .method-post { background: #dcfce7; color: #15803d; }
    .method-patch { background: #fef3c7; color: #b45309; }
    .method-delete { background: #fee2e2; color: #b91c1c; }
    .path { font-size: 0.9rem; }
    pre {
      background: #f1f5f9;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      overflow-x: auto;
      font-size: 0.8rem;
      margin: 0.5rem 0 0;
    }
    code { font-family: ui-monospace, monospace; }
    @media (max-width: 768px) {
      .layout { grid-template-columns: 1fr; }
      nav { position: static; height: auto; border-right: none; border-bottom: 1px solid #e2e8f0; }
      main { padding: 1.25rem; }
    }
  </style>
</head>
<body>
  <div class="layout">
    <nav>
      <h2>API</h2>
      <ul>${sidebarLinks}</ul>
    </nav>
    <main>${mainContent}</main>
  </div>
</body>
</html>`;
};
