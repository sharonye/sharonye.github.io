---
layout: post
title:  Pixi使用教程
date:   2016-11-16 18:00:06 +0800
categories: 前端笔记
tags:
- f2e 
- Pixi 
---

原文地址：[Learning Pixi](https://github.com/kittykatattack/learningPixi)

前言略过不翻，直接从正文开始。

### 设置

在开始写代码之前，首先为你的项目创建一个文件夹，并且在这个项目的根目录下开启一个web服务。如果不用web服务器运行的话，Pixi是无法工作的。
接下来你需要安装Pixi。

#### 安装Pixi最简单的方法

从[GitHub](https://github.com/pixijs/pixi.js)上获取`pixi.min.js`文件的最新版本。

这是你使用Pixi所需的唯一一个文件，至于仓库里的其他文件可以直接无视，因为并不需要它们。

接下来，创建一个基础的HTML页面，用`<script>`标签将你刚刚下载的`pixi.min.js`文件引入进来。`<script>`标签的`src`应该是相对于你跑web服务的根目录的路径。你的`<script>`标签应该看起来像是这样：

```html
<script src="pixi.min.js"></script>
```

<!--more-->

以下是一个基础的HTML页面例子，链接Pixi并且测试其是否工作：

```html
<!doctype html>
<meta charset="utf-8">
<title>Hello World</title>
<body>
<script src="pixi.min.js"></script>
<script>

//测试Pixi是否工作
console.log(PIXI);

</script>
</body>
```

这就是创建一个Pixi的项目所需的最少HTML内容了。如果Pixi被正确地加载进来，那么`console.log(PIXI)`会在你的浏览器的js控制台显示如下内容：

```javascript
Object { VERSION: "3.0.7" ...
```

如果你看到了这个（或者跟它类似的其他内容），说明一切正常运转。

现在你就可以开始使用Pixi写项目啦！

#### 用Git安装Pixi

你也可以使用Git来安装使用Pixi。这种方法的好处在于：你可以通过在命令行执行`git pull origin master`来更新Pixi到最新版本。并且，如果你发现了Pixi的bug，可以修复它并且提交一个pull request将这个问题修复加入到库中。

命令行下`cd`进入到你的项目的根目录下，输入以下代码来克隆Pixi仓库到本地：
```
git clone git@github.com:pixijs/pixi.js.git
```

这将会自动创建一个名为`pixi.js`的文件夹并将Pixi最新的版本加载进来。

安装完Pixi之后，创建一个基础的HTML页面，用`<script>`标签将Pixi`bin`目录下的`pixi.js`文件引入进来。`<script>`标签的`src`应该是相对于你跑web服务的根目录的路径。你的`<script>`标签应该看起来像是这样：

```html
<script src="pixi.js/bin/pixi.js"></script>
```

（如果你更喜欢使用如上一节所说的`pixi.min.js`来代替也是可以的。经过的压缩的文件的确会运行的稍微快一些，并且肯定要加载的更快。而使用未压缩的js文件的好处则是，如果编译器认为Pixi的源代码里有bug，它在给你报错的时候会以可读的格式来显示可疑代码。当你在做一个项目的时候这是十分有用的，因为即使这个bug不是在Pixi里，这个报错也可能就你的代码有什么问题给你一些提示。）

### 创建渲染器和舞台

现在你可以开始使用Pixi了！

如何使用呢？

第一步是创建一个矩形的显示区域，在这里你可以将图形放入其中展示。Pixi有一个`renderer`对象用来创建它。它会自动生成一个HTML的`<canvas>`元素并决定如何在canvas里显示你的图像。然后你需要创建一个特别的Pixi`Container`对象，名为`stage`。你将会看见，这个舞台对象将会被用作呈现所有你希望显示的内容的最底层的容器。

以下就是你创建`renderer`和`stage`所需要写的代码。将这些代码写入你的HTML文件的`<script>`标签之内：

```javascript
//创建渲染器
var renderer = PIXI.autoDetectRenderer(256, 256);

//将canvas加入HTML文件中
document.body.appendChild(renderer.view);

//创建一个名为舞台的容器对象
var stage = new PIXI.Container();

//告诉渲染器去渲染舞台
renderer.render(stage);
```

这是你开始使用Pixi需要写的最基础的代码。它生成了一个256像素*256像素大小的黑色canvas元素，并将其添加到你的HTML文件中。当你执行代码后在浏览器里它看起来会是这个样子：

![image](https://github.com/kittykatattack/learningPixi/raw/master/examples/images/screenshots/01.png)

呀，一个黑色的方块！

Pixi的`autoDetectRenderer`方法决定了用Canvas Drawing API还是WebGL来渲染图像，取决于哪个更加合适。它的两个参数分别为canvas的宽和高。不过，你也可以添加一个可选的第三参数，它包含了一些你可以设置的额外的值。这第三个参数是一个对象，下面是一个如何用它来设置抗锯齿、透明度和分辨率的例子：

```javascript
renderer = PIXI.autoDetectRenderer(
  256, 256,
  {antialias: false, transparent: false, resolution: 1}
);
```

上面的这第三个参数是可选的——如果你喜欢Pixi的默认设置就不用管它了，而且通常来说也不需要去修改它。（但是，如果你需要修改的话，可以参考Pixi的文档 [Canvas Renderer](http://pixijs.github.io/docs/PIXI.CanvasRenderer.html)和[WebGLRenderer](http://pixijs.github.io/docs/PIXI.WebGLRenderer.html)。）

这些选项有什么用呢？

```javascript
{antialias: false, transparent: false, resolution: 1}
```

`antialias`是用来设置文字和图像的边缘平滑的。（WebGL的抗锯齿并非在所有平台都有效，所以你需要在你的目标平台上测试一下它。）`transparent`用来设置canvas的背景透明。`resolution`让它更易在不同分辨率和像素密度下工作。设置分辨率有点超出这个教程的范围了，但是你可以看看[Mat Grove](http://www.goodboydigital.com/pixi-js-v2-fastest-2d-webgl-renderer/)关于怎么使用`resolution`细节的解释。不过在通常情况下，大部分的项目中你只要保持`resolution`的值为1就可以了。

（注：渲染器还有一个额外的第四选项`preserveDrawingBuffer`，其值默认为`false`。只有当你需要在WebGL画布上下文中使用Pixi特别的`dataToURL`方法时你才需要将它设置为`true`。）

Pixi渲染器对象默认是WebGL的，这是比较好的，因为WebGL非常快，并且允许你使用一些接下来你将会学到的很酷炫的视觉效果。但是如果你要强制使用Canvas Drawing API来代替WebGL的话，你可以这样做：

```javascript
renderer = new PIXI.CanvasRenderer(256, 256);
```

只有前两个参数是必须的：`width`和`height`。

你可以像这样强制WebGL渲染：

```javascript
renderer = new PIXI.WebGLRenderer(256, 256);
```

`renderer.view`对象就是一个简单普通的`<canvas>`对象，所以你可以像操作其他canvas对象一样对其进行操作。以下是怎么给canvas设置一个虚线边框：

```javascript
renderer.view.style.border = "1px dashed black";
```

如果你在创建了canvas之后需要改变它的背景颜色，只要设置`renderer`对象的`backgroundColor`属性为任意十六进制颜色值：

```javascript
renderer.backgroundColor = 0x061639;
```

如果你需要获取`renderer`的宽或高，使用`renderer.view.width`和`renderer.view.height`即可。

（需要注意的是，尽管`stage`也有`width`和`height`属性，但是*他们指的并不是渲染窗口的尺寸*。舞台的`width`和`height`只是告诉你你放入的元素所占用的区域 —— 后面将会再详细讲到）

要改变canvas的尺寸，可以使用`renderer`的`resize`方法，并提供新的`width`和`height`值。但是，为了确保canvas调整大小能匹配分辨率，应该设置`autoResize`为`true`。

```javascript
renderer.autoResize = true;
renderer.resize(512, 512);
```

如果你想要让canvas填满整个窗口，可以应用这些CSS样式并且调整渲染器的大小为浏览器窗口的尺寸。

```javascript
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);
```

但是，如果你这么做了，请确保你使用了像下面这样的CSS代码设置了HTML元素的默认内外边距为0：

```html
<style>* {padding: 0; margin: 0}</style>
```

（上面代码中的星号*是CSS中的“通用选择器”，表示“HTML文档中的所有标签”。）

如果你想让canvas按比例缩放到任意浏览器窗口大小，可以使用[自定义的scaleToWindow方法](https://github.com/kittykatattack/scaleToWindow)。

### Pixi精灵

在上一节中你已经学会了如何创建一个`stage`对象，像这样：

```javascript
var stage = new PIXI.Container();
```

`stage`是一个Pixi`Container`对象。你可以将它看做是一个空壳子来把你所放进去的东西装在一起存放其中。我们所创建的这个`stage`对象是用来存放你场景中所有可见物体的最底层的容器。Pixi要求你有一个底层的容器对象，因为`renderer`需要对它进行渲染：

```javascript
renderer.render(stage);
```

你所放入`stage`中的任何东西都会被渲染到canvas中。现在`stage`还是空的，但是我们马上将要往里面放入一些东西了。

（注：你可以给你的底层容器起任何你喜欢的名字。如果你喜欢的话叫它`scene`或者`root`都可以。`stage`这个名字只是一个约定俗成的叫法，我们在这个教程中就一直使用这个名称了。）

所以你要放些什么在舞台中呢？特殊的图像对象被称为**精灵（sprites）**。精灵主要就是你可以用代码来控制的图像。你可以控制它们的位置、尺寸，和许多属性来实现交互式的动态图像。学习创建和控制精灵是在学习Pixi过程中最重要的部分。如果你知道了如何创建精灵并把它们放入到舞台中，那么你就迈出了做一个游戏的第一步。

Pixi有一个`Sprite`类用来创建游戏精灵。这里有三个主要的方法来创建它们：

- 由一张图片文件创建。

- 由tileset的子图像创建。tileset就是你游戏里用到的所有图片拼成的一张大图。

- 由纹理地图集创建（一个定义了tileset里图像的尺寸和位置的JSON文件）

你将学习到这三种方式，但是，在开始之前，让我们先来看看在你能够将图像用Pixi显示出来前所需要知道些什么。

### 加载图像到纹理缓存

由于Pixi通过WebGL在GPU上渲染图像，图像需要是一个GPU能够处理的格式。一个WebGL就绪的图像称作**纹理（texture）**。在让精灵展示一个图像之前，你需要将普通图像转换为WebGL纹理。为了使一切在后台快速高效地工作，Pixi使用纹理缓存来存储和引用你的精灵所需的所有纹理。这些纹理的名字是与它们所指的图像的文件位置相匹配的字符串。这意味着如果你有一个加载自`"images/cat.png"`的纹理，你就可以在下面这样的纹理缓存中找到它：

```javascript
PIXI.utils.TextureCache["images/cat.png"];
```

纹理以WebGL兼容格式被储存使得Pixi的渲染器能够高效地工作。接着你就可以使用Pixi的`Sprite`类通过纹理来创建一个新的精灵。

```javascript
var texture = PIXI.utils.TextureCache["images/anySpriteImage.png"];
var sprite = new PIXI.Sprite(texture);
```

然而如何加载一个图像并将它转换为纹理呢？答案是使用Pixi的内置对象`loader`。

Pixi强大的`loader`对象让你可以加载任何类型的图像。以下是如何使用它加载一个图像并且在图像加载完成后调用一个名为`setup`的函数：

```javascript
PIXI.loader
  .add("images/anyImage.png")
  .load(setup);

function setup() {
  //这里的代码将会再图像加载完成后执行
}
```

[Pixi开发团队建议](http://www.html5gamedevs.com/topic/16019-preload-all-textures/#comment-90907)如果你使用loader，你应该在`loader`的`resources`对象中引入纹理来创建精灵，像是这样：

```javascript
var sprite = new PIXI.Sprite(
  PIXI.loader.resources["images/anyImage.png"].texture
);
```

这里有一段完整的代码，你可以用它来加载一个图像，调用`setup`函数，并且通过加载的图像创建一个精灵：

```javascript
PIXI.loader
  .add("images/anyImage.png")
  .load(setup);

function setup() {
  var sprite = new PIXI.Sprite(
    PIXI.loader.resources["images/anyImage.png"].texture
  );
}
```

这是我们在这个教程中用来加载图像并创建精灵的一般格式。

你可以通过链式的`add`方法来一次加载多个图像，像是这样：

```javascript
PIXI.loader
  .add("images/imageOne.png")
  .add("images/imageTwo.png")
  .add("images/imageThree.png")
  .load(setup);
```

更好的方式是，在一个`add`方法内将你想要加载的所有文件列入一个数组，像是这样：

```javascript
PIXI.loader
  .add([
    "images/imageOne.png",
    "images/imageTwo.png",
    "images/imageThree.png"
  ])
  .load(setup);
```

`loader`也允许你加载JSON文件，后面你将会学到。

### 显示精灵

当你已经加载了一个图像并且使用它创建了一个精灵，在你能真正从canvas上看到它之前还有两件事需要做：

-1. 你需要通过`stage.addChild`方法将精灵添加到Pixi的`stage`中去，像是这样：

```javascript
stage.addChild(cat);
```

这个舞台是容纳你所有精灵的主容器。

-2. 你需要告诉Pixi的`renderer`去渲染舞台

```javascript
renderer.render(stage);
```

**在你做这两件事之前你的所有精灵都不能被看见。**

在我们继续之前，先来看看一个实例，用刚刚学到的方法显示一个图像。这里有一个64*64像素的小猫png图片。

![小猫](https://github.com/kittykatattack/learningPixi/raw/master/examples/images/cat.png)

下面就是加载这个图片，创建一个精灵，并且将它显示在Pixi舞台上的所有代码：

```javascript
var stage = new PIXI.Container(),
    renderer = PIXI.autoDetectRenderer(256, 256);
document.body.appendChild(renderer.view);

//使用Pixi的内置`loader`对象加载图像
PIXI.loader
  .add("images/cat.png")
  .load(setup);

//这个`setup`函数会在图片加载完成后执行
function setup() {

  //由纹理创建`cat`精灵
  var cat = new PIXI.Sprite(
    PIXI.loader.resources["images/cat.png"].texture
  );

  //将小猫添加到舞台中
  stage.addChild(cat);

  //渲染舞台   
  renderer.render(stage);
}
```

执行以上代码，你将会看到：

![image](https://github.com/kittykatattack/learningPixi/raw/master/examples/images/screenshots/02.png)

现在我们已经有些成果了！

如果你需要从舞台中移除一个精灵，就使用`removeChild`方法：

```javascript
stage.removeChild(anySprite)
```

但通常来说让一个精灵消失更加简单有效的方法是设置这个精灵的`visible`属性为`false`。

```javascript
anySprite.visible = false;
```

#### 使用别名

你可以通过给自己频繁使用的Pixi对象和方法创造一个简单的别名来减少一点键盘输入，同时也让你的代码可读性更强。比如，输入`PIXI.utils.TextureCache`是不是太麻烦了呢？我觉得是。特别是在一个大项目里你需要几十上百次地使用它时。所以创造一个别名来指代它吧，就像这样：

```javascript
var TextureCache = PIXI.utils.TextureCache
```

然后就可以使用这个别名来代替原来的，像是这样：

```javascript
var texture = TextureCache["images/cat.png"];
```

除了使你的代码更加简洁之外，使用别名还有另外一个好处：它帮助你在Pixi频繁更改API的情况下有一些缓冲。如果Pixi在未来的版本中更改了API —— 它会改的！ —— 你只需要在程序开头的这一处更新Pixi对象和方法的别名，而不是在你代码中所有的实例处去修改。

让我们重写一遍加载和显示图像的代码，为所有Pixi对象和方法使用别名，来看看应该怎么做：

```javascript
//别名
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//创建一个Pixi舞台和渲染器并添加renderer.view到DOM
var stage = new Container(),
    renderer = autoDetectRenderer(256, 256);
document.body.appendChild(renderer.view);

//加载图像并在加载完成后执行`setup`函数
loader
  .add("images/cat.png")
  .load(setup);

function setup() {

  //创建`cat`精灵，将它加入舞台，并渲染它
  var cat = new Sprite(resources["images/cat.png"].texture);  
  stage.addChild(cat);
  renderer.render(stage);
}
```

这个教程中的大部分例子都会像上面这个模式一样对Pixi对象使用别名。除非另作说明，你可以认为所有的代码例子都使用这样的别名。

以上就是关于加载图片和创建精灵你所需要知道的所有内容。

#### 更多关于加载的事

上面我所展示的格式就是我建议你使用的加载和显示精灵的标准模板，所以你可以直接无视接下来这几段内容直接跳到下一节“精灵定位”。但是Pixi的`loader`对象是十分复杂的，并且包含了一些你应该注意到的特性，即使你不会经常使用它们。那么我们来看看其中最有用的那些。

##### 由普通JavaScript的Image对象或者Canvas来创建一个精灵

为了优化和效率，由预加载到Pixi纹理缓存中的纹理来创建一个精灵总是最好的选择。但是如果由于某些原因你需要从JavaScript的`Image`对象来创建一个纹理，你可以使用Pixi的`BaseTexture`和`Texture`类来实现：

```javascript
var base = new PIXI.BaseTexture(anyImageObject),
    texture = new PIXI.Texture(base),
    sprite = new PIXI.Sprite(texture);
```

如果你想用任何已经存在的canvas元素来创建一个纹理，你可以使用`BaseTexture.fromCanvas`：

```javascript
var base = new PIXI.BaseTexture.fromCanvas(anyCanvasElement),
```

如果你想要改变一个精灵显示的纹理，可以使用`texture`属性。对任意`Texture`对象设置它，像这样：

```javascript
anySprite.texture = PIXI.utils.TextureCache["anyTexture.png"];
```

使用这个方法你就可以在你游戏中一些操作触发的时候来动态地改变精灵的外观。

##### 给加载文件指定一个名字

给你想要加载的每一个资源指定一个独特的名字是可行的。只要在`add`方法中用这个名字（一个字符串）作为第一个参数。举个例子，下面展示了如何为一张猫的图片命名为`catImage`。

```javascript
PIXI.loader
  .add("catImage", "images/cat.png")
  .load(setup);
```

以上代码在`loader.resources`里创建了一个名为`catImage`的对象。这意味着你可以通过引用`catImage`对象来创建一个精灵，像这样：

```javascript
var cat = new PIXI.Sprite(PIXI.loader.resources.catImage.texture);
```

但是，我建议你不要使用这个特性！因为你会需要记住你给每个加载进来的文件指定的名字，也需要确保没有不小心重复命名了文件。像我们之前那些例子那样使用文件路径名会更简单并且减少出错的概率。

##### 监测加载进程

Pixi的加载器有一个特别的`progress`事件，它可以调用一个可自定义的会在每次加载文件时运行的函数。`progress`事件是被`loader`的`on`方法调用的，像这样：

```javascript
PIXI.loader.on("progress", loadProgressHandler);
```

下面就是如何在加载链中包含`on`方法，然后在每次文件加载时调用一个用户可自定义的名为`loadProgressHandler`的函数：

```javascript
PIXI.loader
  .add([
    "images/one.png",
    "images/two.png",
    "images/three.png"
  ])
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler() {
  console.log("loading"); 
}

function setup() {
  console.log("setup");
}
```

上面的文件每加载一个，进程事件都会调用`loadProgressHandler`函数在控制台中输出"loading"。当这三个文件全部加载完毕后，`setup`函数将会执行。控制台中的输出内容如下：

```
loading
loading
loading
setup
```

这很简单，但是它可以做的事情有更多。你可以知道确切哪个文件已经加载了，还有已加载的文件占文件总数的百分比。只要给`loadProgressHandler`函数加上可选参数`loader`和`resource`，像这样：

```javascript
function loadProgressHandler(loader, resource) { //...
```

然后你就可以使用`resource.url`来查明刚刚加载的文件。（如果你想查询你可能给文件指定了的可选名称，就是上面`add`方法的第一个参数，那么你可以使用`resource.name`。）并且你可以使用`loader.progress`来查询已加载的文件所占的百分比。下面就是实现以上功能的代码：

```javascript
PIXI.loader
  .add([
    "images/one.png",
    "images/two.png",
    "images/three.png"
  ])
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the precentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 

  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}

function setup() {
  console.log("All files loaded");
}
```

执行上述代码时控制台中将会显示以下内容：

```
loading: images/one.png
progress: 33.333333333333336%
loading: images/two.png
progress: 66.66666666666667%
loading: images/three.png
progress: 100%
All files loaded
```

这十分酷，因为你可以用它来作为创建一个加载进度条的基础。

（注：除此之外`resource`对象还有一些可以使用的附加属性。`resource.error`可以告诉你当你加载一个文件时可能出现的任何错误。`resource.data`则可以让你获取一个文件的二进制元数据。）

##### 关于Pixi加载器的更多内容

Pixi的加载器特性非常丰富并且可配置。现在就对它做一个总的概览。

加载器可串联的`add`方法拥有4个基本的参数：

```javascript
add(name, url, optionObject, callbackFunction)
```

下面是加载器源代码文档对这几个参数的描述：

`name`(string)：被加载的资源的名称。如果不传这个值，将会使用`url`。 `url`(string)：资源的路径，相对于加载器的`baseUrl`。 `options`(object literal)：加载选项。 `options.crossOrigin`(Boolean)：是否跨域请求？默认是自动判断。 `options.loadType`：资源应该如何被加载？默认值是`Resource.LOAD_TYPE.XHR`。 `options.xhrType`：当使用XHR时被加载的数据应该如何被解释？默认值是`Resource.XHR_RESPONSE_TYPE.DEFAULT`。 `callbackFunction`：当特定资源加载完成后调用的函数。

以上参数中`url`是唯一一个必须的（你所想要加载的文件路径）。

这里有一些使用`add`方法加载文件的例子。第一个就是文档中说的加载器的`普通语法`：

```javascript
.add('key', 'http://...', function () {})
.add('http://...', function () {})
.add('http://...')
```

下面是加载器`对象语法`的例子：

```javascript
.add({
  name: 'key2',
  url: 'http://...'
}, function () {})

.add({
  url: 'http://...'
}, function () {})

.add({
  name: 'key3',
  url: 'http://...'
  onComplete: function () {}
})

.add({
  url: 'https://...',
  onComplete: function () {},
  crossOrigin: true
})
```

你也可以给`add`方法传递一个对象或者路径的数组，或者两者都有：

```javascript
.add([
  {name: 'key4', url: 'http://...', onComplete: function () {} },
  {url: 'http://...', onComplete: function () {} },
  'http://...'
]);
```

（注：如果你需要重新设置加载器来加载一批新的文件，可以调用加载器的`reset`方法：`PIXI.loader.reset();`）

Pixi的加载器有很多高级特性，包括了许多选项让你可以加载和解析各种类型的二进制文件。这不是你经常需要做的事情，而且也超出了本教程的内容，所以可以[查询加载器的GitHub资源库获取更多信息](https://github.com/englercj/resource-loader)。

### 精灵定位

既然你已经知道了如何创建和显示精灵，下面就让我们学习怎么定位和修改它们的尺寸。

在前面的例子中，小猫精灵被添加到了舞台的左上角。小猫有一个值为0的`x`坐标位置和一个值为0的`y`坐标位置。你可以通过改变它的`x`和`y`属性的值来改变它的位置。以下是通过设置它的`x`和`y`属性值为96来使小猫居中显示在舞台上。

```javascript
cat.x = 96;
cat.y = 96;
```

在你创建了这个精灵后，将这两行代码加入`setup`函数的任意位置。

```javascript
function setup() {

  //Create the `cat` sprite
  var cat = new Sprite(resources["images/cat.png"].texture);

  //Change the sprite's position
  cat.x = 96;
  cat.y = 96;

  //Add the cat to the stage so you can see it
  stage.addChild(cat);

  //Render the stage
  renderer.render(stage);
}
```

（注：在这个例子中，`Sprite`是`PIXI.Sprite`的别名，`TextureCache`是`PIXI.utils.TextureCache`的别名，`resources`是`PIXI.loader.resources`的别名，之前有解释过。在接下来例子的代码中，我将会对所有的Pixi对象和方法使用同样的格式。）

这两行代码会将小猫向右移动96像素，向下移动96像素。结果如下：

![image](https://github.com/kittykatattack/learningPixi/raw/master/examples/images/screenshots/03.png)

（啊啊啊作者讲的太细了好啰嗦呀，好气哦不翻了！）