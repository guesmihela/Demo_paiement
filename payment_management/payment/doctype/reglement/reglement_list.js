  frappe.listview_settings['Reglement'] = frappe.listview_settings['Reglement'] ||
  {
    hide_name_column : true, // HIDE THE NAME COLUMN IN THE LAST
	//filters: [["state_folder","=", "En Attente"]],
	onload: function(listview) {
	  $('.primary-action').hide();
      $('*[data-fieldname="name"]').hide();


      function validation_paiement()
      {
         const selected_docs = listview.get_checked_items();
         const docnames = listview.get_checked_items(true);
         if(selected_docs == '')
         {
          msgprint(__(" Aucun élément sélectionné, veuillez en sélectionner au moins un"));
         }
         else
         {
           /*for(let doc of selected_docs)
           {
             if(doc.state!== 'EMISE')
             {
               frappe.throw(__("Tous les Dépenses sélectionnés doivent avoir l'état EMISE"));
             }
           }*/
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


      listview.page.add_action_item(__("Validation Reglement"),()=> validation_paiement());
      }
  }