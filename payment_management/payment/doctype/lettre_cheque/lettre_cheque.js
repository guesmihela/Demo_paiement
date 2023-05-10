// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.ui.form.on('Lettre Cheque', {
	refresh: function(frm) {
	  frm.disable_save();
      frm.add_custom_button(__("Exporter Lettre Cheque"), function() {
        frm.call("get_lettre").then(r => {
				var w = window.open(
			    frappe.urllib.get_full_url("/api/method/payment_management.payment.doctype.lettre_cheque.lettre_cheque.generate_lettre?")
		        + "html=" + r.message
		        );
	   });
	       /*frappe.call({
	           method:'validate_reglement',
               doc: frm.doc,
            }).then(r => {
                frm.refresh();
                msgprint(__(" Validation effectuée avec succès"));
               });*/
	     }).addClass("btn-primary");
	}
});
