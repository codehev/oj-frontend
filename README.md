# oj-frontend

## 命令
```bash

npm install openapi-typescript-codegen --save-dev
openapi --input http://localhost:8181/api/v2/api-docs --output ./generated --client axios

npm install --save-dev @arco-design/web-vue

npm install moment --save

npm install monaco-editor-webpack-plugin
npm install monaco-editor

npm i @bytemd/plugin-gfm @bytemd/plugin-highlight
npm i @bytemd/vue-next

#icon-Park是字节跳动的图标库
npm install @icon-park/vue-next –save
```

## icon-Park图标库

icon-Park是字节跳动的图标库：[icon-park官网：https://iconpark.oceanengine.com/official](https://iconpark.oceanengine.com/official)

**以vue3为例：**
环境搭建：

1. 终端导入：`npm install @icon-park/vue-next –save`
2. main.ts 导入icon-park的css：
   `import '@icon-park/vue-next/styles/index.css';`

**图标使用：**

```ts
<aiming theme="outline" size="24" fill="#333"/>
import { aiming } from '@icon-park/vue-next';
12
```

上面的例子是标签式的图标，也可以通过字符串定义图标：

```bash
 import { IconPark } from '@icon-park/vue-next/es/all';
<IconPark :type="item.style.icon" theme="filled" />
```

