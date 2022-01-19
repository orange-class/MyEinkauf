sap.ui.define([
	"sap/ui/core/mvc/Controller", 
	"sap/ui/Device"
	], function (Controller, Device) {
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
			var sListId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("orderId"); // "orderId" aus dem Modell!!
			this.getOwnerComponent().getRouter()
				.navTo("listDetails",
					{orderId:sListId}, // an Modell anpassen!
					!Device.system.phone);
		}
	});
});