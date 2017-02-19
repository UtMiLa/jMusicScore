declare var CKEDITOR: any;


CKEDITOR.plugins.add('jmusic', {
    requires: 'widget',

    icons: 'jmusic',

    init: function (editor) {
        // Plugin logic goes here...
        editor.widgets.add('jmusic', {
            button: 'Create music',

            template:
            '<div class="jmusic">' +
            '<h2 class="jmusic-title">Title</h2>' +
            '<div class="jmusic-content"><p>c\'4 d e c c d e c e f g2 e f g2 </p></div>' +
            '</div>',

            editables: {
                title: {
                    selector: '.jmusic-title'
                },
                content: {
                    selector: '.jmusic-content'
                }
            }
        });
    }
}); 