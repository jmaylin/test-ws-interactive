var customScrollbarInitiated = false;
require('malihu-custom-scrollbar-plugin')($);

var arrayScroll = {};

var customScrollbar = {
  initScrollbar: function() {
    $('.scrollable').each(function() {
      var $this = $(this);
      if(!$this.data('customScrollbarInitiated')) {
        $(this).css('height', '');
        var rect = this.getBoundingClientRect();
        var maxHeight = $(window).height() - $(this).offset().top;
        if($this.data('scrolloffset')) {
          maxHeight = maxHeight - $this.data('scrolloffset');
        }
        var currentHeight = rect.bottom - rect.top;
        var scrollBarNeeded = currentHeight >= maxHeight;
          arrayScroll[$(this).attr('id')] = $(this);
        if(scrollBarNeeded) {
          $(this).mCustomScrollbar({
            axis: 'y',
            scrollbarPosition: 'inside',
            setHeight: maxHeight,
            mouseWheel: { enable: true },
            advance: {updateOnImageLoad: false},
            theme: 'inset-3',
            scrollInertia: 10
          });
          $(this).css('height', maxHeight + 'px');
          if($this.data('scrollclass')) {
            $this.addClass($this.data('scrollclass'));
          }
        }
      }
    });
  },
  destroyScrollbar: function() {
    $.fn.mCustomScrollbar('destroy');
  },
  refreshScrollbar: function() {
    $.fn.mCustomScrollbar('update');
    if(!customScrollbarInitiated) {
      customScrollbar.initScrollbar();
    }
  },
  scrollTo: function(position, options, id) {
    var d = arrayScroll[id];
    d.mCustomScrollbar('scrollTo', position, options);
  }
};

module.exports = customScrollbar;
