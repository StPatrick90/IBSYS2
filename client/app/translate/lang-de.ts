/**
 * Created by Paddy on 26.10.2016.
 */
export const LANG_DE_NAME = 'de';

export const LANG_DE_TRANS = {

//Sidebar
    'sidebar_readXML': 'XML einlesen',
    'sidebar_taskPlanning': 'Auftragsplanung',
    'sidebar_task': 'Aufgaben',
    'sidebar_forecast': 'Prognose',
    'sidebar_productView': 'Produktansicht',
    'sidebar_materialPlanning': 'Kaufteildisposition',
    'sidebar_capacityPlanning': 'Kapazitätsplanung',
    'sidebar_prio': 'Priorisierung',
    'sidebar_overview': 'Übersicht',
    'sidebar_history': 'Historie',
    'sidebar_ordersWork': 'Aufträge in Bearb.',
    'sidebar_waitingWorkst': 'Aufträge in Wart.',
    'sidebar_warehouseStock': 'Lagerbestand',
    'sidebar_settings': 'Einstellungen',
    'sidebar_workstations': 'Arbeitsplätze',
    'sidebar_partsLists': 'Stücklisten',
    'sidebar_parts': 'Teile',
    'sidebar_dashboard': 'Dashboard',
    'sideBar_MaterialPlanningEP': 'Dispo Eigenfert.',
    'sideBar_PartUsage': 'Teileverwendung',

//Headbar
    'headbar_languages': 'Sprachen',
    'headbar_german': 'Deutsch',
    'headbar_english': 'Englisch',

//Dashboard
    'dashboard_danger':'Gefahr',
    'dashboard_warning':'Warnung',
    'dashboard_good':'Hervoragend',
    'dashboard_critical':'Kritisch',
    'dashboard_configuration':'Konfiguration',
    'dashboard_types':'Arten',
    'dashboard_onoff':'An / Aus',
    'dashboard_20%capacity':'Weniger als 20% im Lager!',
    'dashboard_article':'Artikel',
    'dashboard_value': 'Menge',

    'dashboard_warehouse_crit': 'Lagerbestand ist sehr niedrig! Er liegt unter ',
    'dashboard_warehouse_warn': 'Lagerbestand ist niedrig! Er liegt unter ',
    'dashboard_warehouse_good': 'Lagerbestand ist über ',
    'dashboard_deliveryreliabiliy_bad': 'Deine Liefertreue ist unter 100%.',
    'dashboard_deliveryreliabiliy_good': 'Gute Liefertreue!',

//CapacityPlanning
    'capacity_workstations': 'Arbeitsplätze',
    'capacity_parts': 'Teile',
    'capacity_amount': 'Menge',
    'capacity_planning': 'Kapazitäts Planung',
    'capacity_requirements': 'Kapazitätsbedarf (neu)',
    'capacity_setupTime': 'Rüstzeit (neu)',
    'capacity_capacityBacklog': 'Kap. Bed. (Rückstand Vorperiode)',
    'capacity_setupTimeBacklog': 'Rüstzeit. (Rückstand Vorperiode)',
    'capacity_totalCapacity': 'Gesamt Kapazitätsbedarf',
    'capacity_shifts': 'Schichten',
    'capacity_overtime': 'Überstunden',

//Settings-Workstations
    'setWorkstations_workstations': 'Arbeitsplätze',
    'setWorkstations_number': 'Nummer',
    'setWorkstations_name': 'Name',
    'setWorkstations_add': 'Anlegen',
    'setWorkstations_reset': 'Zurücksetzen',
    'setWorkstations_delete': 'Löschen',
    'setWorkstations_edit': 'Bearbeiten',
    'setWorkstations_update': 'Aktualisieren',
    'setWorkstations_exists': 'Arbeitsplatz bereits vorhanden!',
    'setWorkstations_exists_body': ' bereits vorhanden.\n\nBitte wählen Sie eine neue Nummer.',
    'setWorkstations_empty': 'Arbeitsplatz nicht vollständig!',
    'setWorkstations_empty_body': 'Die Nummer und der Name des Arbeitsplatzes muss ausgefüllt sein.',

//Settings-PartsLists
    'setPartsList_Product': 'Produkt',
    'setPartsList_Overview': 'Mengen(übersichts)- Stückliste',

//Settings-Parts
    'setParts_parts': 'Teile',
    'setParts_part': 'Teil',
    'setParts_typ': 'Typ',
    'setParts_number': 'Nummer',
    'setParts_title': 'Bezeichnung',
    'setParts_worth': 'Wert',
    'setParts_stock': 'Lagermenge',
    'setParts_usage': 'Verwendung',
    'setParts_components': 'Bestandteile',
    'setParts_workstations': 'Arbeitsplätze',
    'setParts_workstation': 'Arbeitsplatz',
    'setParts_delPeriod': 'Lieferfrist',
    'setParts_deviation': 'Abweichung',
    'setParts_discount': 'Diskontmenge',
    'setParts_add': 'Anlegen',
    'setParts_reset': 'Zurücksetzen',
    'setParts_delete': 'Löschen',
    'setParts_edit': 'Bearbeiten',
    'setParts_update': 'Aktualisieren',
    'setParts_chooseComp': 'Bestandteile auswählen',
    'setParts_check': 'Auswahl',
    'setParts_amount': 'Anzahl',
    'setParts_chooseWs': 'Arbeitsplätze auswählen',
    'setParts_setUp': 'Rüstzeit',
    'setParts_procTime': 'Fertigungszeit',
    'setParts_nextWs': 'Nächste Arbeitsplatz',
    'setParts_exists': 'Teil bereits vorhanden!',
    'setParts_exists_body': ' bereits vorhanden.\n\nBitte wählen Sie eine neue Nummer.',
    'setParts_empty': 'Teil nicht vollständig!',
    'setParts_empty_body': 'Mindestens eines der Textfelder ist nicht ausgefüllt.',
    'setParts_search': 'Suche',
    'setParts_searchEmptyText': 'Nummer oder Bezeichnung',

//xmlImport
    'xmlImport': 'XML Import',

//prediction
    'binding_orders': 'Verbindliche Aufträge',
    'period': 'Periode',
    'product': 'Produkt',
    'planned': 'Geplant',
    'remaining_stock': 'Rest Bestand',
    'prediction_planning': 'Prognose',

//MaterialPlanning
    'material_Planning': 'Kaufteildisposition',
    'num_purchase_part': 'Nr.Kaufteil',
    'delivery_time': 'Lieferfrist',
    'deviation': 'Abweichung',
    'sum': 'Summe',
    'use':'Verwendung',
    'discount_sum':'Diskontmenge',
    'opening_stock':'Anfangsbestand',
    'gross_requirements_period':'Bruttobedarf n.Pp.',
    'sum_without_order':'Menge oh. Best.',
    'sum_with_order':'Menge mit Best. Vp',
    'volume_ordered':'Bestellmenge',
    'ordertype':'Bestellung E/N',
    'stock_after_receipt':'Bestand n. gepl. WE',

//Overview
    'overKPart_search': 'Suche',
    'overKPart_searchEmptyText': 'Nummer oder Bezeichnung',
    'overKPart_allocation': 'Wird verwendet von:',
    'overWH_warehousestock': 'Lagerbestand',
    'overWH_limit': 'Grenze',
    'overWH_period': 'Periode',

//xmlExport
    'xmlExport': 'XML Export',

//MaterialPlanningEP
    'mpEP_Product': 'Produkt',
    'mpEP_MaterialPlanningEP': 'Disposition Eigenfertigung',
    'mpEP_salesOrders': 'Verbindliche Aufträge',
    'mpEP_plannedWarehouseEnd': 'Geplanter Lagerbestand am Ende der Planperiode',
    'mpEP_WarehouseEndPeriod': 'Lagerbestand am Ende der Vorperiode',
    'mpEP_OrderWaitingQueue': 'Aufträge in der Warteschlange',
    'mpEP_WorkInProgress': 'Aufträge in Bearbeitung',
    'mpEP_ProdOrders': 'Produktionsaufträge für die kommende Periode',

//Forecast
    'forecast_sales': 'Verbindliche Aufträge',
    'forecast_product': 'Produkt',
    'forecast_period': 'Periode',
    'forecast_plProd': 'Geplante Produktion',
    'forecast_plRemStock': 'Voraussichtler Restbestand',
    'forecast_directSales': 'Direktverkauf',
    'forecast_quantity': 'Menge',
    'forecast_price': 'Preis',
    'forecast_conPenalty': 'Konventionalstrafe',

//Task
    'task_todoList': 'Todo Liste',

//Home
    'home_welcome': 'Willkommen zu deinem genialen PPS Tool. Spring in dein Workflow:',
    'hoem_or': 'oder springe in dein Dashboard:'
};