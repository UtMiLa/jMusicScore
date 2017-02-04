module JApps.Configuration {
    export enum ConfigurationType { ctFileManager, ctPlugin, ctValidator };

    export interface IConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> {
        type: ConfigurationType;
        installer(app: Application.AbstractApplication<TDocumentType, TStatusManager>): void;
        label: string;
        active: boolean;
    }

    export class PluginConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> implements IConfiguration<TDocumentType, TStatusManager> {
        public type = ConfigurationType.ctPlugin;
        public active: boolean = true;

        constructor(public label: string, private plugin: Application.IBuilder<Application.IPlugIn<TDocumentType, TStatusManager>>) {
        }

        installer(app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
            app.addPlugin(this.plugin());
        }
    }

    export class ValidatorConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> implements IConfiguration<TDocumentType, TStatusManager> {
        public type = ConfigurationType.ctValidator;
        public active: boolean = true;

        constructor(public label: string, private validator: Application.IBuilder<Application.IValidator<TDocumentType, TStatusManager>>) {
        }

        installer(app: Application.AbstractApplication<TDocumentType, TStatusManager>) {
            app.addValidator(this.validator());
        }
    }

    export class FileManagerConfiguration<TDocumentType extends JApps.Application.IAppDoc, TStatusManager extends JApps.Application.IStatusManager> implements IConfiguration<TDocumentType, TStatusManager> {
        public type = ConfigurationType.ctFileManager;
        public active: boolean = true;

        constructor(public label: string, private fileManager: Application.IBuilder<Application.IFileManager<TDocumentType, TStatusManager>>) {
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
        //protected plugins: Application.IBuilder<Application.IPlugIn<TDocumentType, TStatusManager>>[] = [];
        /*protected validators: Application.IBuilder<Application.IValidator<TDocumentType, TStatusManager>>[] = [];
        protected fileManagers: Application.IBuilder<Application.IFileManager<TDocumentType, TStatusManager>>[] = [];*/

        addConfiguration(configuration: IConfiguration<TDocumentType, TStatusManager>) {
            this.configurations.push(configuration);
        }

        /*addPlugin(label: string, plugin: Application.IBuilder<Application.IPlugIn<TDocumentType, TStatusManager>>) {
            this.plugins.push(plugin);
        }*/

        /*addValidator(label: string, validator: Application.IBuilder<Application.IValidator<TDocumentType, TStatusManager>>) {
            this.validators.push(validator);
        }

        addFileManager(label: string, fileManager: Application.IBuilder<Application.IFileManager<TDocumentType, TStatusManager>>) {
            this.fileManagers.push(fileManager);
        }
        */
        apply() {
            for (var i = 0; i < this.configurations.length; i++) {
                var configuration = this.configurations[i];
                configuration.installer(this.app);
            }/*
            for (var i = 0; i < this.validators.length; i++) {
                var validator = this.validators[i];
                this.app.addValidator(validator());
            }
            for (var i = 0; i < this.plugins.length; i++) {
                var plugin = this.plugins[i];
                this.app.addPlugin(plugin());
            }
            for (var i = 0; i < this.fileManagers.length; i++) {
                var fileManager = this.fileManagers[i];
                this.app.addFileManager(fileManager());
            }*/
        }
    }
    
}