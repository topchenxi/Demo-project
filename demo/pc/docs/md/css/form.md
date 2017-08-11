# 表单
--------------------------

## 默认表单
给`<form>`加个class `form`就可以创建默认的单行表单。

<form action="" class="form">
  <legend>一个简单的单行表单</legend>
  <input type="text" name="" id="" hint="邮箱">
  <input type="text" name="" id="" hint="密码">
  <label for="remember"><input type="checkbox" name="" id="remember">记住我</label>
  <button class="btn btn-primary">登录</button>
</form>

``` html
<form action="" class="form">
  <legend>一个简单的单行表单</legend>
  <input type="text" name="" id="" placeholder="邮箱">
  <input type="text" name="" id="" placeholder="密码">
  <label for="remember"><input type="checkbox" name="" id="remember">记住我</label>
  <button class="btn btn-primary">登录</button>
</form>
```

## 堆叠式

加个class `form` 后，再加个class `form-stacked` 可实现如下效果

<form action="" class="form form-stacked">
    <legend>堆叠式表单</legend>
    <input type="text" name="" id="" placeholder="密码">
</form>
