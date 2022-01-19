sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/core/routing/History", 
	"sap/ui/Device"
], function(Controller, History, Device) {
	"use strict";

	return Controller.extend("qstMyEinkauf.controller.ListSettings", {

		onInit : function () {
			this.getOwnerComponent().getRouter().getRoute("listSettings").attachPatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			this._orderId = oEvent.getParameter("arguments").orderId; //orderID ist Name aus Modell und muss angepasst werden!
			this.getView().bindElement({
				path: "/orders/" + this._orderId,
				model: "beispiel"
			}); //orderID anpassen + "/orders/" muss zu Modell passen!
		},
		
		
		onNavBack : function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// There is no history!
				// replace the current hash with order id 0 (will not add an history entry)
				this.getOwnerComponent().getRouter()
					.navTo("listDetails",
						{orderId:0}, !Device.system.phone); //absoluter Pfad!
			}
		}

	});

});