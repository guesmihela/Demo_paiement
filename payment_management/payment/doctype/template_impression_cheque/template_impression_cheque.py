# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class TemplateImpressionCheque(Document):
	pass


@frappe.whitelist()
def create_or_update_cheque_print_format(template_name):
	if not frappe.db.exists("Print Format", template_name):
		cheque_print = frappe.new_doc("Print Format")
		cheque_print.update(
			{
				"doc_type": "Payment Entry",
				"standard": "No",
				"custom_format": 1,
				"print_format_type": "Jinja",
				"name": template_name,
			}
		)
	else:
		cheque_print = frappe.get_doc("Print Format", template_name)

	doc = frappe.get_doc("Template Impression Cheque", template_name)

	cheque_print.html = """
<style>
	.print-format {
		padding: 0px;
	}
	@media screen {
		.print-format {
			padding: 0in;
		}
	}
</style>
<div style="position: relative; top:%(starting_position_from_top_edge)scm">
	<div style="width:%(cheque_width)scm;height:%(cheque_height)scm;">	
	<span style="display:inline-block; top:%(dist_lb_num_cheque_top_edge)scm;
						left:%(dist_lb_num_cheque_left_edge)scm;
						position: absolute;">N° du cheque</span>
	<span style="display:inline-block; top:%(dist_num_cheque_top_edge)scm;
						left:%(dist_num_cheque_left_edge)scm;
						position: absolute;"> {{doc.reference_no}} </span>	
					<img style="display:inline-block; width:4.6scm; height:1.3scm; position:absolute; top:0.5scm;left:6.3scm;" src={{logo_cheque}}>
					<span style="display:inline-block; top: %(lb_amt_in_figures_from_top_edge)scm;
						left: %(lb_amt_in_figures_from_left_edge)scm;
						position: absolute;"> BPD </span>
					<span style="top:%(amt_in_figures_from_top_edge)scm;left: %(amt_in_figures_from_left_edge)scm;
			position: absolute; min-width: 4scm;">
			{{doc.get_formatted("base_paid_amount") or doc.get_formatted("base_received_amount")}}
		</span>
					<span style="top:%(lb_amt_in_words_from_top_edge)scm;
						left:%(lb_amt_in_words_from_left_edge)scm;
						position: absolute;
						display: block;
						width: %(amt_in_word_width)scm;
						line-height: %(amt_in_words_line_spacing)scm;
						word-wrap: break-word;">Payez contre ce chèque non endossable</span><span style="top:%(amt_in_words_from_top_edge)scm; left:%(lb_amt_in_words_from_left_edge)scm; 
						padding-top:%(lb_amt_in_words_from_left_edge)scm;
			position: absolute; display: block; width: %(amt_in_word_width)scm;font-size:%(lb_size)scm; word-wrap: break-word;">Sauf au profit d'une banque ou d'un organisme assimilé</span>
						<span style="top:%(amt_in_words_from_top_edge)scm; left:%(amt_in_words_from_left_edge)scm;
			position: absolute; display: block; width: %(amt_in_word_width)scm;
			line-height:%(amt_in_words_line_spacing)scm; word-wrap: break-word;">
				{{frappe.utils.money_in_words(doc.base_paid_amount or doc.base_received_amount)}}
		</span>
					<fieldset style =" display:inline-block;border:1px solid #000; width:3.6scm; padding:16px; margin-top:4.4scm; margin-left:0.3scm; height:2.2scm"><legend style ="padding: 6px 6px; font-size:0.8rem;"><span>Payable à </span></legend>
					</fieldset>
					<fieldset style =" display:inline-block;border:1px solid #000; width:7.4scm; padding:16px; margin-top:4.4cm; margin-left:0.3cm"><legend style ="padding: 10px 10px; font-size:0.8rem;"><span>Titulaire du compte </span></legend>
					<span style="top: {{ acc_no_dist_from_top_edge }}scm;
						left: {{ acc_no_dist_from_left_edge }}scm;
						position: absolute;"> {{ doc.account_no or '' }}</span>
						<span style="top: {{ payer_name_from_top_edge }}scm;
						left: {{ payer_name_from_left_edge }}scm;
						position: absolute;"> foulen. </span>
					<span style="top: {{ place_dist_from_top_edge }}scm;
						left: {{ place_dist_from_left_edge }}scm;
						position: absolute;"> A </span>
						<span style="top: {{ place_dist_from_top_edge }}scm;
						left: {{ place_dist_from_left_edge }}scm;
						position: absolute;"> </span>
						<span style="top: {{ date_dist_from_top_edge }}scm;
						left: {{ date_dist_from_left_edge }}scm;
						position: absolute;"> Le </span>
						<span style="top: {{ date_dist_from_top_edge }}scm;
						left: 7scm;
						position: absolute;"> {{ frappe.utils.formatdate(doc.reference_date) or '' }}</span>
					</fieldset>
					<fieldset style =" display:inline-block;border:1px solid #000; width:5.7cm; padding:16px; margin-top:4.4cm; margin-left:0.3cm; height:2.2cm;"><legend style ="padding: 8px 8px;font-size:0.8rem;">Signature(S)</legend>
						<span style="top:%(signatory_from_top_edge)scm;left: %(signatory_from_left_edge)scm;
			position: absolute;  min-width: 6cm;">
			{{doc.company}}
		</span>
		</fieldset>	
	</div>
</div>""" % {
		"starting_position_from_top_edge": doc.starting_position_from_top_edge
		if doc.cheque_size == "A4"
		else 0.0,
		"cheque_width": doc.cheque_width,
		"cheque_height": doc.cheque_height,
		"dist_num_cheque_top_edge": doc.dist_num_cheque_top_edge,
		"dist_num_cheque_left_edge": doc.dist_num_cheque_left_edge,
		"dist_lb_num_cheque_top_edge": doc.dist_lb_num_cheque_top_edge,
		"dist_lb_num_cheque_left_edge": doc.dist_lb_num_cheque_left_edge,
		"date_dist_from_top_edge": doc.date_dist_from_top_edge,
		"date_dist_from_left_edge": doc.date_dist_from_left_edge,
		"acc_no_dist_from_top_edge": doc.acc_no_dist_from_top_edge,
		"acc_no_dist_from_left_edge": doc.acc_no_dist_from_left_edge,
		"payer_name_from_top_edge": doc.payer_name_from_top_edge,
		"payer_name_from_left_edge": doc.payer_name_from_left_edge,
		"amt_in_words_from_top_edge": doc.amt_in_words_from_top_edge,
		"amt_in_words_from_left_edge": doc.amt_in_words_from_left_edge,
		"lb_amt_in_words_from_top_edge": doc.lb_amt_in_words_from_top_edge,
		"lb_amt_in_words_from_left_edge": doc.lb_amt_in_words_from_left_edge,
		"amt_in_word_width": doc.amt_in_word_width,
		"lb_size": doc.lb_size,
		"amt_in_words_line_spacing": doc.amt_in_words_line_spacing,
		"amt_in_figures_from_top_edge": doc.amt_in_figures_from_top_edge,
		"amt_in_figures_from_left_edge": doc.amt_in_figures_from_left_edge,
		"lb_amt_in_figures_from_top_edge": doc.lb_amt_in_figures_from_top_edge,
		"lb_amt_in_figures_from_left_edge": doc.lb_amt_in_figures_from_left_edge,
		"signatory_from_top_edge": doc.signatory_from_top_edge,
		"signatory_from_left_edge": doc.signatory_from_left_edge,
		"logo_cheque": doc.logo_cheque,
	}

	cheque_print.save(ignore_permissions=True)

	frappe.db.set_value("Template Impression Cheque", template_name, "has_print_format", 1)

	return cheque_print