// StyleLint Config
// Le Phare, 2018

// To enable this config, add these dev dependencies to your package.json.
// They'll be now available in the project node_modules dir.

// $ npm install --save-dev stylelint stylelint-config-recommended

// Usage

// StyleLint will lint styles files (css, sass, scss, etc.) and helps you avoid errors and enforce conventions in your projects.
// See https://stylelint.io/

// Add this to your package.json:

// {
//   "...": {},
//   "scripts": {
//     "lint:style": "prettier './src/SiteBundle/Resources/**/*.scss'",
//     "lint:style:fix": "prettier --write './src/SiteBundle/Resources/**/*.scss'",
//   },
// }

// Do a dry-run for revealing style problems (results in terminal).
// $ npm run lint:style

// Fix style problems (change will be applied to files).
// You can verify, revert or commit changes with git after.
// $ npm run lint:style:fix

// This config will be loaded automatically by various tools, thanks https://github.com/davidtheclark/cosmiconfig.
// Can be used with webpack stylint plugin (https://github.com/webpack-contrib/stylelint-webpack-plugin).

// ============================================================================
// Config

module.exports = {
  "extends": "stylelint-config-recommended",
  "rules": {
    "at-rule-empty-line-before": null
  }
};
