declare module JApps {
    module Ui {
        interface IWidget {
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        interface IContainer {
            addWidget(widget: IWidget, id: string, label: string): IWidget;
            $container: JQuery;
        }
        class UiContainer<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> {
            idPrefix: string;
            app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>;
            constructor(idPrefix: string, app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>);
            $container: JQuery;
            addWidget(widget: IWidget, id: string, label: string): IWidget;
        }
        interface IButtonSettings {
            id: string;
            text: string;
            click: () => void;
        }
        interface IMenuDef {
            id: string;
            menu?: IMenuDef[];
            caption: string;
            action?: () => void;
        }
        class MenuPlugin<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> implements JApps.Application.IPlugIn<TDocumentType, TStatusManager> {
            init(app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>): void;
            private app;
            getId(): string;
            getMenuObj(app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>): IMenuDef;
            private menuAddItem(e);
            private menuSubMenu(e);
        }
        class Dialog<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> extends UiContainer<TDocumentType, TStatusManager> {
            idPrefix: string;
            app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>;
            constructor(idPrefix: string, app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>);
            private $dialog;
            dialogId: string;
            dialogTitle: string;
            width: number;
            height: number;
            buttonSettings: IButtonSettings[];
            dialogObject: JQuery;
            createDialogElement(): void;
            createBodyElements($element: JQuery): void;
            open(): void;
            show(): void;
            onOk(): boolean;
            onCancel(): void;
            onCreate(): void;
            onInit(): void;
            onOpen(): void;
            addDialog(): void;
        }
        class CheckboxWidget implements IWidget {
            private $check;
            value: boolean;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class DropdownWidget implements IWidget {
            values: {
                [index: string]: string;
            };
            constructor(values: {
                [index: string]: string;
            });
            private $ctl;
            value: string;
            setOptions(items: Array<any>): void;
            change(f: () => void): void;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class DisplayTextWidget implements IWidget {
            constructor();
            private $ctl;
            value: string;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class CollectionWidget implements IWidget {
            constructor();
            private $ctl;
            value: string;
            addItem(item: IContainer): void;
            withItems(f: (item: IContainer, index: number) => boolean): void;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class SpinnerWidget implements IWidget {
            private $spinner;
            value: number;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class TextEditWidget implements IWidget {
            private $textEdit;
            value: string;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class FileDialog<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> extends Dialog<TDocumentType, TStatusManager> {
            idPrefix: string;
            app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>;
            constructor(idPrefix: string, app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>);
            private sourceWidget;
            private fileListWidget;
            private fileTypeWidget;
            onOk(): boolean;
            onInit(): void;
            filename: string;
            source: string;
            fileFormat: string;
            existsInFileList(name: string): boolean;
            createBodyElements($element: JQuery): void;
        }
        class OpenFileDialog<DocumentType extends JApps.Application.IAppDoc, StatusManager extends JApps.Application.IStatusManager> extends FileDialog<DocumentType, StatusManager> {
            idPrefix: string;
            app: JApps.Application.AbstractApplication<DocumentType, StatusManager>;
            constructor(idPrefix: string, app: JApps.Application.AbstractApplication<DocumentType, StatusManager>);
            onOk(): boolean;
        }
        class SaveFileDialog<DocumentType extends JApps.Application.IAppDoc, StatusManager extends JApps.Application.IStatusManager> extends FileDialog<DocumentType, StatusManager> {
            idPrefix: string;
            app: JApps.Application.AbstractApplication<DocumentType, StatusManager>;
            constructor(idPrefix: string, app: JApps.Application.AbstractApplication<DocumentType, StatusManager>);
            onOk(): boolean;
            private fileNameWidget;
            filename: string;
            createBodyElements($element: JQuery): void;
        }
        interface IAction {
            getCaption(): string;
            getImageUri(): string;
            getSvg(): string;
            getIndex(): number;
            getId(): string;
            getParentId(): string;
            checkEnabled(): void;
        }
        class RadioActionGroup {
            getId(): string;
        }
        class RadioAction {
        }
    }
}
declare module JMusicScore {
    module Ui {
        class FileMenuPlugin extends JApps.Ui.MenuPlugin<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor();
            getMenuObj(app: JApps.Application.AbstractApplication<Model.IScore, ScoreApplication.ScoreStatusManager>): JApps.Ui.IMenuDef;
        }
        class KeyWidget implements JApps.Ui.IWidget {
            constructor();
            private values;
            private val;
            private $button;
            value: string;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class TimeWidget implements JApps.Ui.IWidget {
            private $spinner;
            value: number;
            addTo(parent: JQuery, id: string, label: string): JQuery;
        }
        class ScoreDialog extends JApps.Ui.Dialog<Model.IScore, ScoreApplication.ScoreStatusManager> {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class MeterDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
            height: number;
            private numCtl;
            private denCtl;
            private upbCtl;
            private absTime;
            onOk(): boolean;
            setTime(absTime: Model.AbsoluteTime): MeterDialog;
            setMeter(definition: Model.IMeterDefinition): MeterDialog;
            createBodyElements($element: JQuery): void;
        }
        class KeyDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
            private absTime;
            private keyCtl;
            onOk(): boolean;
            setTime(absTime: Model.AbsoluteTime): KeyDialog;
            setKey(key: Model.IKey): KeyDialog;
            createBodyElements($element: JQuery): void;
        }
        class ClefDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
            private clefWidget;
            private lineWidget;
            private transposeWidget;
            private absTime;
            private staff;
            onOk(): boolean;
            setTime(absTime: Model.AbsoluteTime): ClefDialog;
            setStaff(staff: Model.IStaff): ClefDialog;
            setClef(clef: Model.IClef): ClefDialog;
            createBodyElements($element: JQuery): void;
        }
        class BarDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class ArticulationDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class NoteDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
            private stemDirCtl;
            private note;
            createBodyElements($element: JQuery): void;
            setNote(note: Model.INote): NoteDialog;
            onOk(): boolean;
        }
        class VoiceDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
            private stemDirCtl;
            private voice;
            createBodyElements($element: JQuery): void;
            setVoice(voice: Model.IVoice): VoiceDialog;
            onOk(): boolean;
        }
        class NoteheadDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class ScoreInfoDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class LyricDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class TupletDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class SpannerDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class TextMarkDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
        }
        class ShowTextDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
            private textDivCtl;
            createBodyElements($element: JQuery): void;
            setText(text: string): ShowTextDialog;
            onOk(): boolean;
        }
        class StavesDialog extends ScoreDialog {
            idPrefix: string;
            app: ScoreApplication.IScoreApplication;
            constructor(idPrefix: string, app: ScoreApplication.IScoreApplication);
            private stavesWidget;
            onOk(): boolean;
            show(): void;
            createBodyElements($element: JQuery): void;
        }
        class QuickMenuPlugin extends JApps.Ui.MenuPlugin<Model.IScore, ScoreApplication.ScoreStatusManager> {
            private id;
            private menuCaption;
            private parentId;
            private parentCaption;
            private menuAction;
            constructor(id: string, menuCaption: string, parentId: string, parentCaption: string, menuAction: () => void);
            getMenuObj(app: ScoreApplication.IScoreApplication): JApps.Ui.IMenuDef;
        }
        class VoiceMenuPlugin extends QuickMenuPlugin {
            constructor(app: ScoreApplication.IScoreApplication);
        }
        class StavesMenuPlugin extends QuickMenuPlugin {
            constructor(app: ScoreApplication.IScoreApplication);
        }
        class ExportMenuPlugin extends JApps.Ui.MenuPlugin<Model.IScore, ScoreApplication.ScoreStatusManager> {
            constructor();
            getMenuObj(app: ScoreApplication.IScoreApplication): JApps.Ui.IMenuDef;
        }
        interface IToolBtnDef {
            id: string;
            label: string;
            glyph: string;
            mode?: ScoreApplication.IScoreEventProcessor;
            onChecked?: (button: HTMLInputElement, app: ScoreApplication.IScoreApplication) => void;
            validate?: (app: ScoreApplication.IScoreApplication) => boolean;
        }
        interface IToolDef {
            type: string;
            name?: string;
            id: string;
            buttons?: IToolBtnDef[];
        }
        class JToolbar {
            private app;
            constructor(app: ScoreApplication.IScoreApplication);
            static menuDef: IToolDef[];
            unregisterModes(): void;
            private makeMenu(id, def);
        }
        class ToolbarPlugin implements ScoreApplication.IScorePlugin {
            constructor();
            private toolbar;
            getToolbar(): JToolbar;
            init(app: ScoreApplication.IScoreApplication): void;
            getId(): string;
        }
        class PianoPlugIn implements ScoreApplication.IScorePlugin, JApps.Application.IFeedbackClient {
            init(app: ScoreApplication.IScoreApplication): void;
            changed(status: JApps.Application.IStatusManager, key: string, val: any): void;
            private createPianoKeyboard($root, param, app);
            getId(): string;
        }
    }
}
