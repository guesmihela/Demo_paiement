// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Tiers', {
	refresh: function(frm) {
	frm.set_query("party_type", function() {
			return{
				filters: {
					"name": ["in", Object.keys(frappe.boot.party_account_types)],
				}
			}
		});
	},
	party: function(frm) {
		if(frm.doc.party_type && frm.doc.party) {
			return frappe.call({
				method: "payment_management.payment.doctype.tiers.tiers.get_party_details",
				args: {
					party_type: frm.doc.party_type,
					party: frm.doc.party
				},
				callback: function(r, rt) {
					if(r.message) {
						frappe.run_serially([
							() => frm.set_value("first_name", r.message.first_name),
							() => frm.set_value("type", r.message.type)
						]);
					}
				}
			});
		}
	}
});
frappe.ui.form.on("Tiers_Details", {
  compte: function(frm,cdt,cdn)
  {
      var row = locals[cdt][cdn];
      frappe.call({
		  method: "frappe.client.get_value",
		  async: false,
		  args:
		  {
			 doctype: "Compte",
			 filters: {"name": row.compte},
			 fieldname: ["account_name", "is_default", "rib_account"]
		  },
		  callback: function(r)
		  {
            frappe.model.set_value(cdt, cdn,"rib",r.message["rib_account"]);
            frappe.model.set_value(cdt, cdn,"is_default",r.message["is_default"]);
		  }
		});
  }
});
/*frappe.ui.form.on("Tiers_Details", {
  rib: function(frm,cdt,cdn) {
	  var row = locals[cdt][cdn];
	  if(row.is_default = 1)
	  {
       frm.set_value("rib" , row.rib);
       frm.refresh_field("rib");
      }
	}
});*/
frappe.ui.form.on("Tiers_Details", {
  is_default: function(frm,cdt,cdn) {
	  var row = locals[cdt][cdn];
	  var checked_count = 0;
	  $.each(frm.doc.accounts || [], function(i, d) {
	    if(d.is_default && d.is_default === 1 && d.name !== row.name) {
			d.is_default = 0;
			checked_count++;
			frm.refresh_field("accounts");
	    }
	  });
	  frm.set_value("rib" , row.rib);
      frm.refresh_field("rib");
	}
});
