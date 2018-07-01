$(document).ready(function () {
  var sections = $('div.section').map(function(){ return $(this).attr('id'); });
  var colors = $('div.section').map(function(){ return $(this).attr('color'); });
  var menuNames = $('div.section').map(function(){ return $(this).attr('menu-name'); });

  // add top nav
  var topnav = '<ul id="menu">';
  for(var i=0; i<sections.length; i++){
    var active = i===0 ? ' class="active"' : ''; 
    topnav += '<li data-menuanchor="' + sections[i] + '"' +  active + '>';
    topnav += '<a href="#' + sections[i] + '"' +  active + '>' + menuNames[i] + '</a>';
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
      //console.log('callback after render');
    }

  });

  $("#logo").blast({
    delimiter: "letter"
  }).velocity("transition.fadeIn", {
    display: null,
    duration: 1500,
    stagger: 100,
    delay: 1000
  });

});