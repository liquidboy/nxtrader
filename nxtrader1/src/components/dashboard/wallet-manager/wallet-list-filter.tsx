import { useComputed, useSignalEffect } from "@preact/signals";
import { selectedTags, tagsAsArray } from "./wallet-manager";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { saveSelectedTagsToStorage } from "./wallet-lib";

type Props = Readonly<{
    
}>;

export function WalletListFilter({} : Props) {
    console.log("wallet-list-filter > render", tagsAsArray.value);
    const tagsDP = new ArrayDataProvider<string, {name: string}>(tagsAsArray.value, {
        keyAttributes: "name",
    });
    return(<div style="width: 90%">
        <oj-select-many labelHint="filter wallets by tags :" labelEdge="inside" 
            options={tagsDP} 
            value={selectedTags.value}
            onvalueChanged={(item)=>{
                if(item.detail.updatedFrom==="internal"){
                    console.log("wallet-list-filter > onvalueChanged", item.detail.updatedFrom, item.detail.previousValue, item.detail.value);
                    selectedTags.value = item.detail.value;
                    saveSelectedTagsToStorage(item.detail.value);
                }
            }}>
        </oj-select-many>
    </div>);
}