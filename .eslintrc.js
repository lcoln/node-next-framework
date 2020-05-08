module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    Sec: 'readonly',
    Controller: 'readonly',
    APP: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  parser: "babel-eslint",
  ignorePatterns: ["config", "dist", "cdnConfig", "webpack", "node_modules/"],
  rules: {
    "linebreak-style": [0 ,"error", "windows"],
    "global-require": 0,
    "import/no-named-as-default": 0,
    "import/no-named-as-default-membe": 0,
    "import/no-dynamic-require": 0,
    "import/no-unresolved": 0,              // 允许import不在node_modules里的模块
    "react/jsx-props-no-spreading": 0,      // 允许this.props
    "react/destructuring-assignment": 0,    // 允许this.state
    "no-console":"off",                      // 允许打印
    "no-param-reassign": 0,                 // 允许修改传入的参数
    "import/extensions": 0,
    "react/prop-types": 0,  // 允许使用children
    "no-nested-ternary": 0,                  // 三元判断
    "no-restricted-syntax": 0,              // 允许使用for in, for of
    "func-names": 0,                         // 允许不给function name
    "no-return-assign":0,                    // 允许在返回语句中赋值
    "no-plusplus": 0,                        // 允许使用++
    "no-prototype-builtins": 0,               // 允许Object.prototype上的属性
    "strict": 0,                              // 允许strict
    "lines-around-directive": 0,
    "jsx-a11y/click-events-have-key-events": 0, // 允许点击事件不需绑定键盘事件
    "jsx-a11y/no-static-element-interactions": 0,    // 允许
    "prefer-destructuring": 0,                  // 允许不优先使用数组和对象解构
    "jsx-a11y/anchor-has-content": 0,            // 允许在闭合标签不写内容
    "jsx-a11y/control-has-associated-label": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "no-script-url": 0,
    "react/self-closing-comp": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "import/prefer-default-export": 0,           // 允许没有默认导出
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],     // 末尾允许并强制空1行
    // "object-curly-newline": ["error", "always"],
    // "react/jsx-indent": 2,
    "no-underscore-dangle": 0,
    "class-methods-use-this": 0,     // class不需要强制this
    "guard-for-in":"off",
    "react/react-in-jsx-scope": "off", // 关闭检查React是否存在，Next.js不需要引用React
   },
};
