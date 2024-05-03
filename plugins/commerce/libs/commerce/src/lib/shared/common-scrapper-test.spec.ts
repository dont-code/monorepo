import {HttpTestingController, TestRequest} from "@angular/common/http/testing";
import {AbstractOnlineShopScrapper} from "./online-shop-scrapper";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as fs from 'fs';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import * as Path from 'path';

describe('Common', () => {
  it('should support calling', (done) => {
    done();
  });
  });
export function expectOneSampleFile (sampleFileRelative:string, controller:HttpTestingController, matchProxyUrl=AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL): TestRequest {
  const searchCall = controller.expectOne(req => {
    if (req.url.startsWith(matchProxyUrl))
      return true;
    else
      return false;
  });
  const responseRead=fs.readFileSync(Path.join(__dirname,"../../../../../samples/",sampleFileRelative), {encoding:'utf-8'});
  searchCall.flush(responseRead);
  return searchCall;
}

export function waitForOneMatchSampleFile (sampleFileRelative:string, controller:HttpTestingController, done:jest.DoneCallback, matchProxyUrl=AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL):void {
  setTimeout(() => {
    const counter= 0;
    __isMatchRecursive(sampleFileRelative, controller, done, counter, matchProxyUrl);
  }, 100);
}

function __isMatchRecursive (sampleFileRelative:string, controller:HttpTestingController, done:jest.DoneCallback, counter:number, matchProxyUrl=AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL):void {
  const searchCall = controller.match(req => {
    if (req.url.startsWith(matchProxyUrl))
      return true;
    else
      return false;
  });
  if (searchCall!=null && searchCall.length>0) {
    if (searchCall.length==1) {
      const responseRead=fs.readFileSync(Path.join(__dirname,"../../../../../samples/",sampleFileRelative), {encoding:'utf-8'});
      searchCall[0].flush(responseRead);
      return;
    } else throw new Error("Multiple requests occured for sample file "+sampleFileRelative);
  }

  counter++;
  // Wait 5 s max
  if (counter<50) {
    setTimeout (()=> __isMatchRecursive(sampleFileRelative, controller, done, counter), 100);
  } else {
    done("No query created");
  }

}

export function expectMultipleSampleFile (sampleFileRelative:string, controller:HttpTestingController, matchProxyUrl=AbstractOnlineShopScrapper.CORS_DONTCODE_PROXY_URL): number {
  const searchCalls = controller.match(req => {
    if (req.url.startsWith(matchProxyUrl))
      return true;
    else
      return false;
  });
  const responseRead=fs.readFileSync(Path.join(__dirname,"../../../../../samples/",sampleFileRelative), {encoding:'utf-8'});
  for (const searchCall of searchCalls) {
    searchCall.flush(responseRead);
  }
  return searchCalls.length;
}

