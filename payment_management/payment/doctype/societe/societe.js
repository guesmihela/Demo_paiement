// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Societe', {


	 refresh: function(frm) {
	   if(frm.is_new())
	   {
	     frm.set_df_property('accounts_company', 'hidden', 1);
	   }
	   frm.fields_dict['accounts_company'].grid.get_field("compte").get_query = function(doc, cdt,cdn)
	   {
	     return{
           "filters": {
             "societe_name" : frm.doc.name
           }
	     }
	  }

	 }
});
frappe.ui.form.on("Societe_Details", {
 /* setup: function(frm,cdt,cdn)
  {
      console.log("societe" + frm.doc.name);
      frm.set_query("compte", function() {
			return {
				filters:{
					"societe_name": frm.doc.name
				}
			}
	  });
  },*/
  compte: function(frm,cdt,cdn)
  {
      var row = locals[cdt][cdn];
      frappe.call({
		  method: "frappe.client.get_value",
		  async: false,
		  args:
		  {
			 doctype: "Compte Societe",
			 filters: {"name": row.compte},
			 fieldname: ["account_name", "is_default", "rib", "default_currency"]
		  },
		  callback: function(r)
		  {
            frappe.model.set_value(cdt, cdn,"rib",r.message["rib"]);
            //frappe.model.set_value(cdt, cdn,"is_default",r.message["is_default"]);
            frappe.model.set_value(cdt, cdn,"default_currency",r.message["default_currency"]);
		  }
		});
  }
});
frappe.ui.form.on("Societe_Details", {
  is_default: function(frm,cdt,cdn) {
	  var row = locals[cdt][cdn];
	  //console.log("nombre compte"+row.is_default);
	  //var nbr_def_cpte = 0;
	  var checked_count = 0;
	  $.each(frm.doc.accounts_company || [], function(i, d) {
	    if(d.is_default && d.is_default === 1 && d.name !== row.name) {
			d.is_default = 0;
			checked_count++;
			frm.refresh_field("accounts_company");
	    }
	  });
	  /*$.each(frm.doc.accounts || [], function(i, d) {
	    if(d.is_default && d.is_default === 1 && d.name !== row.name) {
			d.is_default = 0;
			checked_count++;
	    }
	  });*/
	  console.log("nombre compte"+checked_count);
	  frm.set_value("default_rib" , row.rib);
	  frm.set_value("default_account" , row.compte);
	  frm.set_value("default_currency" , row.default_currency);
      frm.refresh_field("default_rib");
      frm.refresh_field("default_account");
      frm.refresh_field("default_currency");
	  console.log("nombre compte"+ checked_count)
	  /*if(checked_count > 0) {
			frappe.throw(__('Only one checkbox can be selected.'));
	  }*/
	  /*if(d.is_default == 1)
	  {
	      $.each(frm.doc.accounts || [], function(i, d) {
	          d.is_default = 0
	      });
	  }*/
	  /*****************************************************/
	  /*frappe.ui.form.on('[Parent Table Fieldname]', {
	'[Child Table Fieldname]': function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var checked_count = 0;
		$.each(frm.doc.[Parent Table Fieldname] || [], function(i, d) {
			if (d.[Child Table Fieldname] && d.[Child Table Fieldname] === 1 && d.name !== row.name) {
				d.[Child Table Fieldname] = 0;
				checked_count++;
			}
		});
		if (checked_count > 0) {
			frappe.throw(__('Only one checkbox can be selected.'));
		}
	}
});*/
	  /***************************************************************/
	  /*$.each(frm.doc.accounts || [], function(i, d) {
	    console.log("nombre compte 2222"+d.is_default);
	    if(d.is_default == 1)
	    {
	      nbr_def_cpte += 1;
	    }
	    if(nbr_def_cpte > 1)
	    {
	     alert("test");
	     frappe.msgprint(__("Société doit avoir un seul compte par defaut"));
	    }
	  });*/


	  /*if(row.is_default = 1)
	  {
	    frm.set_value("default_rib" , row.rib);
	    frm.set_value("default_account" , row.compte);
	    frm.set_value("default_currency" , row.default_currency);
        frm.refresh_field("default_rib");
	  }*/
	}
});
/*frappe.ui.form.on("Societe_Details", {
  is_default: function(frm,cdt,cdn) {
	  var row = locals[cdt][cdn];
	  $.each(frm.doc.accounts || [], function(i, d) {
	  if(row.compte !== d.compte)
	  {
	    d.is_default = 0;
	  }
	  });
	  if(row.is_default = 1)
	  {
	    frm.set_value("default_rib" , row.rib);
	    frm.set_value("default_account" , row.compte);
	    frm.set_value("default_currency" , row.default_currency);
        frm.refresh_field("default_rib");
	  }
	}
});*/
frappe.ui.form.on('Societe_Details','accounts_company_add',function(frm,cdt,cdn) {
        frappe.model.set_value(cdt, cdn,"default_currency","");
});
