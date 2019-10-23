module.exports = {
  env: {
    browser: true,
    es6: true
  },

  extends: [
    "standard",
    "plugin:react/recommended"
  ],

  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },

  parser: "babel-eslint",

  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },

  plugins: [
    "react"
  ],

  rules: {
    "quotes": [2, "double"],
    "max-len": ["error", { "code": 80 }],
    "object-curly-spacing": [2, "never"],
    "semi": [2, "always", { "omitLastInOneLineBlock": true}]
  }
}
