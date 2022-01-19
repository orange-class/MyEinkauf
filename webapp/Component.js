sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, JSONModel) {
	"use strict";

	return UIComponent.extend("qstMyEinkauf.Component", {

		metadata: {
			manifest: "json"
		},

		init : function () {

			var oModel = new JSONModel("controller/data.json");
			this.setModel(oModel, "beispiel");
			
			// set the device model
			this.setModel(this.createDeviceModel(), "device");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// Parse the current url and display the targets of the route that matches the hash
			this.getRouter().initialize();

			this.getRouter().attachTitleChanged(function(oEvent){
				// set the browser page title based on selected order/product
				document.title = oEvent.getParameter("title");
			});
		},
		
		createDeviceModel : function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}
	});
});