// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Bordereau Virement', {
	refresh: function(frm) {
	frm.set_query("account", function() {
			return {
				filters: {
					"societe_name": frm.doc.societe_name
				}
			}
	   });
	},
	societe_name: function(frm) {
	    frappe.call({
		  method: "frappe.client.get_value",
		  async: false,
		  args:
		  {
			 doctype: "Societe",
			 filters: {"name": frm.doc.societe_name},
			 fieldname: ["default_account"]
		  },
		  callback: function(r)
		  {
            frm.set_value("account", r.message.default_account)
		  }
		});
	},
	account: function(frm) {
	    frappe.call({
		  method: "frappe.client.get_value",
		  async: false,
		  args:
		  {
			 doctype: "Compte Societe",
			 filters: {"name": frm.doc.account},
			 fieldname: ["name","bank_name","default_currency","rib"]
		  },
		  callback: function(r)
		  {
		    frm.set_value("bank", r.message.bank_name)
            frm.set_value("default_currency", r.message.default_currency)
            frm.set_value("rib", r.message.rib)
		  }
		});
	}
});
