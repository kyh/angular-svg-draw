'use strict';

angular.module('svgDrawing', [])

.constant('svgDrawConfig', {
  startFrame: 0,
  endFrame: 60,
  complete: angular.noop
})
.directive('svgDraw', ['svgDrawConfig', function (svgDrawConfig){
  return {
    restrict: 'A',
    replace: false,
    link: function(scope, element, attrs) {

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

      function SVGEl( el ) {
        this.el = el;
        this.current_frame = svgDrawConfig.startFrame;
        this.total_frames = svgDrawConfig.endFrame;
        this.path = new Array();
        this.length = new Array();
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
            progress = this.current_frame/this.total_frames;

        if (progress > 1) {
          cancelAnimFrame(this.handle);
          // Animation complete
        } else {
          this.current_frame++;
          for(var j=0, len = this.path.length; j<len;j++){
            this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
          }
          this.handle = requestAnimFrame(function() { self.draw(); });
        }
      };
      
      function init() {
        var el = element[0],
            svg = new SVGEl( el );
        
        svg.render( el );
      }

      init();
    }
  };
}]);