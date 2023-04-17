// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Reglement', {
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
	   if(!frm.is_new() && frm.doc.state != 'VALIDE'){
	     frm.add_custom_button(__("Valider"), function() {
	       frappe.call({
	           method:'validate_reglement',
               doc: frm.doc,
            }).then(r => {
                frm.refresh();
                msgprint(__(" Validation effectuée avec succès"));
               });
	     }).addClass("btn-primary");
	   }
	   if(frm.doc.state == 'VALIDE')
	   {
	     frm.set_df_property("payment_mode", "read_only", 1);
         frm.set_df_property("societe_name", "read_only", 1);
         frm.set_df_property("accounts", "read_only", 1);
         frm.set_df_property("expenses", "read_only", 1);
	     frm.disable_save();
	   }

	   /*frm.page.set_primary_action(__("Valider"), function () {
			if (!frm.doc.update_value) {
				frappe.throw(__('Field "value" is mandatory. Please specify value to be updated'));
			} else {
				frappe
					.call({
						method: "frappe.desk.doctype.bulk_update.bulk_update.update",
						args: {
							doctype: frm.doc.document_type,
							field: frm.doc.field,
							value: frm.doc.update_value,
							condition: frm.doc.condition,
							limit: frm.doc.limit,
						},
					})
					.then((r) => {
						let failed = r.message;
						if (!failed) failed = [];

						if (failed.length && !r._server_messages) {
							frappe.throw(
								__("Cannot update {0}", [
									failed.map((f) => (f.bold ? f.bold() : f)).join(", "),
								])
							);
						} else {
							frappe.msgprint({
								title: __("Success"),
								message: __("Updated Successfully"),
								indicator: "green",
							});
						}
						frappe.hide_progress();
						frm.save();
					});
			}
		});*/
	   /*let selected = frm.get_selected()
       selected.expenses.forEach(row_name => {
       var row = locals[‘Child Doctype’][row_name]
       console.log(‘SELECTED ROW ************************’);
       console.log(row);*/
	   //var row = frm.fields_dict.LIST_NAME.grid.grid_rows[INDEX];
       //row.select(true);
       //row.refresh_check();
	   /*var grid = frm.fields_dict["expenses"].grid;
	   var checked_count =grid.grid_rows.
	   grid.on('keydown', function(e) {
          console.log("tessssssssssssssssst")
            var row = grid.get_row(e.row.index);
            var checked = row.checkbox_fieldname;
            // Perform some action based on whether the checkbox is checked or not
            console.log("tessssssssssssssssst")
        });*/

	   //frm.disable_save();
	   /*frm.add_custom_button(__('Valider'), function() {
	      //frm.save('Submit');
          frm.save();
	   }).addClass("btn-primary");*/
	},
	validate: function(frm) {
	   frm.doc.expenses.forEach(function(d) {
	      d.state = 'EMISE'
	      d.date_emission =  frappe.datetime.nowdate()
	   });
	   if(frm.is_new()){
	     frm.set_value("date_emission", frappe.datetime.nowdate())
	   }

	},
	 /*expenses_on_form_rendered: function(frm, cdt, cdn) {
        var grid = frm.fields_dict.expenses.grid;
        grid.on("grid-row-check", function(e) {
          console.log("tessssssssssssssssst")
            var row = grid.get_row(e.row.index);
            var checked = row.checkbox_fieldname;
            // Perform some action based on whether the checkbox is checked or not
            console.log("tessssssssssssssssst")
        });
    },*/
	after_save: function(frm) {
	 if(frm.is_new())
	 {
	   frm.doc.expenses.forEach(function(d) {
	    frappe.db.get_doc("Despenses", null, {"reference": d.reference})
          .then(doc => {
             frappe.db.set_value("Despenses", doc.name,{
               "state": d.state,
               "mode_payment": d.mode_payment,
               "date_emission": frappe.datetime.nowdate()});
         });
       });
     }
    },
    /*payment_mode: function(frm, cdt, cdn) {
      frm.doc.expenses.forEach(child_doc => {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "mode_payment", frm.doc.payment_mode);
        // for each found, set mode_payment = payment_mode.
        //child_doc.mode_payment = frm.doc.payment_mode;
      });
    },*/
	payment_mode: function(frm, cdt, cdn) {
	    /*frm.doc.expenses.forEach(child_doc => {
	     var row = locals[cdt][cdn];
	     frappe.model.set_value(cdt, cdn,"mode_payment",frm.doc.mode_payment);
            // for each found, set mode_payment = payment_mode.
	        child_doc.mode_payment = frm.doc.payment_mode;
	    });*/
        // ask the web page to show the latest values:
	    //frm.refresh_field('expenses');
	    //frm.fields_dict['expenses'].grid.get_field("mode_payment")
	    frappe.call({
	           method:'mode_reglement',
               doc: frm.doc,
        }).then(r => {
             frm.refresh_field("expenses");
             frm.refresh();
        });

		$.each(frm.doc.expenses || [], function(i, d) {
			d.mode_payment = frm.doc.payment_mode;
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
           // $('*[data-fieldname="rib_party"]').hide();
		  }
		});
	}
});
