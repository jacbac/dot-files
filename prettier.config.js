// Prettier Config
// Le Phare, 2018

// This config will be loaded automatically by various tools, thanks https://github.com/davidtheclark/cosmiconfig.

// To enable this config, add these dev dependencies to your package.json.
// They'll be now available in the project node_modules dir.

// $ npm install --save-dev --save-exact prettier

// ## Usage

// Prettier will apply formatting rules to styles files (css, sass, scss) or scripts files (js, ts, etc.) automatically.
// See https://prettier.io/, https://prettier.io/docs/en/options.html

// Add this to your package.json:

// {
//   "...": {},
//   "scripts": {
//     "format:script": "prettier './src/SiteBundle/Resources/**/*.js'",
//     "format:script:fix": "prettier --write './src/SiteBundle/Resources/**/*.js'",
//     "format:style": "prettier './src/SiteBundle/Resources/**/*.scss'",
//     "format:style:fix": "prettier --write './src/SiteBundle/Resources/**/*.scss'",
//   },
// }

// Do a dry-run for revealing script formatting problems (results in terminal).
// $ npm run format:script

// Fix script formatting problems (change will be applied to files). You can verify, revert or commit changes with git after.
// $ npm run format:script:fix

// Do a dry-run for revealing style formatting problems (results in terminal).
// $ npm run format:style

// Fix style formatting problems (change will be applied to files). You can verify, revert or commit changes with git after.
// $ npm run format:style:fix

// ## IDE

// Sublime Text => https://packagecontrol.io/packages/JsPrettier

// ============================================================================
// Config

module.exports = {
  "arrowParens": "always",
  "semi": true,
  "trailingComma": "es5",
};
