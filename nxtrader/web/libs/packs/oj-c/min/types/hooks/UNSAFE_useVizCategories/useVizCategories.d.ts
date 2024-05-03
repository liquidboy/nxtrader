export declare function useVizCategories<K extends string | number>(categoriesItems: any[], getCategoriesFromItem: (item: any) => string[], hiddenCategories?: string[], highlightedCategories?: string[], highlightMatch?: 'any' | 'all', hiddenMatch?: 'any' | 'all', onHiddenCategoriesChanged?: (category: string[]) => void, onHighlightedCategoriesChanged?: (category: string[]) => void): {
    hiddenIds: K[];
    updateHidden: (id: K | undefined) => void;
    highlightedIds: K[];
    updateHighlighted: (id: K | undefined) => void;
};
