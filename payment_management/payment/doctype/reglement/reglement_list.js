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
              frappe.db.get_doc("Reglement", null, {"name": selected_docs[i]['name']})
              .then(doc => {
                 frappe.db.set_value("Reglement", doc.name,{
                   "state": 'VALIDE',
                   "date_validation": frappe.datetime.nowdate()});
              });
		   }
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