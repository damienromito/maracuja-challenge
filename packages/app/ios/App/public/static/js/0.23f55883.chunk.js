(this["webpackJsonp@maracuja/app"]=this["webpackJsonp@maracuja/app"]||[]).push([[0],{701:function(t,e,a){"use strict";a.r(e),a.d(e,"createSwipeBackGesture",(function(){return i}));var r=a(37),n=a(213),i=(a(119),function(t,e,a,i,c){var u=t.ownerDocument.defaultView;return Object(n.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(t){return t.startX<=50&&e()},onStart:a,onMove:function(t){var e=t.deltaX/u.innerWidth;i(e)},onEnd:function(t){var e=t.deltaX,a=u.innerWidth,n=e/a,i=t.velocityX,o=a/2,s=i>=0&&(i>.2||t.deltaX>o),p=(s?1-n:n)*a,d=0;if(p>5){var h=p/Math.abs(i);d=Math.min(h,540)}c(s,n<=0?.01:Object(r.k)(0,n,.9999),d)}})})}}]);
//# sourceMappingURL=0.23f55883.chunk.js.map