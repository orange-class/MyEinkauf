sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, History, Device, MessageToast, Fragment, Filter, FilterOperator) {
	"use strict";
	//var SortOrder = library.SortOrder;
	return Controller.extend("qstMyEinkauf.controller.ListSettings", {
		selectedItem: null,
		sRight: null,
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("listSettings").attachPatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			this._orderId = oEvent.getParameter("arguments").orderId;
			var oPath = "/ListsSet('" + this._orderId + "')";
			this.getView().bindElement({
				path: oPath,
				model: "EinkaufBackend"
			});
			
			// Hier werden dann die Berechtigungs-Einträge zu dieser EL abgeholt und an die Liste gebunden
			var that = this;
			var aFilter1 = [];
			aFilter1.push(new sap.ui.model.Filter("ListId", FilterOperator.EQ, this._orderId));
			var oTable = that.getView().byId("table_settings");
			oTable.bindRows({
				path: "EinkaufBackend>/RightsSet",
				filters: aFilter1
			});
		},

		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			//The history contains a previous entry
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// There is no history!
				// replace the current hash with order id 0 (will not add an history entry)
				this.getOwnerComponent().getRouter()
					.navTo("listDetails", {
						orderId: 0
					}, !Device.system.phone); //absoluter Pfad!
			}
		},

		onSelectionChange: function(oEvent) {
			var sRole = oEvent.getParameter("selectedItem").getProperty("key");
			var oModel = this.getOwnerComponent().getModel("beispiel");
			var sPath = oEvent.getSource().getBindingContext("beispiel").getPath();
			oModel.setProperty(sPath + "/role", sRole);
			//debugger; 
		},

		onSelectionChangeAddSetting: function(oEvent) {
			this.sRight = oEvent.getParameter("selectedItem").getProperty("key");
		},

		onPressMinus: function() {
			if (this.selectedItem !== null) {
				var sPath = this.selectedItem.getPath();
				var sIndex = parseInt(sPath.substring(sPath.length - 1, sPath.length));
				var oModel = this.getView().getModel("beispiel");
				oModel.getProperty(sPath.substring(0, sPath.length - 1)).splice(sIndex, 1);
				oModel.refresh();
			}
			this.selectedItem = null;
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

		openDialogAddSetting: function() {
			this.openDialog("DialogAddSetting");
		},

		closeDialogAddSetting: function() {
			var sName = this.byId("input_name_dialog").getValue();
			//var sRight = this.byId("input_recht").getValue();
			var oTable = this.getView().byId("table_settings");
			var sPathPrefix = oTable.getBinding("rows").getContext().getPath();
			var sPathSuffix = oTable.getBinding("rows").getPath();
			var sPath = sPathPrefix + "/" + sPathSuffix;
			var oModel = this.getView().getModel("beispiel");
			oModel.getProperty(sPath).push({
				"userName": sName,
				"role": this.sRight
			});
			oModel.refresh();
			this.byId("DialogAddSetting").close();
		},

		openDialogDeleteSetting: function() {
			if (this.selectedItem !== null) {
				this.openDialog("DialogDeleteSetting");
			}
		},

		closeDialogDeleteSetting: function(oEvent) {
			//debugger;
			var oButtonId = oEvent.getParameter("id").split("--")[1];

			if (this.selectedItem !== null && oButtonId === "button_ja") {
				var sPath = this.selectedItem.getPath();
				var sIndex = parseInt(sPath.substring(sPath.length - 1, sPath.length));
				var oModel = this.getView().getModel("beispiel");
				oModel.getProperty(sPath.substring(0, sPath.length - 1)).splice(sIndex, 1);
				oModel.refresh();
				this.selectedItem = null;
			}
			this.byId("DialogDeleteSetting").close();
		},
		
		cancelDialogAddSetting: function(){
			this.byId("DialogAddSetting").close();	
		},

		onRowSelectionChange: function(oEvent) {
			var oRowContext = oEvent.getParameter("rowContext");
			if (oRowContext !== null) {
				this.selectedItem = oRowContext;
				var sPath = this.selectedItem.getPath();
				var oTable = this.getView().byId("table_settings");
				oTable.bindElement(sPath);
				MessageToast.show("Zeile ausgewählt!");
			}

		}

	});

});