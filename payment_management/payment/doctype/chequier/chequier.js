// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Chequier', {
	refresh: function(frm) {
	frm.set_query("account", function() {
			return {
				filters: {
					"societe_name": frm.doc.societe_name
				}
			}
	   });

	},
	first_num: function(frm) {
	  frm.set_value("numero_dernier_cheque", frm.doc.first_num)
	  console.log(frm.doc.first_num)
	},
	last_num: function(frm) {
    if(typeof frm.doc.last_num !== 'number' || typeof frm.doc.first_num !== 'number') {
       frappe.throw('Les deux arguments doivent être des nombres.');
    }
    else if(frm.doc.first_num > frm.doc.last_num){
      frappe.throw('numero fin doit être supérieur au numéro début.');
    }
    else
    {
      var nbr_cheque = frm.doc.last_num - frm.doc.first_num;
	  frm.set_value("nbr_ch" , nbr_cheque);
    }
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
			 filters: {"name": frm.doc.accounts},
			 fieldname: ["bank_name"]
		  },
		  callback: function(r)
		  {
            frm.set_value("bank", r.message.bank_name)
		  }
		});
	}
});
