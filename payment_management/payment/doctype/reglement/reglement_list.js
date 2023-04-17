  frappe.listview_settings['Reglement'] = frappe.listview_settings['Reglement'] ||
  {
    hide_name_column : true, // HIDE THE NAME COLUMN IN THE LAST
    filters:[['status', '=', 'EMIS']],
	//filters: [["state","=", "EMIS"]],
	onload: function(listview) {

	  frappe.route_options = {"state": ["=", "EMIS"]};
	  $('.primary-action').hide();
      $('*[data-fieldname="name"]').hide();
      function validation_paiement()
      {
         const selected_docs = listview.get_checked_items();
         const docnames = listview.get_checked_items(true);
         if(selected_docs == '')
         {
          msgprint(__(" Aucun élément sélectionné, veuillez sélectionner un Reglement à Valider"));
         }
         else
         {
             for(let doc of selected_docs)
             {
               if(doc.state !== 'EMIS')
               {
                 frappe.throw(__("les Reglements sélectionnés doivent avoir l'état EMIS"));
               }
             }
             if(selected_docs.length > 1)
             {
               frappe.throw(__("veuillez sélectionner un seul Reglement à Valider"));
             }
             else
             {
               frappe.set_route("Form", "Reglement", selected_docs[0]['name']);
             }

             /*for(var i = 0; i < selected_docs.length; i++)
             {
               frappe.db.get_doc("Reglement", null, {"name": selected_docs[i]['name']})
              .then(doc => {
                 frappe.db.set_value("Reglement", doc.name,{
                   "state": "VALIDE",
                   "date_validation": frappe.datetime.nowdate()});
              });
               frappe.db.get_doc("Despenses", null, {"reference": selected_docs[i]['reference']})
               .then(doc => {
                  frappe.db.set_value("Despenses", doc.name,{
                    "state": 'VALIDEE',
                    "date_validation": frappe.datetime.nowdate()});
               });
		     }
		     listview.refresh();
		     msgprint(__(" Validation effectuée avec succès"));*/
	     }
      }
      listview.page.add_action_item(__("Validation Reglement"),()=> validation_paiement());
      },
      get_indicator: function(doc) {
        if(doc.state === "EMIS")
        {
           return [__("EMIS"), "green", "state,=,EMIS"];
        }
        else if(doc.state === "VALIDE")
        {
           return [__("VALIDE"), "blue", "state,=,VALIDE"];
        }
	}
  };