module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "rules": {
      "semi": ["warn", "always"],
      "quotes": ["warn", "single"],
      "arrow-spacing": ["warn", { "before": true, "after": true }],
      "no-whitespace-before-property": ["warn"],
      "no-await-in-loop": ["error"]
    }
};