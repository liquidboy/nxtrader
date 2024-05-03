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
import Context = require("ojs/ojcontext");
import "dashboard/babylonjs-viewer/loader";

type Props = Readonly<{
  version?: string;
}>;

export const App = registerCustomElement(
  "app-root",
  ({ version = "1.0.0" }: Props) => {
    useEffect(() => {
      Context.getPageContext().getBusyContext().applicationBootstrapComplete();
    }, []);
    
    return (
      <div id="appContainer" class="oj-flex">
        <dashboard-babylonjs-viewer class="oj-flex-item"></dashboard-babylonjs-viewer>
      </div>
    );
  }
);
