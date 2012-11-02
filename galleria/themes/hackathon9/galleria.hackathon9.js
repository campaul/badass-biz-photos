(function($) {

/*global jQuery, Galleria */

Galleria.addTheme({
    name: 'hackathon9',
    author: 'Yelp',
    css: false, // We load the CSS manually in manifest.json
    defaults: {
        transition: 'fade',
        thumbCrop:  'height',
        imageCrop: false,
        maxScaleRatio: 1,
        responsive: true,
        carousel: false,

        // set this to false if you want to show the caption all the time:
        _toggleInfo: false,
        _bizName: '',
        _maxThumbs: 9
    },
    init: function(options) {

        Galleria.requires(1.28, 'This theme requires Galleria 1.2.8 or later');

        // keyboard events
        this.attachKeyboard({
            right: this.next,
            left: this.prev,
            escape: function() {
                $('#galleria').addClass('galleria-hidden');
            }
        });

        // add some elements
        this.addElement('info-link','info-close');
        this.append({
            'info' : ['info-link','info-close']
        });

        this.addElement('biz-info');
        this.$('biz-info').text( options._bizName );
        this.appendChild('container', 'biz-info');

        if ( this.getDataLength() > options._maxThumbs ) {
            this.addElement('thumbnails-more');
            var more = this.$('thumbnails-more');
            var thumb_container = this.$('thumbnails-container');
            more.bind('click', function() {
                thumb_container.toggleClass('expanded');
            });
            this.appendChild('thumbnails-container', 'thumbnails-more');
        }

        // Fake rating widget
        this.addElement('faux-rating');
        this.$('faux-rating').html([
            '<div class="rate-photo">',
                '<h3>Rate this Photo</h3>',
                '<label for="radio1">',
                    '<input id="radio1" name="rating" value="Helpful" type="radio">',
                    'Very Helpful',
                '</label><br>',
                '<label for="radio2">',
                    '<input id="radio2" name="rating" value="Helpful" type="radio">',
                    'Helpful',
                '</label><br>',
                '<label for="radio3">',
                    '<input id="radio3" name="rating" value="Not Helpful" type="radio">',
                    'Not Helpful',
                '</label>',
            '</div>'
        ].join(''));
        this.appendChild('thumbnails-container', 'faux-rating');

        // Fake ad
        this.addElement('faux-ad');
        this.$('faux-ad').text('300x250');
        this.appendChild('thumbnails-container', 'faux-ad');

        // Close button
        this.addElement('close');
        this.$('close').text('×').click(function() {
            $('#galleria').addClass('galleria-hidden');
        });
        this.appendChild('container', 'close');

        // cache some stuff
        var info = this.$('info-link,info-close,info-text'),
            touch = Galleria.TOUCH,
            click = touch ? 'touchstart' : 'click';

        // show loader & counter with opacity
        this.$('loader,counter').show().css('opacity', 0.4);

        // some stuff for non-touch browsers
        if (! touch ) {
            this.addIdleState( this.get('image-nav-left'), { left: -50 });
            this.addIdleState( this.get('image-nav-right'), { right: -50 });
            this.addIdleState( this.get('counter'), { opacity: 0 });
            this.addIdleState( this.get('info'), { bottom: -64 });
        }

        // toggle info
        if ( options._toggleInfo === true ) {
            info.bind( click, function() {
                info.toggle();
            });
        } else {
            info.show();
            this.$('info-link, info-close').hide();
        }

        // bind some stuff
        this.bind('thumbnail', function(e) {

            if (! touch ) {
                // fade thumbnails
                $(e.thumbTarget).css('opacity', 0.6).parent().hover(function() {
                    $(this).not('.active').children().stop().fadeTo(100, 1);
                }, function() {
                    $(this).not('.active').children().stop().fadeTo(400, 0.6);
                });

                if ( e.index === this.getIndex() ) {
                    $(e.thumbTarget).css('opacity',1);
                }
            } else {
                $(e.thumbTarget).css('opacity', this.getIndex() ? 1 : 0.6);
            }
        });

        this.bind('loadstart', function(e) {
            if (!e.cached) {
                this.$('loader').show().fadeTo(200, 0.4);
            }

            this.$('info').toggle( this.hasInfo() );

            $(e.thumbTarget).css('opacity',1).parent().siblings().children().css('opacity', 0.6);
        });

        this.bind('loadfinish', function(e) {
            this.$('loader').fadeOut(200);
        });
    }
});

}(jQuery));