  frappe.listview_settings['Remise'] = frappe.listview_settings['Remise'] ||
  {
    hide_name_column : true, // HIDE THE NAME COLUMN IN THE LAST
	onload: function(listview) {
	  $('.primary-action').hide();
      $('*[data-fieldname="name"]').hide();
      function edition_remise()
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
               frappe.throw(__("Tous les Remises sélectionnés doivent avoir l'état CREE"));
             }
           }
         for(var i = 0; i < selected_docs.length; i++)
         {
              frappe.db.get_doc("Remise", null, {"name": selected_docs[i]['name']})
              .then(doc => {
                 frappe.db.set_value("Remise", doc.name,{
                   "state": 'EDITEE',
                   "date_edition": frappe.datetime.nowdate()});
              });
		 }
		 }
	  }
      function validation_remise()
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
             if(doc.state!== 'EDITEE')
             {
               frappe.throw(__("Tous les Remises sélectionnés doivent avoir l'état EDITEE"));
             }
           }
           for(var i = 0; i < selected_docs.length; i++)
           {
              frappe.db.get_doc("Remise", null, {"name": selected_docs[i]['name']})
              .then(doc => {
                 frappe.db.set_value("Remise", doc.name,{
                   "state": 'VALIDEE',
                   "date_edition": frappe.datetime.nowdate()});
              });
              frappe.db.get_doc("Recette", null, {"reference": selected_docs[i]['reference']})
              .then(doc => {
                 frappe.db.set_value("Recette", doc.name,{
                   "state": 'VALIDEE',
                   "date_validation": frappe.datetime.nowdate()});
              });

		   }
	     }

      }
      listview.page.add_action_item(__("Edition Remise"),()=> edition_remise());
      listview.page.add_action_item(__("validation Remise"),()=> validation_remise());
      },
     get_indicator: function(doc) {
        if(doc.state === "CREE")
        {
          return [__("CREE"), "red", "state,=,CREE"];
        }
		else if(doc.state === "EDITEE")
        {
           return [__("EDITEE"), "green", "state,=,EDITEE"];
        }
        else if(doc.state === "VALIDEE")
        {
           return [__("VALIDEE"), "blue", "state,=,VALIDEE"];
        }

	}
  }