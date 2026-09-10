+++
id = "s0004"
title = "Internationalization and Language"
+++

# Internationalization and Language

## Supported languages

- Korean (`ko`) SHOULD be the primary delivery language for the current version of
  the guide.
- The site architecture SHOULD anticipate English (`en`), Korean (`ko`), and
  Japanese (`ja`) as supported locales.

## Localization requirements

- User-facing interface text and instructional content SHOULD be localizable
  without a structural rewrite of the site.
- Adding a locale SHOULD NOT require duplicating the site's navigation,
  interaction logic, or document structure solely to replace text.
- Interactive behavior SHOULD remain consistent across locales unless a documented
  language-specific requirement calls for a difference.
- The project MAY defer complete English and Japanese translations, but new site
  structure SHOULD NOT prevent their later addition.
