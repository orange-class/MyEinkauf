sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment"
], function(Controller, History, Fragment) {
	"use strict";
	return Controller.extend("qstMyEinkauf.controller.ListDetails", {
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("listDetails").attachPatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			this._orderId = oEvent.getParameter("arguments").orderId; //orderID ist Name aus mnifest :orderID: und muss angepasst werden!
			this.getView().bindElement({
				path: "/orders/" + this._orderId,
				model: "beispiel"
			}); //orderID anpassen + "/orders/" muss zu Modell passen! + Modell anpassen + Seite 240 Extras einbauen
		},
		
		/*onSelectionChange: function(oEvent) {
			var sProductId = oEvent.getSource().getBindingContext().getProperty("productId");
			this.getOwnerComponent().getRouter()
				.navTo("productDetails",
					{orderId:this._orderId, productId: sProductId});
		},*/
		
		
		onToSettings: function() {
			this.getOwnerComponent().getRouter().navTo("listSettings", {orderId:this._orderId}); //orderID anpassen
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
		
		onOpenDialog: function () {
			var oView = this.getView();
			// create dialog lazily
			if (!this.byId("openDialog")) {
			// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "qstMyEinkauf.view.Dialog",
					controller: this
				}).then(function (oDialog) {
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
 
    	closeDialog: function () {
    			this.byId("openDialog").close();
    	}
		
		
		});
});