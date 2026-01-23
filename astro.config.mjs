import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    starlight({
      title: 'Raiken',
      description: 'AI-powered test generation for Playwright',
      disable404Route: true,
      social: {
        github: 'https://github.com/raiken-dev/raiken',
      },
      customCss: [
        './src/styles/starlight.css',
      ],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
          },
        },
      ],
      components: {
        // Override header to add marketing site navigation
        SiteTitle: './src/components/SiteTitle.astro',
      },
      expressiveCode: {
        themes: ['github-dark'],
        styleOverrides: {
          codeBackground: 'var(--sl-color-gray-6)',
          borderColor: 'var(--sl-color-hairline)',
          borderRadius: '0.5rem',
          frames: {
            frameBoxShadowCssValue: 'none',
            terminalTitlebarBackground: 'var(--sl-color-gray-5)',
            terminalTitlebarBorderBottomColor: 'transparent',
            editorTabBarBackground: 'var(--sl-color-gray-5)',
            editorTabBarBorderBottomColor: 'transparent',
          }
        }
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Quick Start', slug: 'getting-started' },
            { label: 'Core Concepts', slug: 'core-concepts' },
          ],
        },
        {
          label: 'Architecture',
          items: [
            { label: 'Overview', slug: 'architecture' },
            { label: 'Orchestrator', slug: 'orchestrator' },
            { label: 'Code Graph', slug: 'code-graph' },
            { label: 'DOM Capture', slug: 'dom-capture' },
            { label: 'Test Generation', slug: 'test-generation' },
          ],
        },
        {
          label: 'Usage',
          items: [
            { label: 'CLI Reference', slug: 'cli' },
            { label: 'Configuration', slug: 'configuration' },
            { label: 'Dashboard', slug: 'dashboard' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { label: 'Examples', slug: 'examples' },
            { label: 'Troubleshooting', slug: 'troubleshooting' },
            { label: 'FAQ', slug: 'faq' },
          ],
        },
        {
          label: 'Roadmap',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'roadmap' },
            { label: 'AI-Driven DOM Capture', slug: 'roadmap/ai-driven-dom-capture' },
            { label: 'Business Context', slug: 'roadmap/business-context-integration' },
            { label: 'Collaborative Test Graph', slug: 'roadmap/collaborative-test-graph' },
          ],
        },
      ],
    }),
  ],
});
