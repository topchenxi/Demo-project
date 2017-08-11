#排版
------------------------------

## 标题

<div class="docs-example">
    <h1>h1. 标题</h1>
    <h2>h2. 标题</h2>
    <h3>h3. 标题</h3>
    <h4>h4. 标题</h4>
    <h5>h5. 标题</h5>
    <h6>h6. 标题</h6>
</div>


**HTML代码**
```html
<h1>h1. 标题</h1>
<h2>h2. 标题</h2>
<h3>h3. 标题</h3>
<h4>h4. 标题</h4>
<h5>h5. 标题</h5>
<h6>h6. 标题</h6>
```


## 标签初始效果

<div class="docs-example">
    <p>这是段落，向下10像素间距</p>
    <smail>小型文本，是父容器字体大小的85%</smail>
    <strong>重要文本，加粗显示</strong>
    <em>被强调的文本，斜体显示</em>
    <u>带下划线的文本</u>
    <cite>引用</cite>
    <mark>突出显示文本</mark>
    <del>带删除线的文本</del>
    <p class="uppercase">guojunhui 大写字母</p>
    <p class="lowercase">GuoJUNHUI 小写字母</p>
    <p class="capitalize">guojunhui 首字母大写</p>
</div>


**HTML代码**
```html
<p>这是段落，向下10像素间距</p>
<smail>小型文本，是父容器字体大小的85%</smail>
<strong>重要文本，加粗显示</strong>
<em>被强调的文本，斜体显示</em>
<u>带下划线的文本</u>
<cite>引用</cite>
<mark>突出显示文本</mark>
<del>带删除线的文本</del>
<p class="uppercase">guojunhui 大写字母</p>
<p class="lowercase">GuoJUNHUI 小写字母</p>
<p class="capitalize">guojunhui 首字母大写</p>
```


##对齐
  
<div class="docs-example">
  <div class="tal">左对齐</div>
  <div class="tac">剧中对齐</div>
  <div class="tar">右对齐</div>
</div>

**html**   
```html
<div class="tal">左对齐</div>
<div class="tac">剧中对齐</div>
<div class="tar">右对齐</div>
```


##定位

**html**
```html
class="pos-r|pos-a|pos-f"
```

.pos-r 相对定位， .pos-a 绝对定位， .pos-f 固定

##浮动

<div class="docs-example">
    <div class="clearfix">
        <div class="fl">左浮动</div>
        <div class="fr">有浮动</div>
    </div>
</div>

**html**
```html
<div class="clearfix">
    <div class="fl">左浮动</div>
    <div class="fr">有浮动</div>
</div>
```

`注意：`浮动的父级元素一定要用 clearfix 清除浮动，否则高度会无法撑开。