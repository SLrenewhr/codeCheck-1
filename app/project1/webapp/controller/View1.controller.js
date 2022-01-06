sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {

            },
     
            onNewBenefitAreaPress: function (oEvent) {
                var oView = this.getView();
                var benefitsAreaDialogModel = new sap.ui.model.json.JSONModel();
                var benefitsAreaData;
                if (oEvent && (oEvent.oModel)) {
                    var sPath = oEvent.sPath;
                    benefitsAreaData = {
                        "BENAREA": oEvent.getObject().BENAREA,
                        "DESCP": oEvent.getObject().DESCP,
                        "CONGRP": oEvent.getObject().CONGRP,                   
                        "editFlag": true,
                        "editPath": sPath
                    };
                } else {
                    benefitsAreaData = {
                        "BENAREA": "",
                        "DESCP": "",
                        "CONGRP": "",
                        "editFlag": false
                    };
                }
               benefitsAreaDialogModel.setData(benefitsAreaData);
               oView.setModel(benefitsAreaDialogModel, "benefitsAreaDialogModel");
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "project1.fragments.benefitarea"
                    });
                } 
                this.pDialog.then(function(oDialog) {
                    oDialog.open();
                });

            },
            onCancelNewBenefitArea:function(){
                this.pDialog.then(function(oDialog) {
                    oDialog.close();
                });

            },

            onSaveNewBenefitArea: function (oEvent) {
                var benefitsAreaDialogModel = this.getView().getModel("benefitsAreaDialogModel");
                var data=benefitsAreaDialogModel.getData();
                var editFlag = benefitsAreaDialogModel.getData().editFlag;  
                delete data.editFlag;
                if (!editFlag) { // For Create 
                    this.EntrySaveDB("BenefitsArea", data,"POST"); 
                } else { // For edit
                   var editPath = benefitsAreaDialogModel.getData().editPath;
                   delete data.editPath; 
                   this.EntrySaveDB(editPath, data,"PUT"); 
                }
                this.getView().getModel().refresh();
                this.onCancelNewBenefitArea();
            },

            
            EntrySaveDB: function (entityPath, data,methodh){  
                var _msg="";
                if(methodh === "POST"){
                    _msg="Saved Successfully";
                }else{
                    _msg="Updated Successfully";
                }
                var token =  this.fetchToken();
                var settings= {
                    async: false,
                    url: "/srv/"+entityPath,
                    method: methodh,
                    headers:{
                        "content-type" : "application/json",
                        "X-CSRF-Token" : token
                    },
                    processData: false,
                    data: JSON.stringify(data)
                };
                                 
                $.ajax(settings).done(function(response){
                    MessageBox.success(_msg);
                }).fail(function(error){
                    MessageBox.error(error.responseText);
                });  
            },

            fetchToken:function(){
                var fetchedToken;
                  var settings= {
                    async: false,
                    url: "/srv/",
                    method: "GET",
                    headers:{
                        "content-type" : "application/json",
                        "X-CSRF-Token" : "Fetch"
                    },
                    processData: false
                };                   
            $.ajax(settings).done(function(data, textStatus, response){
                fetchedToken = response.getResponseHeader('X-CSRF-Token');
                //MessageBox.success("Fetch success");
            }).fail(function(error){
                MessageBox.error("fetch Token error");
            });
            return fetchedToken;
            },

            onEdit:function(oEvent){
                var source = oEvent.getSource();
                var context = source.getBindingContext();
                this.onNewBenefitAreaPress(context);
            },

            onDelete:function(oEvent){
                var source = oEvent.getSource();
                var listItem = source.getParent().getParent();
                var table = listItem.getParent();
                var context = listItem.getBindingContext();
                var sPath = context.getPath();
                var token =  this.fetchToken();
                var settings= {
                    async: true,
                    url: "/srv/"+sPath,
                    method: "DELETE",
                    headers:{
                        "content-type" : "application/json",
                         "X-CSRF-Token" : token
                    },
                    processData: false
                };
                                 
                $.ajax(settings).done(function(response){
                    MessageBox.success("Deleted successfully");
                }).fail(function(err){
                    MessageBox.error("Delete error:"+err.responseJSON.error.message);
                });
                this.getView().getModel().refresh();
            },
        });
    });
