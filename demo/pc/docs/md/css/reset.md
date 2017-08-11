#css reset重定义浏览器默认样式
---------------------------

```css
html {
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  text-rendering: optimizelegibility;
}
body {
  font-family: 'Tahoma', Helvetica, 'Microsoft YaHei', Arial, sans-serif;
  font-size: 12px;
  line-height: 1.42857143;
  background-color: #f0f0f0;
  min-width: 1200px;
}
body,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
textarea,
p,
blockquote,
th,
td,
hr,
button,
article,
aside,
details,
figcaption,
figure,
footer,
header,
menu,
nav,
section {
  margin: 0;
  padding: 0;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
nav,
section,
summary {
  display: block;
}
audio,
canvas,
progress,
video {
  display: inline-block;
  vertical-align: baseline;
}
button,
input,
select,
textarea {
  font: 300 1em 'Tahoma', Helvetica, 'Microsoft YaHei', Arial, sans-serif;
}
button::-moz-focus-inner,
input::-moz-focus-inner {
  padding: 0;
  border: 0;
}
input::-webkit-input-placeholder {
  color: #bbb;
}
input:-moz-placeholder {
  color: #bbb;
}
input:focus {
  outline: none;
}
[hidden],
.hidden {
  display: none;
}
a {
  background: transparent;
  text-decoration: none;
}
a:active,
a:hover {
  outline: 0;
}
.b,
strong {
  font-weight: bold;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 10px;
  line-height: 1.1;
}
h1,
.h1 {
  font-size: 22px;
}
h2,
.h2 {
  font-size: 16px;
}
h3,
.h3 {
  font-size: 16px;
}
h4,
.h4 {
  font-size: 14px;
}
h5,
.h5 {
  font-size: 14px;
}
h6,
.h6 {
  font-size: 12px;
}
img {
  border: 0;
  vertical-align: middle;
}
/* 去掉各Table cell 的边距并让其边重合 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}
/* 去除默认边框 */
fieldset,
img {
  border: 0;
}
/* 块/段落引用 */
blockquote {
  position: relative;
  color: #999;
  font-weight: 400;
  border-left: 1px solid #1abc9c;
  padding-left: 1em;
  margin: 1em 3em 1em 2em;
}
@media only screen and (max-width: 640px) {
  blockquote {
    margin: 1em 0;
  }
}
/* Firefox 以外，元素没有下划线，需添加 */
acronym,
abbr {
  border-bottom: 1px dotted;
  font-variant: normal;
}
/* 添加鼠标问号，进一步确保应用的语义是正确的（要知道，交互他们也有洁癖，如果你不去掉，那得多花点口舌） */
abbr {
  cursor: help;
}
del {
  text-decoration: line-through;
}
p {
  margin-bottom: 10px;
}
small {
  font-size: 80%;
}
sub,
sup {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}
:root sub,
:root sup {
  vertical-align: baseline;
  /* for ie9 and other modern browsers */
}
sup {
  top: -0.5em;
}
sub {
  bottom: -0.25em;
}
address,
caption,
cite,
code,
dfn,
em,
th,
var {
  font-style: normal;
  font-weight: 400;
}
/* 去掉列表前的标识, li 会继承，大部分网站通常用列表来很多内容，所以应该当去 */
ul,
ol {
  list-style: none;
}
/* 对齐是排版最重要的因素, 别让什么都居中 */
caption,
th {
  text-align: left;
}
.typo a {
  border-bottom: 1px solid #1abc9c;
}
.typo a:hover {
  border-bottom-color: #555;
  color: #555;
  text-decoration: none;
}
/* 强制文本换行 */
.textwrap,
.textwrap td,
.textwrap th {
  word-wrap: break-word;
  word-fieldset: break-all;
}
/* 标记，类似于手写的荧光笔的作用 */
mark {
  background: #fffdd1;
  border-bottom: 1px solid #ffedce;
  padding: 2px;
  margin: 0 5pxfieldset;
}
/* 代码片断 */
pre,
code,
pre tt {
  font-family: Courier, 'Courier New', monospace;
}
pre {
  background: #f8f8f8;
  border: 1px solid #ddd;
  padding: 1em 1.5em;
  display: block;
  -webkit-overflow-scrolling: touch;
}
```

