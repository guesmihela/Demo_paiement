// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Recette', {
	 refresh: function(frm) {
	 if(frm.is_new())
	  {
	    frm.set_value("state" , " ");
	  }
	  frm.set_query("nature_recette", function() {
			return {
				filters:{
					"recette_or_depense": "Recette"
				}
			}
	  });
	 frm.set_query("service_recette", function() {
			return {
				filters: {
					"recette_or_depense": "Recette"
				}
			}
	 });
	 },
	 tiers: function(frm) {
	    frappe.call({
		  method: "frappe.client.get_value",
		  async: false,
		  args:
		  {
			 doctype: "Tiers",
			 filters: {"name": frm.doc.tiers},
			 fieldname: ["first_name", "raison_social", "default_account", "type"]
		  },
		  callback: function(r)
		  {
			frm.set_value("social_reason", r.message.raison_social)
			frm.set_value("num_compte", r.message.default_account)
			frm.set_value("party_type", r.message.type)
			frm.set_value("first_last_name", r.message.first_name)
		  }
		});
	}

});
