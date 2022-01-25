sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment"
], function(Controller, Device, MessageToast, Filter, FilterOperator, Sorter, Fragment) {
	"use strict";

	return Controller.extend("qstMyEinkauf.controller.Master", {
		onInit: function() {
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
			var sListId = oEvent.getSource().getSelectedItem().getBindingContext("EinkaufBackend").getProperty("ListId"); // "orderId" aus dem Modell!! Property und nicht der Pfad! Zufällig das Gleiche
			// var gPath = oEvent.getSource().getSelectedItem().getBindingContext("EinkaufBackend").getPath();
			this.getOwnerComponent().getRouter()
				.navTo("listDetails", {
						orderId: sListId
					}, // an Modell anpassen!
					!Device.system.phone);
		},

		onSelectName: function(oEvent) {
			var sPath = oEvent.getParameter("selectedItem").getBindingContext("beispiel").getPath();
			var sOwner = this.getView().getModel("beispiel").getProperty(sPath + "/owner");

			var oList = this.getView().byId("el");
			oList.bindElement(sPath);

			var oFilter = new Filter({
				path: "owner",
				operator: FilterOperator.EQ,
				value1: sOwner
			});
			oList.getBinding("items").filter(oFilter);
		},

		onSelectSort: function(oEvent) {
			MessageToast.show("Sorted!");
			var oItem = oEvent.getParameter("selectedItem");
			var sText = oItem.getText();
			var oList = this.getView().byId("el");

			if (sText === "Ersteller") {
				var oSorter1 = new Sorter("CreatorName", false);
				var oItemsErsteller = oList.getBinding("items");
				oItemsErsteller.sort(oSorter1);
			} else if (sText === "Zuletzt geändert") {
				var oSorter2 = new Sorter("ChangeDate", true);
				oSorter2.fnComparator = this.comparator;
				var oItemsDatum = oList.getBinding("items");
				oItemsDatum.sort(oSorter2);
			}
		},

		comparator: function(a, b) {
			var aDate = new Date(a);
			var bDate = new Date(b);

			if (bDate == null) {
				return -1;
			}
			if (aDate == null) {
				return 1;
			}
			if (aDate < bDate) {
				return -1;
			}
			if (aDate > bDate) {
				return 1;
			}
			return 0;
		},

		onReset: function() {
			MessageToast.show("Sortierung und/oder Filterung aufgehoben");
			var oList = this.getView().byId("el");
			oList.getBinding("items").filter(null);
			oList.getBinding("items").sort(null);
		},

		openDialogAddList: function() {
			this.openDialog("DialogAddList");
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

		closeDialogAddList: function() {
			var sTitle = this.byId("input_dialog_titel").getValue();
			var oList = this.getView().byId("el");
			var oNewModel = this.getView().getModel("EinkaufBackend");

			// Neuen Eintrag rausschicken
			var oNewProduct = {
					Title: sTitle
			};
			oNewModel.create("/ListsSet", oNewProduct, {
				success: function(oData, response) {
					console.log(response);
					// oNewModel.submitChanges();
					MessageToast.show("Neue Einkaufsliste angelegt!");
				},
				error: function(oError) {
					console.log(oError);
					MessageToast.show("Fehler");
				}
			});
			
			//binding against this entity
			/*var oListItem = new sap.m.StandardListItem({title:"{EinkaufBackend>Title}", description:"{EinkaufBackend>CreatorName}", info:"{EinkaufBackend>ChangeDate}", type:"Active",
					press:"onSelectionChange"});
			oList.bindItems({ path: "EinkaufBackend>/ListsSet", template: oListItem} );*/
			
			// submit the changes (creates entity at the backend)
			/*oNewModel.submitChanges({
				success: function(oData, response) {
					console.log(response);
					MessageToast.show("Neue Einkaufsliste im Backend angelegt!");
				},
				error: function(oError) {
					console.log(oError);
					MessageToast.show("Fehler bei Weitergabe ans Backend");
				}
			});*/
			// PopUp schließen
			this.byId("DialogAddList").close();
		},

		cancelDialogAddList: function() {
			this.byId("DialogAddList").close();
		}

	});
});