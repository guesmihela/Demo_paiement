// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Structure File', {
	/*refresh: function(frm) {
	},*/
	refresh: function(frm) {

	 /* if(frm.doc.is_new_doc === '1')
	  {
	    console.log("ttttttttttttt")
	    frm.doc.champs.forEach(child_doc => {
	      console.log(child_doc.column_start)
	      //child_doc.column_length = "";
	      //child_doc.column_start = "";
	      frappe.model.set_value(child_doc.doctype, child_doc.name, 'column_length', '');
          frappe.model.set_value(child_doc.doctype, child_doc.name, 'column_start', '');
        //var row = locals[cdt][cdn];
        //frappe.model.set_value(cdt, cdn, "column_length", "");
        //frappe.model.set_value(cdt, cdn, "column_start", "");
        });
      }*/
	},
	module_name: function(frm){
	  frm.set_query("doctype_name", function() {
			return {
				filters:{
					"module": frm.doc.module_name
				}
			}
	  });
	},
	doctype_name: function(frm){
	  frappe.call({
	           method: "get_fiels",
	           doc: frm.doc,
               args: {
                 doctype: frm.doc.doctype_name,
               },
      }).then(r => {
         if(r.message)
         {
           frm.refresh()
         }
      });
	},
	after_save: function(frm){
	  /*if(frappe.route_options)
      {
	   frappe.set_route('Form', 'Data Import', frm.doc.import_name);
	  }*/
	}
});
