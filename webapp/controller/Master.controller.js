sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function(Controller, Device, MessageToast, Filter, FilterOperator, Sorter) {
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
			var sListId = oEvent.getSource().getSelectedItem().getBindingContext("beispiel").getProperty("orderId"); // "orderId" aus dem Modell!! Property und nicht der Pfad! Zufällig das Gleiche
			this.getOwnerComponent().getRouter()
				.navTo("listDetails", {
						orderId: sListId
					}, // an Modell anpassen!
					!Device.system.phone);
		},

		onSelectName: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var sPath = oItem.getBindingContext("beispiel").getPath();
			var oList = this.getView().byId("el");
			var sOwner = this.getView().getModel("beispiel").getProperty(sPath + "/owner");
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

		onReset: function(oEvent) {
			MessageToast.show("Reset!");
			var oList = this.getView().byId("el");
			oList.getBinding("items").filter(null);
			oList.getBinding("items").sort(null);

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