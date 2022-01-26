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

	return Controller.extend("qstMyEinkauf.controller.Main", {
		onInit: function() {
		},

		openDialogAddProduct  : function() {
			this.openDialog("DialogAddProduct");
		},

		openDialog: function(viewName) {
			var oView = this.getView();
			// create dialog lazily
			if (!this.byId(viewName)) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "qstMyEinkauf.view." + viewName,
					controller: this
				}).then(function(oDialog) {
					// connect dialog to the root view 
					//of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId(viewName).open();
			}
		},

		closeDialogAddProduct: function() {
			var sTitle = this.byId("input_dialog_titel").getValue();
			var sUnit = this.byId("input_dialog_unit").getValue();
			var oNewModel = this.getView().getModel("EinkaufBackend");

			// Neuen Eintrag rausschicken
			var oNewProduct = {
					ProdName: sTitle,
					ProdUnit: sUnit
			};
			oNewModel.create("/ProdListSet", oNewProduct, {
				success: function(oData, response) {
					console.log(response);
					MessageToast.show("Neue Ware angelegt!");	
					oNewModel.refresh();
				},
				error: function(oError) {
					console.log(oError);
					MessageToast.show("Fehler");
				}
			});
			this.byId("DialogAddProduct").close();
		},

		cancelDialogAddProduct: function() {
			this.byId("DialogAddProduct").close();
		}

	});
});