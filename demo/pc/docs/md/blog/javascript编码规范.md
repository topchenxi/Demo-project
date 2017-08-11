#Javascript 编码风格
----------------------------------------------


##编码
统一用 utf-8   

##长度
长度不超过 80 个字符。别小看这一条规则，如果严格去遵循，你会发现代码变清晰了。而且，你一定能做到的。

##缩进
缩进使用 2个 或 4个 空格，组件内保持统一，不混用。禁用 tab。

sublime设置tab为2个空格：

```json
"tab_size": 2,
"translate_tabs_to_spaces": true
```

##花括号
###花括号不换行
好
```js
if (foo) {
}
```

坏
```js
if (foo)
{
}
```

不允许一行判断，一律换行
坏
```js
if (foo) return;
```

##命名约定

1. 常量 UPPERCASE_WORD （大写）
2. 变量 camelName （骆驼峰）
3. 函数 camelName （骆驼峰）
4. 类名 CamelName （大骆驼峰）


##空格

操作符之间需要空格

好
```js
var x = y + z
```
坏
```js
var x=y+z
```
只空一格

好
```js
{
    a: 'short',
    looooongname: 'long'
}
```
坏
```js
{
    a           : 'short',
    looooongname: 'long'
}
```

##逗号与换行

```js
//good
{
   a: 'a',
   b: 'b',
   c: 'c'
}
//bad
{
   a: 'a'
  ,b: 'b'
  ,c: 'c'
}
```

##注释规范
原则
1. As short as possible（如无必要，勿增注释）。尽量提高代码本身的清晰性、可读性。
2. As long as necessary（如有必要，尽量详尽）。合理的注释、空行排版等，可以让代码更易阅读、更具美感。
3. 每个文件头请填写作者。以方便后期维护
```js
/**
 * 文件说明
 * @author 周王献
 * @date 2016-01-10
 * @version 1.0
 **/
```




##变量声明

变量、函数在使用前必须先定义。

示例：
```javascript
// good
var name = 'MyName';

// bad
name = 'MyName';
```

每个 `var` 只能声明一个变量。

##条件
使用类型严格的 `===`。仅当判断 `null` 或 `undefined` 时，允许使用 `== null`。

示例：

```javascript
// good
if (age === 30) {
    // ......
}

// bad
if (age == 30) {
    // ......
}
```

尽可能使用简洁的表达式。

示例：
```javascript
// 字符串为空

// good
if (!name) {
    // ......
}

// bad
if (name === '') {
    // ......
}
```

```javascript
// 字符串非空

// good
if (name) {
    // ......
}

// bad
if (name !== '') {
    // ......
}
```

```javascript
// 数组非空

// good
if (collection.length) {
    // ......
}

// bad
if (collection.length > 0) {
    // ......
}
```

```javascript
// 布尔不成立

// good
if (!notTrue) {
    // ......
}

// bad
if (notTrue === false) {
    // ......
}
```

```javascript
// null 或 undefined

// good
if (noValue == null) {
  // ......
}

// bad
if (noValue === null || typeof noValue === 'undefined') {
  // ......
}
```

### 按执行频率排列分支的顺序。

按执行频率排列分支的顺序好处是：

1. 阅读的人容易找到最常见的情况，增加可读性。
2. 提高执行效率。

###对于相同变量或表达式的多值条件，用 `switch` 代替 `if`。
```javascript
// good
switch (typeof variable) {
    case 'object':
        // ......
        break;
    case 'number':
    case 'boolean':
    case 'string':
        // ......
        break;
}

// bad
var type = typeof variable;
if (type === 'object') {
    // ......
}
else if (type === 'number' || type === 'boolean' || type === 'string') {
    // ......
}
```

##循环

1. 不要在循环体中包含函数表达式，事先将函数提取到循环体外。
2. 对循环内多次使用的不变值，在循环外用变量缓存。
3. 对有序集合进行遍历时，缓存 `length`

##类型

###类型检测
类型检测优先使用 `typeof`。对象类型检测使用 `instanceof`。`null` 或 `undefined` 的检测使用 `== null`。

```js
// string
typeof variable === 'string'

// number
typeof variable === 'number'

// boolean
typeof variable === 'boolean'

// Function
typeof variable === 'function'

// Object
typeof variable === 'object'

// RegExp
variable instanceof RegExp

// Array
variable instanceof Array

// null
variable === null

// null or undefined
variable == null

// undefined
typeof variable === 'undefined'
```

###类型转换
1. 转换成 `string` 时，使用 `+ ''`。

```js
// good
num + '';

// bad
new String(num);
num.toString();
String(num);
```

2. 转换成 `number` 时，通常使用 `+`。

```javascript
// good
+str;

// bad
Number(str);
```

3. `string` 转换成 `number`，要转换的字符串结尾包含非数字并期望忽略时，使用 `parseInt`。

```javascript
var width = '200px';
parseInt(width, 10);
```

4. 转换成 `boolean` 时，使用 `!!`。

```javascript
var num = 3.14;
!!num;
```

##对象
1. `for in` 遍历对象时, 使用 `hasOwnProperty` 过滤掉原型中的属性。
```javascript
var newInfo = {};
for (var key in info) {
    if (info.hasOwnProperty(key)) {
        newInfo[key] = info[key];
    }
}
```


(详细文档)[https://github.com/ecomfe/spec/blob/master/javascript-style-guide.md]