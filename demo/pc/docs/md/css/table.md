#表格
----------------------

##系统默认表格

<div class="docs-example">
    <table>
        <thead>
          <tr>
            <th>表头</th>
            <th>表头</th>
            <th>表头</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
        </tbody>
    </table>
</div>

```html
<table>
    ...
</table>
```

##cfec默认表格

<div class="docs-example">
    <table class="table">
        <thead>
          <tr>
            <th>表头</th>
            <th>表头</th>
            <th>表头</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
        </tbody>
    </table>
</div>

```html
<table class="table">
    ...
</table>
```

##带边框

<div class="docs-example">
    <table class="tab-le table-border">
        <thead>
          <tr>
            <th>表头</th>
            <th>表头</th>
            <th>表头</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
        </tbody>
    </table>    
</div>

```html
<table class="table table-border">
    ...
</table>
```

##斑马线
使用css3伪类实现，不支持ie7~8

<div class="docs-example">
    <table class="tab-le table-border table-striped">
        <thead>
          <tr>
            <th>表头</th>
            <th>表头</th>
            <th>表头</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
        </tbody>
    </table>    
</div>

```html
<table class="table table-border table-striped">
    ...
</table>
```

##table-hover 鼠标悬停样式

<div class="docs-example">
    <table class="tab-le table-border table-hover">
        <thead>
          <tr>
            <th>表头</th>
            <th>表头</th>
            <th>表头</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
        </tbody>
    </table>    
</div>

```html
<table class="table table-border table-hover">
    ...
</table>
```

##table-bg th带背景

<div class="docs-example">
    <table class="table table-bg">
        <thead>
          <tr>
            <th>表头</th>
            <th>表头</th>
            <th>表头</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
          <tr>
            <th>类别</th>
            <td>表格内容</td>
            <td>表格内容</td>
          </tr>
        </tbody>
    </table>      
</div>

```html
<table class="table table-bg">
    ...
</table>
```

## 定义颜色

<div class="docs-example">
    <table class="table table-border table-bg">
        <thead>
            <tr>
                <th width="20%">Class</th>
                <th>描述</th>
            </tr>
        </thead>
        <tbody>
            <tr class="active">
                <th>.active</th>
                <td>悬停在行</td>
            </tr>
            <tr class="success">
                <th>.success</th>
                <td>成功或积极</td>
            </tr>
            <tr class="warning">
                <th>.warning</th>
                <td>警告或出错</td>
            </tr>
            <tr class="danger">
                <th>.danger</th>
                <td>危险</td>
            </tr>
        </tbody>
    </table>
</div>

```html
<table class="table table-border table-bg table-bordered">
  <thead>
    <tr><th width="20%">Class</th><th>描述</th></tr>
  </thead>
  <tbody>
    <tr class="active"><th>.active</th><td>悬停在行</td></tr>
    <tr class="success"><th>.success</th><td>成功或积极</td></tr>
    <tr class="warning"><th>.warning</th><td>警告或出错</td></tr>
    <tr class="danger"><th>.danger</th><td>危险</td></tr>
  </tbody>
</table>
```
