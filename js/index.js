$(document).ready(function () {
  var sections = $('div.section').map(function () {
    return $(this).attr('id');
  });
  var colors = $('div.section').map(function () {
    return $(this).attr('color');
  });
  var menuNames = $('div.section').map(function () {
    return $(this).attr('menu-name');
  });

  // add top nav
  var topnav = '<ul id="menu">';
  for (var i = 0; i < sections.length; i++) {
    var active = i === 0 ? ' class="active"' : '';
    topnav += '<li data-menuanchor="' + sections[i] + '"' + active + '>';
    topnav += '<a href="#' + sections[i] + '"' + active + '>' + menuNames[i] + '</a>';
    topnav += '</li>';
  }
  topnav += '</ul>';
  $('#header .content').append(topnav);

  $('#pagepiling').pagepiling({
    menu: '#menu',
    easing: 'none',
    anchors: sections,
    sectionsColor: colors,
    direction: 'horizontal',
    navigation: {
      'position': 'right',
      'tooltips': menuNames
    },
    afterRender: function () {
      // rc.rectangle(10, 10, 200, 200); // x, y, width, height
      // rc.circle(50, 50, 80, { fill: 'red' }); // fill with red hachure
      // rc.rectangle(120, 15, 80, 80, { fill: 'red' });
      // rc.circle(50, 150, 80, {
      //   fill: "rgb(10,150,10)",
      //   fillWeight: 3 // thicker lines for hachure
      // });
      // rc.rectangle(220, 15, 80, 80, {
      //   fill: 'red',
      //   hachureAngle: 60, // angle of hachure,
      //   hachureGap: 8
      // });
      // rc.rectangle(120, 105, 80, 80, {
      //   fill: 'rgba(255,0,200,0.2)',
      //   fillStyle: 'solid' // solid fill
      // });
    }

  });

  var stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
  });

  // add canvas element
  var layer = new Konva.Layer();
  stage.add(layer);

  // create shape
  var box = new Konva.Rect({
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    draggable: true
  });
  layer.add(box);

  layer.draw();

  // add cursor styling
  box.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
  });
  box.on('mouseout', function () {
    document.body.style.cursor = 'default';
  });

  // $("#logo").blast({
  //   delimiter: "letter"
  // }).velocity("transition.fadeIn", {
  //   display: null,
  //   duration: 1500,
  //   stagger: 100,
  //   delay: 1000
  // });

  $('canvas.rough.button').each(function (idx, el) {
    var rc = rough.canvas(el);
    rc.rectangle(10, 10, 180, 80, {
      fill: 'red',
      hachureAngle: 60, // angle of hachure,
      hachureGap: 8
    });
    opentype.load('fonts/impact.ttf', (err,font) => {
      let path = font.getPath('HOME', 24, 65, 50);
      const pathCmd = path.commands.map(n => {return `${n.type} ${n.x} ${n.y}`});
      rc.path(path.toPathData(2),{fill:'tan',fillStyle:'solid'});
    });
  });

  $('canvas.rough.button').hover( 
    function() {
      var rc = rough.canvas(this);
      var context = this.getContext('2d');
      context.clearRect(0, 0, this.width, this.height);
      rc.rectangle(10, 10, 180, 80, {
        fill: 'blue',
        hachureAngle: 60, // angle of hachure,
        hachureGap: 8
      });
      opentype.load('fonts/impact.ttf', (err,font) => {
        let path = font.getPath('HOME', 24, 65, 50);
        const pathCmd = path.commands.map(n => {return `${n.type} ${n.x} ${n.y}`});
        rc.path(path.toPathData(2),{fill:'white',fillStyle:'solid'});
      });
    },
    function() {
      var rc = rough.canvas(this);
      var context = this.getContext('2d');
      context.clearRect(0, 0, this.width, this.height);
      rc.rectangle(10, 10, 180, 80, {
        fill: 'red',
        hachureAngle: 60, // angle of hachure,
        hachureGap: 8
      });
      opentype.load('fonts/impact.ttf', (err,font) => {
        let path = font.getPath('HOME', 24, 65, 50);
        const pathCmd = path.commands.map(n => {return `${n.type} ${n.x} ${n.y}`});
        rc.path(path.toPathData(2),{fill:'tan',fillStyle:'solid'});
      });
    }
  );
  function doLogo(){
    const strideSize = 4.6; // dist to get point sample 
    const stepSize = 1.5; // iteration gap in userspace unit
    const maxDist = 100; // to skip strokes with looooooong length
    const strokeWidth = 0.098590522;//sketch line width; 
    const strokeColor = "rgba(64,0,0,0.9)";//sketch color
    const fillColor = "rgba(0,64,0,0.1)";//sketch line(a <path>) fill color
    const sigBgFill = "transparent";//the elSig clone bg color
    const fps = 60;
    const duration = 0;//sign within `duration`

    // Main
    const draw = SVG("svg1");
    const grp = draw.group().attr("transform",elGrp.getAttribute("transform"));
    const path = grp.path(elSig.getAttribute("d")).fill(sigBgFill);
    const spf = Math.ceil(path.length()/stepSize/fps);//strokes per frame

    let i = 0;
    setTimeout(function f() {
      let n = 0;
      while (n++ <spf) {
        const a = path.pointAt(i);
        const b = path.pointAt(i+strideSize);
        const c = path.pointAt(i+strideSize*2);
        const d = path.pointAt(i+strideSize*3);
        const e = path.pointAt(i+strideSize*4);

        if (!isLonger(a,d,maxDist) || !isLonger(a,e,maxDist)) {
          grp.path(`M${a.x} ${a.y} C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y} 
      M${a.x-1} ${a.y+1} C${c.x} ${c.y} ${d.x} ${d.y} ${e.x} ${e.y}`)
            .fill(fillColor)
            .stroke({width:strokeWidth, color:strokeColor})
        }

        i += stepSize;
      }
      if (i < path.length()) {
        setTimeout(f, 1000/fps);             
      } else {
        path.fill('blue');
      }
    }, 10);


    function isLonger(a, b, x) {
      return Math.sqrt(Math.pow(a.x - b.x, 2), Math.pow(a.y - b.y, 2)) > x;
    } 
  }

  window.setTimeout(function(){
    doLogo();
  },1);

  function removeLogo(){
    $('#logo').css('transform','skewY(-90deg)');
    $('#logo').css('opacity','0');
  }

  window.setTimeout(function(){
    removeLogo();
  },4000);



});