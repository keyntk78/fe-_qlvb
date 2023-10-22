// translations.js
import { useTranslation } from 'react-i18next';

const useLocalText = () => {
  const { t } = useTranslation();

  const dataGridText = {
    noRowsLabel: t('noRowsLabel'),
    noResultsOverlayLabel: t('noResultsOverlayLabel'),
    toolbarDensity: t('toolbarDensity'),
    toolbarDensityLabel: t('toolbarDensityLabel'),
    toolbarDensityCompact: t('toolbarDensityCompact'),
    toolbarDensityStandard: t('toolbarDensityStandard'),
    toolbarDensityComfortable: t('toolbarDensityComfortable'),
    toolbarColumns: t('toolbarColumns'),
    toolbarColumnsLabel: t('toolbarColumnsLabel'),
    toolbarFilters: t('toolbarFilters'),
    toolbarFiltersLabel: t('toolbarFiltersLabel'),
    toolbarFiltersTooltipHide: t('toolbarFiltersTooltipHide'),
    toolbarFiltersTooltipShow: t('toolbarFiltersTooltipShow'),
    toolbarQuickFilterPlaceholder: t('toolbarQuickFilterPlaceholder'),
    toolbarQuickFilterLabel: t('toolbarQuickFilterLabel'),
    toolbarQuickFilterDeleteIconLabel: t('toolbarQuickFilterDeleteIconLabel'),
    toolbarExport: t('toolbarExport'),
    toolbarExportLabel: t('toolbarExportLabel'),
    toolbarExportCSV: t('toolbarExportCSV'),
    toolbarExportPrint: t('toolbarExportPrint'),
    toolbarExportExcel: t('toolbarExportExcel'),
    columnsPanelTextFieldLabel: t('columnsPanelTextFieldLabel'),
    columnsPanelTextFieldPlaceholder: t('columnsPanelTextFieldPlaceholder'),
    columnsPanelDragIconLabel: t('columnsPanelDragIconLabel'),
    columnsPanelShowAllButton: t('columnsPanelShowAllButton'),
    columnsPanelHideAllButton: t('columnsPanelHideAllButton'),
    filterPanelAddFilter: t('filterPanelAddFilter'),
    filterPanelDeleteIconLabel: t('filterPanelDeleteIconLabel'),
    filterPanelLogicOperator: t('filterPanelLogicOperator'),
    filterPanelOperatorAnd: t('filterPanelOperatorAnd'),
    filterPanelOperatorOr: t('filterPanelOperatorOr'),
    filterPanelColumns: t('filterPanelColumns'),
    filterPanelOperators: t('filterPanelOperators'),
    filterPanelInputLabel: t('filterPanelInputLabel'),
    filterPanelInputPlaceholder: t('filterPanelInputPlaceholder'),
    filterOperatorContains: t('filterOperatorContains'),
    filterOperatorEquals: t('filterOperatorEquals'),
    filterOperatorStartsWith: t('filterOperatorStartsWith'),
    filterOperatorEndsWith: t('filterOperatorEndsWith'),
    filterOperatorIs: t('filterOperatorIs'),
    filterOperatorNot: t('filterOperatorNot'),
    filterOperatorAfter: t('filterOperatorAfter'),
    filterOperatorOnOrAfter: t('filterOperatorOnOrAfter'),
    filterOperatorBefore: t('filterOperatorBefore'),
    filterOperatorOnOrBefore: t('filterOperatorOnOrBefore'),
    filterOperatorIsEmpty: t('filterOperatorIsEmpty'),
    filterOperatorIsNotEmpty: t('filterOperatorIsNotEmpty'),
    filterOperatorIsAnyOf: t('filterOperatorIsAnyOf'),
    filterValueAny: t('filterValueAny'),
    filterValueTrue: t('filterValueTrue'),
    filterValueFalse: t('filterValueFalse'),
    columnMenuLabel: t('columnMenuLabel'),
    columnMenuShowColumns: t('columnMenuShowColumns'),
    columnMenuFilter: t('columnMenuFilter'),
    columnMenuHideColumn: t('columnMenuHideColumn'),
    columnMenuUnsort: t('columnMenuUnsort'),
    columnMenuSortAsc: t('columnMenuSortAsc'),
    columnMenuSortDesc: t('columnMenuSortDesc'),
    columnHeaderFiltersLabel: t('columnHeaderFiltersLabel'),
    columnHeaderSortIconLabel: t('columnHeaderSortIconLabel'),
    footerTotalRows: t('footerTotalRows'),
    checkboxSelectionHeaderName: t('checkboxSelectionHeaderName'),
    checkboxSelectionSelectAllRows: t('checkboxSelectionSelectAllRows'),
    checkboxSelectionUnselectAllRows: t('checkboxSelectionUnselectAllRows'),
    checkboxSelectionSelectRow: t('checkboxSelectionSelectRow'),
    checkboxSelectionUnselectRow: t('checkboxSelectionUnselectRow'),
    booleanCellTrueLabel: t('booleanCellTrueLabel'),
    booleanCellFalseLabel: t('booleanCellFalseLabel'),
    actionsCellMore: t('actionsCellMore'),
    pinToLeft: t('pinToLeft'),
    pinToRight: t('pinToRight'),
    unpin: t('unpin'),
    treeDataGroupingHeaderName: t('treeDataGroupingHeaderName'),
    treeDataExpand: t('treeDataExpand'),
    treeDataCollapse: t('treeDataCollapse'),
    groupingColumnHeaderName: t('groupingColumnHeaderName'),
    detailPanelToggle: t('detailPanelToggle'),
    expandDetailPanel: t('expandDetailPanel'),
    collapseDetailPanel: t('collapseDetailPanel'),
    rowReorderingHeaderName: t('rowReorderingHeaderName'),
  };

  const paginationText = {
    MuiTablePagination: {
      labelRowsPerPage: t('rowsPerPageLabel'),
      labelDisplayedRows: ({ from, to, count }) =>
        `${from} - ${to} ${t('paginationOf')} ${count}`,
    },
  };

  const localeText = {
    ...dataGridText,
    ...paginationText,
  };

  return localeText;
};

export default useLocalText;
