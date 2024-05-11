import { ListViewProps } from './list-view';
export declare const useListViewPreact: <K extends string | number, D>({ "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, data: propData, gridlines, onCurrentItemChanged, selectionMode, selected, scrollPolicyOptions, onSelectedChanged, onOjItemAction }: Partial<ListViewProps<K, D>>, addBusyState: (desc?: string) => () => void, isClickthroughDisabled: (target: EventTarget | null) => boolean) => {
    status: "loading" | "error" | "success";
    listViewProps: Pick<import("@oracle/oraclejet-preact/UNSAFE_ListView").Props<string | number, unknown>, "children" | "aria-label" | "aria-labelledby" | "selectionMode" | "onItemAction" | "currentKey" | "currentItemVariant" | "gridlines" | "onCurrentKeyChange" | "onSelectionChange" | "promotedSection" | "selectedKeys" | "viewportConfig"> & {
        data: unknown[] | null;
        getRowKey: (data: unknown) => string | number;
        hasMore?: boolean | undefined;
        onLoadMore?: (() => void) | undefined;
    };
};
