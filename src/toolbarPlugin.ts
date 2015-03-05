module jMusicScore {
    /*export = ToolbarPlugin;

import UI = require('../views/jtools');
*/
    export class ToolbarPlugin implements ScoreApplication.ScorePlugin {
        constructor() {
        }

        private toolbar: UI.JToolbar;

        public GetToolbar(): UI.JToolbar {
            return this.toolbar;
        }

        Init(app: ScoreApplication.ScoreApplication) {
            //var outputPlugin = <any>app.GetPlugin("Output");
            this.toolbar = new UI.JToolbar(app);
            //app.AddDesigner(new Model.EditorDesigner(outputPlugin.context));
        }

        GetId(): string {
            return "Toolbar";
        }
    }
}