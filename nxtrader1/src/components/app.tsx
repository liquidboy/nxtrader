/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { registerCustomElement } from "ojs/ojvcomponent";
import { h } from "preact";
import { useEffect } from "preact/hooks";
//import Context = require("ojs/ojcontext");
import { Content } from "./content/index";
import * as Context from "ojs/ojcontext";
import indexDbService from "dashboard/flamingo-api/indexdb/indexDbService";

type Props = Readonly<{
  appName?: string;
}>;

export const App = registerCustomElement(
  "app-root",
  ({ appName = "App Name" }: Props) => {
    useEffect(() => {
      indexDbService.bootstrapOfflineStorage(true, ()=>{});
      Context.getPageContext().getBusyContext().applicationBootstrapComplete();
    }, []);
    
    return (
      <div id="appContainer" class="oj-web-applayout-page">
        <Content />
      </div>
    );
  }
);
