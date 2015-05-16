(function() {

'use strict';
angular.module('svgDrawing', [])

  .constant('svgDrawConfig', {
    startFrame: 0,
    endFrame: 60,
    complete: angular.noop,
    delay: 0
  })

  .factory('SvgElFactory', function(){
    var requestAnimFrame = function(){
      return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback){
          window.setTimeout(callback, 1000 / 60);
        }
      );
    }();

    var cancelAnimFrame = function(){
      return (
        window.cancelAnimationFrame       ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame    ||
        window.oCancelAnimationFrame      ||
        window.msCancelAnimationFrame     ||
        function(id){
          window.clearTimeout(id);
        }
      );
    }();

    function SVGEl(el, startFrame, endFrame, onComplete) {
      this.el = el;
      this.currentFrame = startFrame;
      this.totalFrames = endFrame;
      this.onComplete = onComplete;
      this.path = [];
      this.length = [];
      this.handle = 0;
      this.init();
    }

    SVGEl.prototype.init = function() {
      var self = this;
      [].slice.call( this.el.querySelectorAll( 'path' ) ).forEach( function( path, i ) {
        self.path[i] = path;
        var l = self.path[i].getTotalLength();
        self.length[i] = l;
        self.path[i].style.strokeDasharray = l + ' ' + l;
        self.path[i].style.strokeDashoffset = l;
      } );
    };

    SVGEl.prototype.render = function( domEl ) {
      if( this.rendered ) return;
      if( domEl ) {
        this.domEl = domEl;
      }
      this.rendered = true;
      this.draw();
    };

    SVGEl.prototype.draw = function() {
      var self = this,
          progress = this.currentFrame/this.totalFrames;

      if (progress > 1) {
        cancelAnimFrame(this.handle);
        this.onComplete();
      } else {
        this.currentFrame++;
        for(var j=0, len = this.path.length; j<len;j++){
          this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
        }
        this.handle = requestAnimFrame(function() { self.draw(); });
      }
    };

    return SVGEl;
  })

  .directive('svgDraw', ['svgDrawConfig', 'SvgElFactory', function (svgDrawConfig, SvgElFactory){
    return {
      restrict: 'A',
      replace: false,
      scope: {
        'complete': '&',
        'endFrame': '@',
        'startFrame': '@',
        'delay': '@'
      },
      link: function(scope, element) {

        var complete = scope.complete || svgDrawConfig.complete,
            startFrame = scope.startFrame || svgDrawConfig.startFrame,
            endFrame = scope.endFrame || svgDrawConfig.endFrame,
            delay = scope.delay || svgDrawConfig.delay;

        function init() {
          var el = element[0],
              svg = new SvgElFactory(el, startFrame, endFrame, complete);

          setTimeout(function(){
            svg.render( el );
          }, delay);
        }

        init();
      }
    };
  }]);

})();
