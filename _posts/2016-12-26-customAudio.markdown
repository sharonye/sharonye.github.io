---
layout: post
title:  自定义audio元素进度条
date:   2016-12-26 17:20:06 +0800
categories: notes
tags:
- html5 
- audio 
excerpt: 关于自定义audio的进度条时涉及到的一些事件和方法。
---

今天遇到的一个新需求，是要用html5做一个自定义的控制音频播放的部件。这里主要记录下其中进度条部分的实现。

首先，控制部分的结构如下：

```html
<div id="media-controls">
	<button id='play-pause-button' class='play' onclick='togglePlayPause();'></button>
	<span id="currT" class="time">00:00:00</span>
	<div id='progress-bar'>
		<span id="curr-bar"></span>
		<span id="curr-point"></span>
	</div>
	<span id="totalT" class="time">00:00:00</span>
</div>
```

可以看到结构很简单，一个`play/pause`的按钮，接着是当前播放到的时间点，然后是一个进度条，最后是总时间。播放暂停按钮就是简单的切换audio的`play`和`pause`状态以及按钮的样式，当前时间和总时间也容易获得，对数据做一下格式的处理显示出来即可，需要注意的一点是当音频文件的元数据加载完毕后才能获取到音频总时长，所以这里需要监听一个元数据加载完毕的事件`loadedmetadata`：

```javascript
mediaPlayer.addEventListener('loadedmetadata', function() {
    var h = fixNum(parseInt(mediaPlayer.duration / 3600));
    var m = fixNum(parseInt(( mediaPlayer.duration - h * 3600 ) / 60));
    var s = fixNum(Math.round(( mediaPlayer.duration - h * 3600 ) % 60));
    $('#totalT').text( h + ':' + m + ':' + s );
});

// 将数字统一转换为两位数
function fixNum(num) {
   if(num<10){
      return '0'+num;
   }
   else{
      return num;
   }
}
```

接下来就是进度条的实现了，`#progress-bar`是整个进度条槽，`#curr-bar`是目前走完的进度部分，`#curr-point`是指示当前时间点的小球。样式不赘述，只要将`#curr-bar`定位在`#progress-bar`的左侧，`#curr-point`定位在`#curr-bar`的右端，然后通过js控制`#curr-bar`的宽度即可。

然后我们只需监听audio的`timeupdate`事件，就可以根据播放进度实时更新进度条的位置了：

```javascript
mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);

function updateProgressBar() {
   var h = fixNum(parseInt(mediaPlayer.currentTime / 3600));
   var m = fixNum(parseInt(( mediaPlayer.currentTime - h * 3600 ) / 60));
   var s = fixNum(Math.round(( mediaPlayer.currentTime - h * 3600 ) % 60));
   $('#currT').text( h + ':' + m + ':' + s);
   var percentage = Math.floor((100 / mediaPlayer.duration) *
   mediaPlayer.currentTime);
   $('#curr-bar').css("width", percentage +"%");
   $('#curr-point').css("left", percentage +"%");
}
```

由于进度条通常是可拖动的，用户需要跳转到任意时间点，所以这里再给`#curr-point`加上一个监听拖动的事件：

```javascript
var timeDrag = false; /* 拖动状态 */

$('#curr-point').on('mousedown touchstart',function (e) {
  timeDrag = true;
});

$("#curr-point").on('mouseup touchend',function (e) {
  if (timeDrag) {
      timeDrag = false;
  }
});

$("#curr-point").on('mousemove touchmove',function (e) {
  if (timeDrag) {
      touch = undefined;
      if (e.originalEvent.touches){
        touch = e.originalEvent.touches[0];
      }
      updatebar(e.pageX || touch.pageX);
  }
});

var updatebar = function (x) {
  var maxduration = mediaPlayer.duration; /* 总时长 */
  var position = x - progressBar.offset().left; /* 当前位置 */
  var percentage = 100 * position / progressBar.width();

  // 百分比范围控制在0-100
  if (percentage > 100) {
      percentage = 100;
  }
  if (percentage < 0) {
      percentage = 0;
  }

  // 更新进度条及音频当前时间
  $('#curr-point').css('left', percentage+'%');
  $('#curr-bar').css('width', percentage + '%');
  mediaPlayer.currentTime = maxduration * percentage / 100;
};
```

这样，一个可拖动跳转的进度条就完成了。