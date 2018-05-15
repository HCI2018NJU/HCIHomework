function showAjaxLoading(text) {
    // let left = $(btn).offset().left;
    // let top = $(btn).offset().top;
    let width = window.innerWidth;
    let height = window.innerHeight;
    var opts = {
        lines: 13, // The number of lines to draw
        length: 38, // The length of each line
        width: 17, // The line thickness
        radius: 45, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#ffffff', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        opacity: 0.25, // Opacity of the lines
        rotate: 3, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: 'none', // Box-shadow for the lines
        position: 'absolute' // Element positioning
    };

    $('#ajax_spin').remove();
    $('body').append('<div id="ajax_spin" style="position:absolute;background:#333;filter:alpha(opacity=30);opacity:0.7"><div id="ajax_spin_inner" style="position:relative"></div><h1 style="color: white">'+text+'</h1></div>');
    $('#ajax_spin').css({
        'top': 0,
        'left': 0,
        'width': width,
        'height': height
    });
    $("#ajax_spin_inner").css({
        "margin-top":height/4,
        "height":height/3,
    });
    // $('#ajax_spin_')
    let target = document.getElementById('ajax_spin_inner');
    let spinner = new Spinner(opts).spin(target);
}
function stopAjaxLoading() {
    $('#ajax_spin').remove();
}