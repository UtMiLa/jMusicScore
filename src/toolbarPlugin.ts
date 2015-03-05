module jMusicScore {
    /*export = ToolbarPlugin;

import UI = require('../views/jtools');
*/
    export class ToolbarPlugin implements Application.IPlugIn {
        constructor() {
        }

        private toolbar: UI.JToolbar;

        public GetToolbar(): UI.JToolbar {
            return this.toolbar;
        }

        Init(app: Application.Application) {
            //var outputPlugin = <any>app.GetPlugin("Output");
            this.toolbar = new UI.JToolbar(app);
            //app.AddDesigner(new Model.EditorDesigner(outputPlugin.context));
        }

        GetId(): string {
            return "Toolbar";
        }
    }
}