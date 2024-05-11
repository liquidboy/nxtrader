define(["require", "exports", "@oracle/oraclejet-preact/hooks/UNSAFE_useCategories"], function (require, exports, UNSAFE_useCategories_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useVizCategories = void 0;
    function useVizCategories(categoriesItems, getCategoriesFromItem, hiddenCategories, highlightedCategories, highlightMatch = 'all', hiddenMatch = 'any', onHiddenCategoriesChanged, onHighlightedCategoriesChanged) {
        const { ids: hiddenIds, updateCategories: updateHidden } = (0, UNSAFE_useCategories_1.useCategories)(categoriesItems, getCategoriesFromItem, hiddenCategories, hiddenMatch, false, onHiddenCategoriesChanged);
        const { ids: highlightedIds, updateCategories: updateHighlighted } = (0, UNSAFE_useCategories_1.useCategories)(categoriesItems, getCategoriesFromItem, highlightedCategories, highlightMatch, true, onHighlightedCategoriesChanged);
        return {
            hiddenIds,
            updateHidden,
            highlightedIds,
            updateHighlighted
        };
    }
    exports.useVizCategories = useVizCategories;
});
