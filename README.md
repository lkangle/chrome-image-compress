## 简介

设计稿切图自动压缩扩展。可实现设计稿（蓝湖，figma，mastergo）上切图下载时自动压缩并上传至图床。

压缩服务

-   内置程序（WebAssemby实现，高质量，高达80%+的压缩率）
-   TingPNG

图床支持

-   [x] 阿里oss
-   [x] 七牛云
-   [x] smms
-   [x] 又拍云
-   [x] 自定义web图床

高级复制

-   可以拿图片cdn地址进行自定义css代码复制
-   支持倍图

## 如何安装

Chrome商店：

直接下载：

## 使用说明

### 压缩功能

<img src="https://cdn.mymagicpaper.com/picgo/image-20231123170550690.png" alt="image-20231123170550690" style="zoom:60%;" />

启用压缩开启，就会拦截要下载的图片并进行压缩。压缩可以选择压缩服务，使用内置程序时可以选择压缩质量。如果你想要图片尺寸更小，可以选择一般，但这会加重图片的失真程度。

### 图床功能

在popup中可以选择你要上传的图床，当然也是可以禁用它的，这样你的图片会压缩后直接下载。图床选择前需要先进行配置。

<img src="https://cdn.mymagicpaper.com/picgo/image-20231123171527940.png" alt="image-20231123171527940" style="zoom:67%;" />

图床配置比较类似PicGo。提供的自定义web图床，这与PicGo的[web-uploader](https://github.com/yuki-xin/picgo-plugin-web-uploader)插件是类似的。

### 图片列表

展示上传图床后的图片，图片直接存放在用户本地。可以直接复制图片地址，并支持高级复制。也可以通过关闭高级复制功能来仅复制图片地址。

<img src="https://cdn.mymagicpaper.com/picgo/image-20231123184815151.png" alt="image-20231123184815151" style="zoom:67%;" />

图片高级复制支持以下配置项

1. 单图格式化：在复制单个图片时使用，支持占位符
2. 倍图模式：在同时上传2倍图和3倍图时，会在图片列表中形成一组，可进行倍图的css代码复制。支持 media，image-set，自定义三种模式。
    - 自定义模式下可以输入格式化模版，支持占位符

```css
// media 模式下复制的css代码
background: no-repeat top center / contain url("https://xxx/xx.png");
@media only screen and (min-resolution: 3dppx) {
    background-image: url("https://ppp/xx.png");
}

// image-set 模式下复制的css代码
background: no-repeat top center / contain image-set(
    url("https://xxx/xxx.png") 2x,
    url("https://xxx/xxx.png") 3x
);
```

<img src="https://cdn.mymagicpaper.com/picgo/image-20231123185258746.png" alt="image-20231123185258746" style="zoom:50%;" />

#### 占位符说明

| 字段             | 说明                                  | 适用 |
| ---------------- | ------------------------------------- | ---- |
| {protocol}或{pt} | 地址协议，如https:                    | 单图 |
| {host}或{H}      | 地址的host，如 p5.music.126.net       | 单图 |
| {path}或{P}      | 地址的完整path                        | 单图 |
| {width}或{w}     | 图片的宽度                            | 单图 |
| {height}或{h}    | 图片的高度                            | 单图 |
| {url}            | 单图下就是图片地址，倍图下为3倍图地址 | 全部 |
| {nurl}           | 与{url}类似，只是地址不带协议         | 全部 |
| {time}或{t}      | 当前时间戳，如 1667561552390          | 全部 |
| {2xurl}          | 倍图下2倍图地址                       | 倍图 |
| {2xnurl}         | 与{2xurl}类似，只是地址不带协议       | 倍图 |
