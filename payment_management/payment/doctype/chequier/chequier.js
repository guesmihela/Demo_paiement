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
      var nbr = nbr_cheque + 1
	  frm.set_value("nbr_ch" , nbr);
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
		// Retrieve all chequier_list documents that attached to account
        frappe.db.get_list('Chequier', {
          filters: {
            'account': frm.doc.account
          }
        }).then(function(chequier_list) {
          // Do something with the list of chequier
           console.log(chequier_list.length);
           if(chequier_list.length == 0)
		   {
		     var numero_chequier = 1
		   }
		   else
		   {
		     var numero_chequier = chequier_list.length + 1
		   }
		   frm.set_value("num_ch", numero_chequier)
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
			 fieldname: ["name","bank_name"]
		  },
		  callback: function(r)
		  {
		    console.log(r.message.bank_name)
            frm.set_value("bank", r.message.bank_name)
		  }
		});
				// Retrieve all chequier_list documents that attached to account
        frappe.db.get_list('Chequier', {
          filters: {
            'account': frm.doc.account
          }
        }).then(function(chequier_list) {
          // Do something with the list of chequier
           console.log(chequier_list.length);
           if(chequier_list.length == 0)
		   {
		     var numero_chequier = 1
		   }
		   else
		   {
		     var numero_chequier = chequier_list.length + 1
		   }
		   frm.set_value("num_ch", numero_chequier)
        });
	}
});
