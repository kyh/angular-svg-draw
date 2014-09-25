svgDraw
=======

Angular directive wrapper to draw out your SVG's. Inspired by: http://tympanus.net/codrops/2013/12/30/svg-drawing-animation/

Include the 2 files from /source/ folder
  
    svg.css
    svgDrawing.js
  
Include 'svgDrawing' as a dependency in your app

    angular.module('yourApp', ['svgDrawing'])
  
To use the directive just add 'svg-draw' in the <svg> element

    <svg svg-draw></svg>
  
This will animate the paths from frames 0-60 at 60fps. Options for the directive can be controlled through data attributes. The following options are availible:

|     Name      |      Type     |   Default     |  Description  |
| ------------- | ------------- | ------------- | ------------- |
| startFrame    | int           | 0             | The frame you want to begin the animation  |
| endFrame      | int           | 60            | The frame you want to end the animation running at 60fps  |
| delay         | int           | 0             | Delay in milliseconds before starting the animation  |
| complete      | function      | angular.noop  | What function you want to run when the animation completes  |


Example can be found here:
http://tehkaiyu.github.io/svgDraw/app
