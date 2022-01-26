sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, History, Fragment, Filter, FilterOperator, MessageBox, MessageToast) {
	"use strict";
	return Controller.extend("qstMyEinkauf.controller.ListDetails", {
		_selectedItem: null,
		onInit: function() {
			this.getOwnerComponent().getRouter().getRoute("listDetails").attachPatternMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function(oEvent) {
			this._orderId = oEvent.getParameter("arguments").orderId;
			var oPath = "/ListsSet('" + this._orderId + "')";
			this.getView().bindElement({
				path: oPath,
				// Wir wollen hier einmal nochmal die entsprechende EL mit "Über"-Daten binden
				model: "EinkaufBackend"
			});
			// Hier werden dann die Einträge zu dieser EL abgeholt und an die Liste gebunden
			var that = this;
			var aFilter1 = [];
			aFilter1.push(new sap.ui.model.Filter("ListId", FilterOperator.EQ, this._orderId));
			var oTable = that.getView().byId("table_details");
			oTable.bindRows({
				path: "EinkaufBackend>/ItemsSet",
				filters: aFilter1
			}); // Doch anders gelöst!
			// Hier werden die statischen Elemente befüllt wie der Titel der Seite
			// var oPage = this.getView().byId("page01");
			// oPage.setTitle({EinkaufBackend>Title}" von "{EinkaufBackend>ListsSet/CreatorName});
		},
		//Seite 240 Extras einbauen
		//
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
				this.getOwnerComponent().getRouter().navTo("listStart", {}, true);
			}
		},

		onItemDelete: function(oEvent) {
			var oTable = this.getView().byId("table_details");
			var oModel = this.getView().getModel("EinkaufBackend");
			var oItems = oTable.getSelectedIndices();
			
			// Nur ausführen, falls max. ein Item ausgewählt wurde (ansonsten Fehler...) 
			// könnte man später noch umbauen auf multiples löschen, aber zu kompliziert für jetzt
			if (oItems.length > 1) {
				MessageToast.show("Bitte nur ein Item auswählen");
			} else {
				var i,
					path;
				for (i = oItems.length - 1; i >= 0; --i) {
					var id = oItems[i];
					path = oTable.getContextByIndex(id).sPath;
					oModel.remove(path, {
						method: "DELETE"
					});
				}
			}
		},
		//////////////////////////////////////////////////////////////////////////////////////
		// ALLES FOLGENDE MUSS AN oDATA ANGEPASST WERDEN
		//////////////////////////////////////////////////////////////////////////////////////
		openDialogAddItem: function() {
			this.openDialog("DialogAddItem");
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
		closeDialogAddItem: function() {
			var sName = this.byId("input_dialog_name").getValue();
			var sProduct = this.byId("input_dialog_produktname").getValue();
			var sAmount = this.byId("input_dialog_menge").getValue();
			var sUnit = this.byId("input_dialog_einheit").getValue();
			var oTable = this.getView().byId("table_details");
			var sPathPrefix = oTable.getBinding("rows").getContext().getPath();
			var sPathSuffix = oTable.getBinding("rows").getPath();
			var sPath = sPathPrefix + "/" + sPathSuffix;
			var oModel = this.getView().getModel("beispiel");
			var sToday = new Date().toISOString().split("T")[0].split("-").reverse().join(".");
			oModel.getProperty(sPath).push({
				"productId": oModel.getData().length,
				"owner": sName,
				"productName": sProduct,
				"quantityProvided": 0,
				"quantityRequested": sAmount,
				"unit": sUnit,
				"changeDate": "",
				"changedBy": "",
				creationDate: sToday,
				finishedBy: ""
			});
			oModel.refresh();
			this.byId("DialogAddItem").close();
		},
		openDialogDeleteItem: function() {
			this.openDialog("DialogDeleteItem");
		},
		cancelDialogAddItem: function() {
			this.byId("DialogAddItem").close();
		},
		onSubmitQuantity: function(oEvent) {
			if (this._selectedItem === null) {
				MessageBox.confirm("Bitte einen Eintrag ausw\xE4hlen, um die Menge zu bearbeiten!", {
					title: "Warning!"
				});
			} else {
				var sPath = this._selectedItem.getPath();
				//var sIndex = parseInt(sPath.substring(sPath.length-1, sPath.length));
				var oModel = this.getView().byId("table_details").getModel("beispiel");
				//var itemArray = oModel.getProperty(sPath.substring(0, sPath.length-1));
				var oQuanProv = parseInt(oEvent.getParameter("value"));
				var oQuanReq = oModel.getProperty(sPath + "/quantityRequested");
				//debugger;
				if (oQuanProv > oQuanReq) {
					MessageBox.confirm("Die organisierte Menge sollte kleiner oder gleich der angeforderten Menge sein!", {
						title: "Warning!"
					});
				}
				MessageToast.show("Die Menge wurde ge\xE4ndert!");
			}
		},
		onRowSelectionChange: function(oEvent) {
			var oRowContext = oEvent.getParameter("rowContext");
			if (oRowContext !== null) {
				this._selectedItem = oRowContext;
				var sPath = this._selectedItem.getPath();
				var oTable = this.getView().byId("table_details");
				oTable.bindElement(sPath);
				MessageToast.show("Zeile ausgew\xE4hlt!");
			}
		}
	});
});