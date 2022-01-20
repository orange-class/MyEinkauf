sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/Device",
	"sap/m/MessageToast"
	], function (Controller, Device, MessageToast) {
	"use strict";

	return Controller.extend("qstMyEinkauf.controller.Master", {
		onInit : function () {
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
				.navTo("listDetails",
					{orderId:sListId}, // an Modell anpassen!
					!Device.system.phone);
		}
		
	});
});