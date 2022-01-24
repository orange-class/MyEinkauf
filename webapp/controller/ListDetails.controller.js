sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, History, Fragment, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("qstMyEinkauf.controller.ListDetails", {
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("listDetails").attachPatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			this._orderId = oEvent.getParameter("arguments").orderId;
			this.getView().bindElement({
				path: "/ListsSet('" + this._orderId + "')", // Wir wollen hier einmal nochmal die entsprechende EL mit "Über"-Daten binden
				model: "EinkaufBackend"
			});
			
			// Hier werden dann die Einträge zu dieser EL abgeholt und an die Liste gebunden
			var that=this;
			var aFilter1 = []; 
			aFilter1.push(new sap.ui.model.Filter("ListId", FilterOperator.EQ, this._orderId));
			var oModelHier = this.getOwnerComponent().getModel("EinkaufBackend");
			var oTable = that.getView().byId("table_details");
			oTable.bindRows({
				path: "EinkaufBackend>/ItemsSet",
				filters:aFilter1
			});	
			
			
			
			/*oModelHier.read("/ItemsSet", {
				filters: aFilter1,
				success: function(oData, oResponse){
					console.log(oResponse);
					var oTable = that.getView().byId("table_details");
					//oTable.bindElement(oData.results);
					oTable.bindRows({
    					path: "EinkaufBackend>/ItemsSet",
    					filters:[{path:'ListID', operator:'EQ', value1:'0004'}]
					});
				},
				error: function(){
					alert("Fehler beim Lesen der DB!");
				}
			});*/
		}, //Seite 240 Extras einbauen

		onToSettings: function() {
			this.getOwnerComponent().getRouter().navTo("listSettings", {
				orderId: this._orderId
			}); //orderID anpassen
		},

		// Für Routing zurück im Browser
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				// There is no history!
				// Naviate to master page
				this.getOwnerComponent().getRouter().navTo("master", {}, true);
			}
		},

		onOpenDialog: function() {
			var oView = this.getView();
			// create dialog lazily
			if (!this.byId("openDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "qstMyEinkauf.view.Dialog",
					controller: this
				}).then(function(oDialog) {
					// connect dialog to the root view 
					//of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("openDialog").open();
			}

			//oView.byId("").setText("");
		},

		closeDialog: function() {
			this.byId("openDialog").close();
		}

	});
});