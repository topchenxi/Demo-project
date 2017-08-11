#按钮
------------------------

##默认样式

<div class="docs-example">
    <button type="button" class="btn">默认样式</button>
    <button type="button" class="btn btn-primary">主色按钮</button>
    <button type="button" class="btn btn-broken">配合色按钮</button>
    <button type="button" class="btn btn-positive">补色按钮</button>
    <button type="button" class="btn btn-azure">湛蓝色按钮</button>
    <button type="button" class="btn btn-blue">蓝色按钮</button>
    <button type="button" class="btn btn-green">绿色按钮</button>
    <button type="button" class="btn btn-orange">橘色按钮</button>
    <button type="button" class="btn btn-op">补色按钮</button>    
</div>

```html
<button type="button" class="btn">默认样式</button>
<button type="button" class="btn btn-primary">主色按钮</button>
<button type="button" class="btn btn-broken">配合色按钮</button>
<button type="button" class="btn btn-positive">补色按钮</button>
<button type="button" class="btn btn-azure">湛蓝色按钮</button>
<button type="button" class="btn btn-blue">蓝色按钮</button>
<button type="button" class="btn btn-green">绿色按钮</button>
<button type="button" class="btn btn-orange">橘色按钮</button>
<button type="button" class="btn btn-op">补色按钮</button> 
```

##椭圆形按钮

在默认样式的基础上添加 `.round` class.

<div class="docs-example">
    <button type="button" class="btn round">默认样式</button>    
    <button type="button" class="btn btn-primary round">主色按钮</button>    
    <button type="button" class="btn btn-broken round">配合色按钮</button>    
    <button type="button" class="btn btn-positive round">补色按钮</button>
    <button type="button" class="btn btn-azure round">湛蓝色按钮</button>
</div>

```html
<button type="button" class="btn round">默认样式</button>    
<button type="button" class="btn btn-primary round">主色按钮</button>    
<button type="button" class="btn btn-broken round">配合色按钮</button>    
<button type="button" class="btn btn-positive round">补色按钮</button>
<button type="button" class="btn btn-azure round">湛蓝色按钮</button>
```


##禁用状态

<div class="docs-example">
    <button type="button" class="btn"  disabled="disabled">默认样式</button>
    <button type="button" class="btn btn-primary"  disabled="disabled">主色按钮</button>    
    <br>
    <a href="#" class="btn btn-primary disabled">链接按钮禁用状态</a>
    <a href="#" class="btn disabled">链接按钮禁用状态</a>
</div>

```html
<button type="button" class="btn"  disabled="disabled">默认样式</button>
<button type="button" class="btn btn-primary"  disabled="disabled">主色按钮</button>
<a href="#" class="btn btn-primary disabled">链接按钮禁用状态</a>
<a href="#" class="btn disabled">链接按钮禁用状态</a>
```

<div class="tips">IE7~9 会把设置了 disabled 属性的 button 元素文字渲染成灰色并加上白色阴影，CSS 无法控制这个默认样式。</div>



##尺寸
<div class="docs-example">
    <button type="button" class="btn btn-primary btn-lg">大的</button> <br>
    <button type="button" class="btn btn-primary">默认大小</button><br>
    <button type="button" class="btn btn-primary btn-sm" >小的</button><br>
    <button type="button" class="btn btn-primary btn-xs">小小的</button>
</div>

```html
<button type="button" class="btn btn-primary btn-lg">大的</button> 
<button type="button" class="btn btn-primary">默认大小</button>
<button type="button" class="btn btn-primary btn-sm" >小的</button>
<button type="button" class="btn btn-primary btn-xs">小小的</button>   
```

##块级
<div class="docs-example">
    <button type="button" class="btn btn-primary btn-block">块级按钮</button>
</div>

```html
<button type="button" class="btn btn-primary btn-block">块级按钮</button>
```

##带图标按钮