# Miyazaki Hayao Film System Front-End
 User & Admin

User/
直接运行即可，但不可通过路径运行（无法设置cookies），VScode/WebStorm欢迎你。

admin/

```
# vue.config.js
module.exports={
  publicPath: '/' # dev
}

# dev
npm install
npm run dev

# vue.config.js
module.exports={
  publicPath: './' # build
}

# build
npm run build:prod
```


