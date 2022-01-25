sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment"
], function(Controller, Device, MessageToast, Filter, FilterOperator, Sorter, Fragment) {
	"use strict";

	return Controller.extend("qstMyEinkauf.controller.Master", {
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched: function() {
			/*
			 * Navigate to the first item by default only on desktop and tablet (but not phone).
			 * Note that item selection is not handled as it is
			 * out of scope of this sample
			 */
			if (!Device.system.phone) {
				this.getOwnerComponent().getRouter()
					.navTo("listStart", true); //
			}
		},
		
		onSelectionChange: function(oEvent) {
			MessageToast.show("Enter SelectionChange");
			var sListId = oEvent.getSource().getSelectedItem().getBindingContext("EinkaufBackend").getProperty("ListId"); // "orderId" aus dem Modell!! Property und nicht der Pfad! Zufällig das Gleiche
			// var gPath = oEvent.getSource().getSelectedItem().getBindingContext("EinkaufBackend").getPath();
			this.getOwnerComponent().getRouter()
				.navTo("listDetails", {
						orderId: sListId
					}, // an Modell anpassen!
					!Device.system.phone);
		},

		onSelectName: function(oEvent) {
			var sPath = oEvent.getParameter("selectedItem").getBindingContext("beispiel").getPath();
			var sOwner = this.getView().getModel("beispiel").getProperty(sPath + "/owner");
			
			var oList = this.getView().byId("el");
			oList.bindElement(sPath);

			var oFilter = new Filter({
				path: "owner",
				operator: FilterOperator.EQ,
				value1: sOwner
			});
			oList.getBinding("items").filter(oFilter);
		},
		
		onSelectSort: function(oEvent) {
			MessageToast.show("Sorted!");
			var oItem = oEvent.getParameter("selectedItem");
			var sText = oItem.getText();
			var oList = this.getView().byId("el");
			//var sOwner = this.getView().getModel("beispiel").getProperty(sPath + "/owner");
			if (sText === "Ersteller") {
				var oSorter = new Sorter("owner");
				oList.getBinding("items").sort(oSorter);
			} else if (sText === "Zeit") {
				var oSorter = new Sorter("changeDate");
				oSorter.fnComparator = this.comparator;
				oList.getBinding("items").sort(oSorter);
			}
		},

		onReset: function() {
			MessageToast.show("Sortierung und/oder Filterung aufgehoben");
			var oList = this.getView().byId("el");
			oList.getBinding("items").filter(null);
			oList.getBinding("items").sort(null);
		},
		
		openDialogAddList: function(){
        	this.openDialog("DialogAddList");
        },
        
        openDialog: function(viewName){
			var oView = this.getView();
			// create dialog lazily
			if (!this.byId(viewName)) {
			// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "qstMyEinkauf.view." + viewName,
					controller: this
				}).then(function (oDialog) {
				// connect dialog to the root view 
				//of this component (models, lifecycle)
    			oView.addDependent(oDialog);
    			oDialog.open();
			});
			} else {
    			this.byId(viewName).open();
    		}
		},
        
        closeDialogAddList: function(){
        	var sTitle = this.byId("input_dialog_titel").getValue();
			var sName = this.byId("input_dialog_beschreibung").getValue();
			var oList = this.getView().byId("el");
			var sPath = oList.getBinding("items").getPath();
			var oModel = this.getView().getModel("beispiel");
			var sToday = new Date().toISOString().split("T")[0].split("-").reverse().join(".");
			oModel.getProperty(sPath).push({"orderId": oModel.getData().orders.length, "orderName": sTitle, "owner": sName, "products":[], "changeDate": sToday, "sharedWith": [], "changedBy": ""});
            oModel.refresh();
			this.byId("DialogAddList").close();		
        },
        
        cancelDialogAddList: function(){
        	this.byId("DialogAddList").close();	
        },
		
		comparator: function(a, b) {

			var aDate = new Date(a);
			var bDate = new Date(b);

			if (bDate == null) {
				return -1;
			}
			if (aDate == null) {
				return 1;
			}
			if (aDate < bDate) {
				return -1;
			}
			if (aDate > bDate) {
				return 1;
			}
			return 0;
		}

	});
});