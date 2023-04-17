// Copyright (c) 2023, tnt and contributors
// For license information, please see license.txt

frappe.provide("erpnext.cheque_print");
frappe.ui.form.on('Template Impression Cheque', {
	refresh: function(frm) {
		if(!frm.doc.__islocal) {
			frm.add_custom_button(frm.doc.has_print_format?__("Update Print Format"):__("Create Print Format"),
				function() {
					erpnext.cheque_print.view_cheque_print(frm);
				}).addClass("btn-primary");

			$(frm.fields_dict.cheque_print_preview.wrapper).empty()
			var template = '<div style="position: relative; overflow-x: scroll;">\
				<div id="cheque_preview" style="width: {{ cheque_width }}cm; \
					height: {{ cheque_height }}cm;\
					background-repeat: no-repeat;\
					background-size: cover;">\
					<span style="display:inline-block; top: {{ dist_num_cheque_top_edge }}cm;\
						left: {{ dist_num_cheque_left_edge }}cm;\
						position: absolute;"> N° du cheque </span>\
					<img src="{{logo_cheque}}" style="display:inline-block; width:4.6cm; height:1.3cm; position:absolute; top:0.5cm;left:6.3cm;">\
					<span style="display:inline-block; top: {{ amt_in_figures_from_top_edge }}cm;\
						left: {{ amt_in_figures_from_left_edge }}cm;\
						position: absolute;"> BPD </span>\
					<span style="top:{{ amt_in_words_from_top_edge }}cm;\
						left: {{ amt_in_words_from_left_edge }}cm;\
						position: absolute;\
						display: block;\
						width: {{ amt_in_word_width }}cm;\
						line-height: {{ amt_in_words_line_spacing }}cm;\
						word-wrap: break-word;"> Payez contre ce chèque non endossable </span>\
					<fieldset style ="display:inline-block;border:1px solid #000; width:3.6cm; padding:16px; margin-top:4.4cm; margin-left:0.3cm; height:2.2cm"><legend style ="padding: 6px 6px; font-size:9px;"><span>Payable à &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp يدفع بـ</span></legend>\
					</fieldset>\
					<fieldset style =" display:inline-block;border:1px solid #000; width:7.4cm; padding:16px; margin-top:4.4cm; margin-left:0.3cm"><legend style ="padding: 10px 10px; font-size:9px;"><span>Titulaire du compte </span><span>صاحب الحساب</span></legend>\
					<span style="top: {{ acc_no_dist_from_top_edge }}cm;\
						left: {{ acc_no_dist_from_left_edge }}cm;\
						position: absolute;"> Acc. No. </span>\
						<span style="top: {{ payer_name_from_top_edge }}cm;\
						left: {{ payer_name_from_left_edge }}cm;\
						position: absolute;"> foulen. </span>\
					<span style="top: {{ place_dist_from_top_edge }}cm;\
						left: {{ place_dist_from_left_edge }}cm;\
						position: absolute;"> A </span>\
						<span style="top: {{ place_dist_from_top_edge }}cm;\
						left: {{ place_dist_from_left_edge }}cm;\
						position: absolute;"> </span>\
						<span style="top: {{ date_dist_from_top_edge }}cm;\
						left: {{ date_dist_from_left_edge }}cm;\
						position: absolute;"> Le </span>\
						<span style="top: {{ date_dist_from_top_edge }}cm;\
						left: 7cm;\
						position: absolute;"> {{ frappe.datetime.obj_to_user() }} </span>\
					</fieldset>\
					<fieldset style =" display:inline-block;border:1px solid #000; width:5.7cm; padding:16px; margin-top:4.4cm; margin-left:0.3cm; height:2.2cm;"><legend style ="padding: 8px 8px;font-size:0.8rem;">Signature(S)</legend>\
					<span style="top: {{ signatory_from_top_edge }}cm;\
						left: {{ signatory_from_left_edge }}cm;\
						position: absolute;"></span>\
					</fieldset>\
				</div>\
			</div>';
			$(frappe.render(template, frm.doc)).appendTo(frm.fields_dict.cheque_print_preview.wrapper)

		}
	}
});
erpnext.cheque_print.view_cheque_print = function(frm) {
	frappe.call({
		method: "payment_management.payment.doctype.template_impression_cheque.template_impression_cheque.create_or_update_cheque_print_format",
		args:{
			"template_name": frm.doc.name
		},
		callback: function(r) {
			if (!r.exe && !frm.doc.has_print_format) {
				var doc = frappe.model.sync(r.message);
				frappe.set_route("Form", r.message.doctype, r.message.name);
			}
			else {
				frappe.msgprint(__("Print settings updated in respective print format"))
			}
		}
	})
}
