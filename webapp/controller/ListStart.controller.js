sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("qstMyEinkauf.controller.ListStart", {

		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("listStart").attachPatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			this._orderId = oEvent.getParameter("arguments").orderId; //orderID ist Name aus Modell und muss angepasst werden!
			this.getView().bindElement("start"); //orderID anpassen + "/orders/" muss zu Modell passen!
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