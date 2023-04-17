// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt
frappe.ui.form.on('Remise', {
	refresh: function(frm) {
	   $(".grid-add-row").hide();
	   $(".grid-remove-rows").hide();
	   frm.set_query("accounts", function() {
			return {
				filters: {
					"societe_name": frm.doc.societe_name
				}
			}
	   });
	},
	validate: function(frm) {
       if(frm.is_new()){
         frm.set_value("state", "CREE")
       }
       frm.set_value("date_creation", frappe.datetime.nowdate())
	   frm.doc.recettes.forEach(function(d) {
	      d.state = 'EMISE'
	      d.date_emission =  frappe.datetime.nowdate()
	   });
	},
	after_save: function(frm){
	  frm.doc.recettes.forEach(function(d) {
	    frappe.db.get_doc("Recette", null, {"reference": d.reference})
          .then(doc => {
             frappe.db.set_value("Recette", doc.name,{
               "state": d.state,
               "mode_payment": d.mode_payment,
               "date_emission": frappe.datetime.nowdate()});
         });
      });
	},
	mode_payment: function(frm, cdt, cdn) {
	    $.each(frm.doc.recettes || [], function(i, d) {
			d.mode_payment = frm.doc.mode_payment;
		});
		frm.refresh_field("expenses");
	},
	societe_name: function(frm) {
	    frappe.call({
		  method: "frappe.client.get_value",
		  async: false,
		  args:
		  {
			 doctype: "Societe",
			 filters: {"name": frm.doc.societe_name},
			 fieldname: ["name", "default_rib", "default_currency", "default_account"]
		  },
		  callback: function(r)
		  {
            frm.set_value("rib", r.message.default_rib)
            frm.set_value("default_currency", r.message.default_currency)
            frm.set_value("accounts", r.message.default_account)
            //$('*[data-fieldname="rib"]').hide();
		  }
		});
	},
	accounts: function(frm) {
	    frappe.call({
		  method: "frappe.client.get_value",
		  async: false,
		  args:
		  {
			 doctype: "Compte Societe",
			 filters: {"name": frm.doc.accounts},
			 fieldname: ["name", "default_currency", "bank_name", "rib"]
		  },
		  callback: function(r)
		  {
            frm.set_value("rib", r.message.rib)
            frm.set_value("default_currency", r.message.default_currency)
            frm.set_value("banque", r.message.bank_name)
            $('*[data-fieldname="rib_party"]').hide();
		  }
		});
	}
});
