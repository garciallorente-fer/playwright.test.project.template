module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    "plugins": ["@typescript-eslint"],
    "rules": {
        "no-trailing-spaces": 1,
        "no-multi-spaces": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "max-len": [
            "error",
            120
        ],
        "@typescript-eslint/no-explicit-any": 0,
        // "require-jsdoc": [1, {
        //     "require": {
        //         "FunctionDeclaration": true,
        //         "MethodDefinition": false,
        //         "ClassDeclaration": false
        //     }
        // }],
        "require-await": "error",
        "brace-style": "error",
        "comma-dangle": "error",
        "no-console": "warn",
        "no-multiple-empty-lines": "error",
        "no-template-curly-in-string": "error",
        "no-var": "error",
        "prefer-promise-reject-errors": "error",
        "vars-on-top": "error",
        "eqeqeq": "error",
        "require-atomic-updates": "error",
        "no-promise-executor-return": "error",
        "no-extra-parens": "error",
        "no-unreachable-loop": "error",
        "new-cap": "error",
        "camelcase": "error"
    }
};
