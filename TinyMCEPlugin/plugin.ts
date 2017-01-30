declare var tinymce: any;


tinymce.PluginManager.add('jmusicscore', function (editor, url) {
    // Add a button that opens a window
    editor.addButton('jmusicscore', {
        text: 'My button',
        icon: false,
        onclick: function () {
            // Open window
            editor.windowManager.open({
                title: 'Example plugin',
                body: [
                    { type: 'textbox', name: 'title', label: 'Title' }
                ],
                onsubmit: function (e) {
                    // Insert content when the window form is submitted
                    editor.insertContent('Title: ' + e.data.title);
                }
            });
        }
    });

    editor.on('Change', function (e) {
        console.log(e.level.content);
    });

    // Adds a menu item to the tools menu
    editor.addMenuItem('jmusicscore', {
        text: 'Example plugin',
        context: 'tools',
        onclick: function () {
            // Open window with a specific url
            editor.windowManager.open({
                title: 'TinyMCE site',
                url: 'http://www.tinymce.com',
                width: 800,
                height: 600,
                buttons: [{
                    text: 'Close',
                    onclick: 'close'
                }]
            });
        }
    });
});
