  frappe.listview_settings['Journee Depenses'] = frappe.listview_settings['Journee Depenses'] ||
  {
    hide_name_column : true, // HIDE THE NAME COLUMN IN THE LAST
	onload: function(listview) {
	  $('.primary-action').hide();
      $('*[data-fieldname="name"]').hide();
      function cloture_journees()
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
             if(doc.state!== 'Non Cloturée')
             {
               frappe.throw(__("Tous les Dépenses sélectionnés doivent avoir l'état Non Cloturée"));
             }
           }
           //var doc = frappe.model.get_new_doc("Reglement");
           for(var i = 0; i < selected_docs.length; i++)
           {
              /*frappe.db.get_doc("Despenses", null, {"reference": selected_docs[i]['reference']})
              .then(doc => {
                 frappe.db.set_value("Despenses", doc.name,{
                   "state": 'VALIDEE',
                   "date_validation": frappe.datetime.nowdate()});
              });*/
              frappe.db.get_doc("Journee Depenses", null, {"name": selected_docs[i]['name']})
              .then(doc => {
                 frappe.db.set_value("Journee Depenses", doc.name,{
                   "state": 'Cloturée',
                   "date_cloture": frappe.datetime.nowdate()});
              });
		   }
	     }
      }
      listview.page.add_action_item(__("Cloture Journees"),()=> cloture_journees());
      },
      get_indicator: function(doc) {
        if(doc.state === "Non Cloturée")
        {
          return [__("Non Cloturée"), "red", "state,=,Non Cloturée"];
        }
		else if(doc.state === "Cloturée")
        {
           return [__("Cloturée"), "green", "state,=,Cloturée"];
        }

	}
};

