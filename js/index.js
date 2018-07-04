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

  $("#logo").blast({
    delimiter: "letter"
  }).velocity("transition.fadeIn", {
    display: null,
    duration: 1500,
    stagger: 100,
    delay: 1000
  });

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

});