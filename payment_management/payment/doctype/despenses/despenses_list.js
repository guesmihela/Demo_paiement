frappe.listview_settings['Despenses'] = frappe.listview_settings['Despenses'] || {
    hide_name_column : true, // HIDE THE NAME COLUMN IN THE LAST
	//add_fields: ["identity_number", "branch", "identity_type", "state"],
	filters: [
	   ["state","=","CREE"]
	],
	onload: function(listview) {

      var items = [];
      var itemsP = [];
      var item = {};
      var data = [];
      $('*[data-fieldname="name"]').hide();
      function paiement()
      {
         var list_BENEFICIAIRES = [];
         const selected_docs = listview.get_checked_items();
         const docnames = listview.get_checked_items(true);
         if(selected_docs == '')
         {
          msgprint(__(" Aucun élément sélectionné, veuillez en sélectionner au moins un"));
         }
         else
         {
           for(let doc of selected_docs)
           {
             if(doc.state!== 'CREE')
             {
               frappe.throw(__("Tous les Dépenses sélectionnés doivent avoir l'état CREE "));
             }
           }
           var doc = frappe.model.get_new_doc("Reglement");
           for(var i = 0; i < selected_docs.length; i++)
           {
             frappe.call({
			        method: "frappe.client.get_value",
			        async: false,
			        args: {
				        doctype: "Despenses",
				        filters: {"name": selected_docs[i]['name']},
				        fieldname: ["reference", "tiers", "montant_net", "default_currency", "nature_depense", "service_depense", "mode_payment","state"]
			            },
			            callback: function(r)
			            {
                          var item_P= {
	                          'depense' : selected_docs[i]['name'],
	                          'montant_net' : r.message["montant_net"],
	                          'tiers' : r.message["tiers"],
	                          'reference' : r.message["reference"],
	                          'default_currency' : r.message["default_currency"],
	                          'nature_depense' : r.message["nature_depense"],
	                          'service_depense'	: r.message["service_depense"],
	                          'mode_payment'	: r.message["mode_payment"],
	                          'state'          : r.message["state"],
	                          'ref_virement': '',
	                          'num_cheque': '',
	                          'date_emission': ''
	                       };
	                       itemsP.push(item_P);
		                }
			     });
			     //doc.tiers = '';
			     }
			     doc.accounts = '';
			     doc.expenses = itemsP;
			     doc.rib_party = ''
			     //frappe.db.insert(doc);
			     itemsP = [];
			     frappe.set_route("Form", "Reglement", doc.name);
	    }
      }


      /*********************/

      function validation_paiement()
      {
         var list_BENEFICIAIRES = [];
         const selected_docs = listview.get_checked_items();
         const docnames = listview.get_checked_items(true);
         if(selected_docs == '')
         {
          msgprint(__(" Aucun élément sélectionné, veuillez en sélectionner au moins un"));
         }
         else
         {
           for(let doc of selected_docs)
           {
             if(doc.state!== 'EMISE')
             {
               frappe.throw(__("Tous les Dépenses sélectionnés doivent avoir l'état EMISE"));
             }
           }
           //var doc = frappe.model.get_new_doc("Reglement");
           for(var i = 0; i < selected_docs.length; i++)
           {
              frappe.db.get_doc("Despenses", null, {"reference": selected_docs[i]['reference']})
              .then(doc => {
                 frappe.db.set_value("Despenses", doc.name,{
                   "state": 'VALIDEE',
                   "date_validation": frappe.datetime.nowdate()});
              });
             /*frappe.call({
			        method: "frappe.client.get_value",
			        async: false,
			        args: {
				        doctype: "Despenses",
				        filters: {"name": selected_docs[i]['name']},
				        fieldname: ["reference", "tiers", "montant_net", "default_currency", "nature_depense", "service_depense", "mode_payment","state"]
			            },
			            callback: function(r)
			            {
                          var item_P= {
	                          'depense' : selected_docs[i]['name'],
	                          'montant_net' : r.message["montant_net"],
	                          'tiers' : r.message["tiers"],
	                          'reference' : r.message["reference"],
	                          'default_currency' : r.message["default_currency"],
	                          'nature_depense' : r.message["nature_depense"],
	                          'service_depense'	: r.message["service_depense"],
	                          'mode_payment'	: r.message["mode_payment"],
	                          'state'          : r.message["state"],
	                          'ref_virement': '',
	                          'num_cheque': '',
	                          'date_emission': ''
	                       };
	                       itemsP.push(item_P);
		                }
			     });*/
			     //doc.tiers = '';
			     }
			     //doc.accounts = '';
			     //doc.expenses = itemsP;
			     //doc.rib_party = ''
			     //frappe.db.insert(doc);
			     //itemsP = [];
			     //frappe.set_route("Form", "Reglement", doc.name);
	    }
      }
      /**********************/


      function paiement_benificiaire()
      {
         const selected_docs = listview.get_checked_items();
         const docnames = listview.get_checked_items(true);
         if(selected_docs == '')
         {
          msgprint(__(" Aucun élément sélectionné, veuillez en sélectionner au moins un"));
         }
         else
         {
           for(let doc of selected_docs)
           {
             if(doc.state !== 'CREE')
             {
               frappe.throw(__("Tous les Dépenses sélectionnés doivent avoir l'état CREE "));
             }
           }
           for(var i = 0; i < selected_docs.length; i++)
           {
             if (selected_docs[i] !== undefined)
             {
                 var doc = frappe.model.get_new_doc("Reglement");
                 doc.tiers = selected_docs[i]['tiers'];
                 frappe.call({
			        method: "frappe.client.get_value",
			        async: false,
			        args: {
				        doctype: "Despenses",
				        filters: {"name": selected_docs[i]['name']},
				        fieldname: ["reference", "montant_net", "devise", "nature_depense", "service_depense", "mode_payment","state"]
			            },
			            callback: function(r)
			            {
                          var item_P= {
	                          'depense' : selected_docs[i]['name'],
	                          'montant_net' : r.message["montant_net"],
	                          'référence' : r.message["reference"],
	                          'devise' : r.message["devise"],
	                          'nature_depense' : r.message["nature_depense"],
	                          'service_depense'	: r.message["service_depense"],
	                          'mode_payment'	: r.message["mode_payment"],
	                          'state'          : r.message["state"],
	                          'ref_virement': '',
	                          'num_cheque': '',
	                          'date_emission': ''
	                       };
	                       itemsP.push(item_P);
		                }
			     });
                 for(var j = i+1; j < selected_docs.length; j++)
                 {
                   if(selected_docs[j]['tiers'] == ''+selected_docs[i]['tiers']+'')
                   {
                      frappe.call({
			            method: "frappe.client.get_value",
			            async: false,
			            args: {
				          doctype: "Despenses",
				          filters: {"name": selected_docs[j]['name']},
				          fieldname: ["reference", "montant_net", "devise", "nature_depense", "service_depense", "mode_payment","state"]
			            },
			            callback: function(r)
			            {
                          var item_j= {
	                          'depense' : selected_docs[j]['name'],
	                          'montant_net' : r.message["montant_net"],
	                          'référence' : r.message["reference"],
	                          'devise' : r.message["devise"],
	                          'nature_depense' : r.message["nature_depense"],
	                          'service_depense'	: r.message["service_depense"],
	                          'mode_payment'	: r.message["mode_payment"],
	                          'state'          : r.message["state"],
	                          'ref_virement': '',
	                          'num_cheque': '',
	                          'date_emission': ''
	                       };
	                       itemsP.push(item_j);
		                }
			          });
                      delete selected_docs[j];
                      //selected_docs = selected_docs.filter(item => item !== selected_docs[j])
                   }
                   else
                   {
                    //console.log("not egale");
                   }
                 }
                 doc.accounts = '';
			     doc.expenses = itemsP;
			     doc.rib_party = ''
			     frappe.db.insert(doc);
			     itemsP = [];
			     frappe.set_route("Form", "Reglement", doc.name);
			     }
               }
		   }
      }
      listview.page.add_action_item(__("Paiement/ Reglement"),()=> paiement());
      /*listview.page.add_inner_button('Paiement/ Reglement',()=> paiement()).addClass("btn-primary");
      listview.page.add_inner_button('Validation Reglement',()=> validation_paiement()).addClass("btn-primary");*/


      /*if($(".page-actions").is(":visible") == true)
      {
         alert("Div is visible!!");
      }*/

	},
    get_indicator: function(doc) {
        if(doc.state === "CREE")
        {
          return [__("CREE"), "red", "state,=,CREE"];
        }
		else if(doc.state === "EMISE")
        {
           return [__("EMISE"), "green", "state,=,EMISE"];
        }
        else if(doc.state === "VALIDEE")
        {
           return [__("VALIDEE"), "blue", "state,=,VALIDEE"];
        }

	}
};