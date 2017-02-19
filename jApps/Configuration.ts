module JApps.Configuration {
    export enum ConfigurationType { ctFileManager, ctPlugin, ctValidator };

    export interface IConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> {
        type: ConfigurationType;
        installer(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void;
        label: string;
        active: boolean;
    }

    export interface IPluginClass<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> {
        new (): Application.IPlugIn<TDocumentType, TStatusManager>;
    }
    export class PluginConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> implements IConfiguration<TDocumentType, TStatusManager> {
        public type = ConfigurationType.ctPlugin;
        public active: boolean = true;
        private plugin: Application.IBuilder<Application.IPlugIn<TDocumentType, TStatusManager>>;

        constructor(label: string, x: Application.IBuilder<Application.IPlugIn<TDocumentType, TStatusManager>>);
        constructor(label: string, x: IPluginClass<TDocumentType, TStatusManager>);
        constructor(public label: string, x: any) {
            if (typeof (x) === "object") {
                this.plugin = x;
            }
            else {
                this.plugin = MakeBuilder.make<Application.IPlugIn<TDocumentType, TStatusManager>>(x);
            }
        }

        installer(app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
            app.addPlugin(this.plugin());
        }
    }

    export interface IValidatorClass<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> {
        new (): Application.IValidator<TDocumentType, TStatusManager>;
    }
    export class ValidatorConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> implements IConfiguration<TDocumentType, TStatusManager> {
        public type = ConfigurationType.ctValidator;
        public active: boolean = true;

        private validator: Application.IBuilder<Application.IValidator<TDocumentType, TStatusManager>>;

        constructor(label: string, x: Application.IBuilder<Application.IValidator<TDocumentType, TStatusManager>>);
        constructor(label: string, x: IValidatorClass<TDocumentType, TStatusManager>);
        constructor(public label: string, x: any) {
            if (typeof (x) === "object") {
                this.validator = x;
            }
            else {
                this.validator = MakeBuilder.make<Application.IValidator<TDocumentType, TStatusManager>>(x);
            }
        }

        installer(app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
            app.addValidator(this.validator());
        }
    }

    export interface IFileManagerClass<TDocumentType extends Application.IAppDoc, TStatusManager extends Application.IStatusManager> {
        new (): Application.IFileManager<TDocumentType, TStatusManager>;
    }
    export class FileManagerConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> implements IConfiguration<TDocumentType, TStatusManager> {
        public type = ConfigurationType.ctFileManager;
        public active: boolean = true;

        private fileManager: Application.IBuilder<Application.IFileManager<TDocumentType, TStatusManager>>;

        constructor(label: string, x: Application.IBuilder<Application.IFileManager<TDocumentType, TStatusManager>>);
        constructor(label: string, x: IFileManagerClass<TDocumentType, TStatusManager>);
        constructor(public label: string, x: any) {
            if (typeof (x) === "object") {
                this.fileManager = x;
            }
            else {
                this.fileManager = MakeBuilder.make<Application.IFileManager<TDocumentType, TStatusManager>>(x);
            }
        }

        installer(app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
            app.addFileManager(this.fileManager());
        }
    }

    export class MakeBuilder {
        static make<T>(type): Application.IBuilder<T> {
            return function () { return new type }
        }
    }
    export class ConfigurationManager<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> {
        constructor(public app: JApps.Application.AbstractApplication<TDocumentType, TStatusManager>) { }

        protected configurations: IConfiguration<TDocumentType, TStatusManager>[] = [];

        addConfiguration(configuration: IConfiguration<TDocumentType, TStatusManager>) {
            this.configurations.push(configuration);
        }
        
        disableConfiguration(id: string) {
            for (var i = 0; i < this.configurations.length; i++) {
                var configuration = this.configurations[i];
                if (configuration.label === id) configuration.active = false;
            }
        }

        enableConfiguration(id: string) {
            for (var i = 0; i < this.configurations.length; i++) {
                var configuration = this.configurations[i];
                if (configuration.label === id) configuration.active = true;
            }
        }

        apply() {
            for (var i = 0; i < this.configurations.length; i++) {
                var configuration = this.configurations[i];
                if (configuration.active)
                    configuration.installer(this.app);
            }
        }
    }
    
}