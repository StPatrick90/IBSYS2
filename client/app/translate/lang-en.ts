/**
 * Created by Paddy on 26.10.2016.
 */
export const LANG_EN_NAME = 'en';

export const LANG_EN_TRANS = {

//Sidebar
    'sidebar_readXML': 'Read XML',
    'sidebar_taskPlanning': 'Task planning',
    'sidebar_task': 'Tasks',
    'sidebar_forecast': 'Forecast',
    'sidebar_productView': 'Product view',
    'sidebar_materialPlanning': 'Material planning',
    'sidebar_capacityPlanning': 'Capacity planning',
    'sidebar_prio': 'Prioritization',
    'sidebar_overview': 'Overview',
    'sidebar_history': 'History',
    'sidebar_ordersWork': 'Orders in work.',
    'sidebar_waitingWorkst': 'Waiting list workst.',
    'sidebar_warehouseStock': 'Warehouse stock',
    'sidebar_settings': 'Settings',
    'sidebar_workstations': 'Workstations',
    'sidebar_partsLists': 'Parts lists',
    'sidebar_parts': 'Parts',
    'sidebar_dashboard': 'Dashboard',
    'sideBar_MaterialPlanningEP': 'Mat. pl. (f/sf prod.)',
    'sideBar_PartUsage': 'Part usage',

//Headbar
    'headbar_languages': 'Languages',
    'headbar_german': 'German',
    'headbar_english': 'English',

//Dashboard
    'dashboard_danger': 'Danger',
    'dashboard_warning': 'Warning',
    'dashboard_good': 'Good',
    'dashboard_critical': 'Critical',
    'dashboard_configuration': 'Configuration',
    'dashboard_types': 'Types',
    'dashboard_onoff': 'On / Off',
    'dashboard_20%capacity': 'Less than 20% in the warehouse!',
    'dashboard_article': 'Article',
    'dashboard_value': 'Value',

    'dashboard_warehouse_crit': 'Warhousestock is very low! The value is under ',
    'dashboard_warehouse_warn': 'Warhousestock is low! The value is under ',
    'dashboard_warehouse_good': 'Warehousstock is full filled! Over ',

    'dashboard_deliveryreliabiliy_bad': 'Your delivery reliability is under ',
    'dashboard_deliveryreliabiliy_good': 'Delivery reliability is',

//CapacityPlanning
    'capacity_workstations': 'Workstations',
    'capacity_parts': 'Parts',
    'capacity_amount': 'Amount',
    'capacity_planning': 'Capacity Planning',
    'capacity_requirements': 'Capacity requirements (new)',
    'capacity_setupTime': 'Setup time (new)',
    'capacity_capacityBacklog': 'Cap. req. (backlog prev. periods)',
    'capacity_setupTimeBacklog': 'Setup time. (backlog prev. periods)',
    'capacity_totalCapacity': 'Total capacity requirements',
    'capacity_shifts': 'Shifts',
    'capacity_overtime': 'Overtimes',

//Settings-Workstations
    'setWorkstations_workstations': 'Workstations',
    'setWorkstations_number': 'Number',
    'setWorkstations_name': 'Name',
    'setWorkstations_add': 'Add',
    'setWorkstations_reset': 'Reset',
    'setWorkstations_delete': 'Delete',
    'setWorkstations_edit': 'Edit',
    'setWorkstations_update': 'Update',
    'setWorkstations_exists': 'Workstation already exists!',
    'setWorkstations_exists_body': ' already exists.\n\nPlease choose another number',
    'setWorkstations_empty': 'Workstation incomplete!',
    'setWorkstations_empty_body': 'Number and name have to be filled.',

//Settings-PartsLists
    'setPartsList_Product': 'Product',
    'setPartsList_Overview': 'Summerized bill of material',

//Settings-Parts
    'setParts_parts': 'Parts',
    'setParts_part': 'Part',
    'setParts_typ': 'Type',
    'setParts_number': 'Number',
    'setParts_title': 'Title',
    'setParts_worth': 'Worth',
    'setParts_stock': 'Stock',
    'setParts_usage': 'Usage',
    'setParts_components': 'Components',
    'setParts_workstations': 'Workstations',
    'setParts_workstation': 'Workstation',
    'setParts_delPeriod': 'Delivery period',
    'setParts_deviation': 'Deviation',
    'setParts_discount': 'Discount',
    'setParts_add': 'Add',
    'setParts_reset': 'Reset',
    'setParts_delete': 'Delete',
    'setParts_edit': 'Edit',
    'setParts_update': 'Update',
    'setParts_chooseComp': 'Choose components',
    'setParts_check': 'Check',
    'setParts_amount': 'Amount',
    'setParts_chooseWs': 'Choose workstations',
    'setParts_setUp': 'Set-up time',
    'setParts_procTime': 'Processing time',
    'setParts_nextWs': 'Next workstation',
    'setParts_exists': 'Part already exists!',
    'setParts_exists_body': ' already exists.\n\nPlease choose another number',
    'setParts_empty': 'Part incomplete!',
    'setParts_empty_body': 'At least one textfield is still emtpy!',
    'setParts_search': 'Search',
    'setParts_searchEmptyText': 'Number or title',

//xmlImport
    'xmlImport': 'XML Import',

//prediction
    'binding_orders': 'Binding Orders',
    'period': 'Periode',
    'product': 'Product',
    'planned': 'Planned',
    'remaining_stock': 'Remaining Stock',
    'prediction_planning': 'Forecast',

//MaterialPlanning
    'material_Planning': 'Material Planning (Purchased Items)',
    'num_purchase_part': 'Nr. Purchase Part',
    'delivery_time': 'Del.Time',
    'deviation': 'Deviation',
    'sum': 'Sum',
    'use':'Use',
    'discount_sum':'Discount Sum',
    'opening_stock':'Opening Stock',
    'gross_requirements_period':'Gross Req. Per.',
    'sum_without_order':'Sum without order',
    'sum_with_order':'Sum with order pP',
    'volume_ordered':'Volume ordered',
    'ordertype':'Order Type',
    'stock_after_receipt':'Stock after receipt',

//Overview
    'overKPart_search': 'Search',
    'overKPart_searchEmptyText': 'Number or title',
    'overKPart_allocation': 'Used by:',
    'overWH_warehousestock': 'Warehousestock',
    'overWH_limit': 'Limit',
    'overWH_period': 'Period',

//xmlExport
    'xmlExport': 'XML Export',

//MaterialPlanningEP
    'mpEP_Product': 'Product',
    'mpEP_MaterialPlanningEP': 'Material Planning (finished / semi finished products)',
    'mpEP_salesOrders': 'Sales Orders',
    'mpEP_plannedWarehouseEnd': 'Planned warehousestock at the end of the following period',
    'mpEP_WarehouseEndPeriod': 'Warehousestock at the end of the passed period',
    'mpEP_OrderWaitingQueue': 'Orders in the waiting queue',
    'mpEP_WorkInProgress': 'Work in progress',
    'mpEP_ProdOrders': 'Production orders for the following period',

//Forecast
    'forecast_sales': 'Sales',
    'forecast_product': 'Product',
    'forecast_period': 'Period',
    'forecast_plProd': 'Planned production',
    'forecast_plRemStock': 'Expected remaining stock',
    'forecast_directSales': 'Direct sales',
    'forecast_quantity': 'Quantity',
    'forecast_price': 'Price',
    'forecast_conPenalty': 'Contract penalty',

//Task
    'task_todoList': 'Todolist'
};