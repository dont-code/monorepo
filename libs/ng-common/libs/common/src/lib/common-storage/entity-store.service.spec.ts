import { TestBed } from '@angular/core/testing';

import { EntityStoreService } from './entity-store.service';
import {PluginCommonModule} from '../plugin-common.module';

describe('EntityStoreService', () => {
  let service: EntityStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[PluginCommonModule.forRoot()]});
    service = TestBed.inject(EntityStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
