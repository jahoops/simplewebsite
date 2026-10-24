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
    afterLoad: function(anchorLink, index){
      clearAll();
      if(index == 2){
        doFlowers();
      }
      if(index == 4){
        doHearts();
      }
      if(index == 7){
        do3DText();
      }
		}

  });

  function doLogo() {
    const strideSize = 4.6; // dist to get point sample 
    const stepSize = 1.5; // iteration gap in userspace unit
    const maxDist = 100; // to skip strokes with looooooong length
    const strokeWidth = 0.098590522; //sketch line width; 
    const strokeColor = "rgba(64,0,0,0.9)"; //sketch color
    const fillColor = "rgba(0,64,0,0.1)"; //sketch line(a <path>) fill color
    const sigBgFill = "transparent"; //the elSig clone bg color
    const fps = 60;
    const duration = 0; //sign within `duration`

    // Main
    const draw = SVG("svg1");
    const grp = draw.group().attr("transform", elGrp.getAttribute("transform"));
    const path = grp.path(elSig.getAttribute("d")).fill(sigBgFill);
    const spf = Math.ceil(path.length() / stepSize / fps); //strokes per frame

    let i = 0;
    setTimeout(function f() {
      let n = 0;
      while (n++ < spf) {
        const a = path.pointAt(i);
        const b = path.pointAt(i + strideSize);
        const c = path.pointAt(i + strideSize * 2);
        const d = path.pointAt(i + strideSize * 3);
        const e = path.pointAt(i + strideSize * 4);

        if (!isLonger(a, d, maxDist) || !isLonger(a, e, maxDist)) {
          grp.path(`M${a.x} ${a.y} C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y} 
      M${a.x-1} ${a.y+1} C${c.x} ${c.y} ${d.x} ${d.y} ${e.x} ${e.y}`)
            .fill(fillColor)
            .stroke({
              width: strokeWidth,
              color: strokeColor
            })
        }

        i += stepSize;
      }
      if (i < path.length()) {
        setTimeout(f, 1000 / fps);
      } else {
        path.fill('blue');
      }
    }, 10);


    function isLonger(a, b, x) {
      return Math.sqrt(Math.pow(a.x - b.x, 2), Math.pow(a.y - b.y, 2)) > x;
    }
  }

  window.setTimeout(function () {
    doLogo();
  }, 1);

  var cyclewin = 7;
  var timerId = 0;

  function removeLogo() {
    $('#svg1').css('transform', 'skewY(-90deg)');
    $('#svg1').css('opacity', '0');
    timerId = window.setInterval(function () {
      //location.href = "#page" + cyclewin--;
      cyclewin--;
      if (cyclewin === 0) {
        $('#logo').remove();
      }
      if (cyclewin < 0) {
        clearInterval(timerId);
        dangleText();
        doButterflies();
        $.fn.pagepiling.moveTo(1);
      }
    }, 500);
  }

  window.setTimeout(function () {
    removeLogo();
  }, 6000);



});

