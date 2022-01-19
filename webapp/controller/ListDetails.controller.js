sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
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
		}
	});
});