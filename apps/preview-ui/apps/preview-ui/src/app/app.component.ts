import {ChangeDetectorRef, Component, Inject, Injector, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {
  BaseAppComponent,
  ChangeListenerService,
  ChangeProviderService,
  GlobalPluginLoader,
  IndexedDbStorageService,
  RemotePluginLoaderService
} from '@dontcode/sandbox';
import {environment} from '../environments/environment';
import {CommonConfigService, ComponentLoaderService, DONT_CODE_CORE} from "@dontcode/plugin-common";
import {Core, DontCodeModelManager, DontCodePreviewManager, DontCodeStoreManager} from "@dontcode/core";
import { HttpClient } from '@angular/common/http';
import { SandboxRepositorySchema } from '@dontcode/sandbox';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'preview-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseAppComponent implements OnInit {
  testMode = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    pluginLoader: RemotePluginLoaderService,
    provider: ChangeProviderService,
    storage:IndexedDbStorageService,
    listener:ChangeListenerService,
    globalPluginLoader:GlobalPluginLoader,
    loaderService: ComponentLoaderService,
    changeProviderService: ChangeProviderService,
    configService: CommonConfigService,
    httpClient: HttpClient,
    injector:Injector,
    ref: ChangeDetectorRef,
    @Inject(DONT_CODE_CORE)
    dontCodeCore: Core,
    modelMgr:DontCodeModelManager,
    storeMgr:DontCodeStoreManager,
    previewMgr:DontCodePreviewManager
  ) {
    super(provider, storage, listener, pluginLoader, globalPluginLoader, loaderService, changeProviderService, configService, httpClient, injector
    ,ref, dontCodeCore, modelMgr, storeMgr, previewMgr );

    this.defaultRepositoryUrl='assets/repositories/stable.json';
      // Manages the different cases of loading the repository of plugins
    this.runtimeConfig = (window as any).dontCodeConfig;
    if ((this.runtimeConfig!=null) && (this.runtimeConfig?.repositoryUrl==null)) {
      this.runtimeConfig.repositoryUrl=environment.repositoryUrl;
    }
  }

  override ngOnInit(): void {
    this.primengConfig.ripple = true;
    super.ngOnInit();

  }

  override afterInitialization(config: SandboxRepositorySchema, repositoryUrl:string): Promise<void> {
    return super.afterInitialization(config, repositoryUrl).then (() => {
      // Check if we need to load a project ?
      const projectToLoad = this.runtimeConfig.projectId;
      if (projectToLoad) {
        this.listener.loadProject(projectToLoad).then((project) => {
          console.log('Loaded project ', project.name);
        });
      }
    });
  }

}
