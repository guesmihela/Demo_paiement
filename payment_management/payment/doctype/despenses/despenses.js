// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Despenses', {
	refresh: function(frm) {
	  frm.set_query("nature_depense", function() {
			return {
				filters:{
					"recette_or_depense": "Depense"
				}
			}
	  });
	 frm.set_query("service_depense", function() {
			return {
				filters: {
					"recette_or_depense": "Depense"
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
			 fieldname: ["first_name", "last_name", "raison_social", "rne", "cin", "rib", "type"]
		  },
		  callback: function(r)
		  {
            frm.set_value("first_name", r.message.first_name),
			frm.set_value("last_name", r.message.last_name)
			frm.set_value("cin_party", r.message.cin),
			frm.set_value("social_reason", r.message.raison_social)
			frm.set_value("rib", r.message.rib)
			frm.set_value("party_type", r.message.type)
			frm.set_value("rne_party", r.message.rne)
		  }
		});
	}

});
