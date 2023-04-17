frappe.listview_settings['Recette'] = frappe.listview_settings['Recette'] || {
    hide_name_column : true, // HIDE THE NAME COLUMN IN THE LAST
	filters: [
	   ["state","=","CREE"]
	],
	onload: function(listview) {
      var itemsP = [];
      $('*[data-fieldname="name"]').hide();
      function remise()
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
             if(doc.state!== 'CREE')
             {
               frappe.throw(__("Tous les Recettes sélectionnés doivent avoir l'état CREE "));
             }
           }
           var doc = frappe.model.get_new_doc("Remise");
           for(var i = 0; i < selected_docs.length; i++)
           {
             frappe.call({
			        method: "frappe.client.get_value",
			        async: false,
			        args: {
				        doctype: "Recette",
				        filters: {"name": selected_docs[i]['name']},
				        fieldname: ["reference", "tiers", "montant_net", "default_currency", "nature_recette", "service_recette", "mode_payment","state"]
			            },
			            callback: function(r)
			            {
                          var item_P= {
	                          'recette' : selected_docs[i]['name'],
	                          'montant_net' : r.message["montant_net"],
	                          'tiers' : r.message["tiers"],
	                          'reference' : r.message["reference"],
	                          'default_currency' : r.message["default_currency"],
	                          'nature_recette' : r.message["nature_recette"],
	                          'service_recette'	: r.message["service_recette"],
	                          'mode_payment'	: r.message["mode_payment"],
	                          'state'          : r.message["state"],
	                       };
	                       itemsP.push(item_P);
		                }
			     });
			     //doc.tiers = '';
			     }
			     doc.recettes = itemsP;
			     itemsP = [];
			     frappe.set_route("Form", "Remise", doc.name);
	    }
      }

      function edition_journee()
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
             if(doc.state!== 'VALIDEE')
             {
               frappe.throw(__("Tous les Recettes sélectionnés doivent avoir l'état VALIDEE"));
             }
           }
           var doc = frappe.model.get_new_doc("Journee Recettes");
           for(var i = 0; i < selected_docs.length; i++)
           {
                frappe.call({
			        method: "frappe.client.get_value",
			        async: false,
			        args: {
				        doctype: "Recette",
				        filters: {"name": selected_docs[i]['name']},
				        fieldname: ["reference", "tiers", "montant_net", "default_currency", "default_emission", "date_validation, "nature_recette", "service_recette", "mode_payment","state"]
			            },
			            callback: function(r)
			            {
                          var item_P= {
	                          'recette' : selected_docs[i]['name'],
	                          'montant_net' : r.message["montant_net"],
	                          'tiers' : r.message["tiers"],
	                          'reference' : r.message["reference"],
	                          'default_currency' : r.message["default_currency"],
	                          'nature_recette' : r.message["nature_recette"],
	                          'service_recette'	: r.message["service_recette"],
	                          'mode_payment'	: r.message["mode_payment"],
	                          'state'          : r.message["state"],
	                          'echeance': '',
	                          'avalise': '',
	                          'date_emission': r.message["date_emission"],
	                          'date_validation': r.message["date_validation"]
	                       };
	                       itemsP.push(item_P);
		                }
			    });
		   }
		   doc.state = 'Non Cloturée';
		   doc.recettes = itemsP;
		   doc.date_cloture = ''
		  //frappe.db.insert(doc);
		   itemsP = [];
		   frappe.set_route("Form", "Journee Recettes", doc.name);
	    }
      }
      /**********************/


      function annuler_recettes()
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
             if(doc.state == 'CREE')
             {
               frappe.throw(__("Tous les Recette sélectionnés doivent avoir l'état different de CREE "));
             }
           }
           for(var i = 0; i < selected_docs.length; i++)
           {
              frappe.db.get_doc("Recette", null, {"name": selected_docs[i]['name']})
              .then(doc => {
                 frappe.db.set_value("Recette", doc.name,{
                   "state": 'CREE'});
              });
              /*frappe.db.get_doc("Journee Recettes", null, {"name": depense.name})
              .then(doc => {
                 frappe.db.set_value("Journee Recettes", doc.name,{
                   "state": 'Non Cloturée'});
              });*/
              frappe.db.get_doc("Journee Recettes", null, {"name": selected_docs[i]['journee']})
              .then(doc => {
                 frappe.db.set_value("Journee Recettes", doc.name,{
                   "state": 'Non Cloturée'});
              });
           }
           listview.refresh()
           msgprint(__(" Annulation effectuée avec succès"));
		   }
      }
      listview.page.add_action_item(__("Creation Remise"),()=> remise());
      listview.page.add_action_item(__("Journee Recettes"),()=> edition_journee());
      listview.page.add_action_item(__("Annuler Recettes"),()=> annuler_recettes());
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