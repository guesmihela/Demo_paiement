# Copyright (c) 2023, Mohamed Ben Salem && Samar Othmeni and contributors
# For license information, please see license.txt


import frappe
from frappe import _
from frappe.model.document import Document


class Modeledecheque(Document):
	pass



@frappe.whitelist()
def create_or_update_modele_du_cheque(template_name):
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

	doc = frappe.get_doc("Modele de cheque", template_name)

	cheque_print.html = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500&display=swap');	.print-format {
		padding: 0px;
	}
	@media screen {
		.print-format {
			padding: 0in;
		}
	}
	@font-face {
        font-family: 'myFont';
        src: url('/CMC7____.TTF') format('TTF');
    }
	.cmc7 {
		font-family: 'cmc7';
	}
	

</style>
<div style="position: relative;">
			<div style="position: relative; height: 8cm;width:17.7cm;">
			<div style="width:  %(largeur_du_cheque)scm; 
				height: %(hauteur_du_cheque)scm;">
				<img src="%(logo)s" style="position: absolute; left: %(logo_gauche)scm; bottom: %(logo_inf)scm;"/>
				<span style="top:%(num_supp)scm;
                left: %(num_gauche)scm;
                position: absolute; font-weight:bolder;"> 7204237 </span>
				<span style="top:0.9cm;
                left: 0.3cm;
                position: absolute; font-size: x-small; letter-spacing:0.8px; font-family: 'Noto Naskh Arabic', serif;">عدد الصك</span>
				<span style="top:1.18cm;
                left: 0.3cm;
                position: absolute;font-size: x-small;">Nº du cheque </span>
				<span style="top:0.9cm;
                left: 12.5cm;
                position: absolute;font-size: 8px;">B.P.D</span>
				<span style="top:%(chiff_sup)scm;
                left: %(chiff_gauche)scm;
                position: absolute; font-weight: bold;"> Montant en chiffre</span>
				<span style="top:0.9cm;
                left: 17.05cm;
                position: absolute;font-size: x-small;font-family: 'Noto Naskh Arabic', serif;">م.د</span>
				<span style="top:2.19cm;
                left: 0.3cm;
                position: absolute; font-size:10px;">Payer contre ce chèque non endossable</span>
				<span style="top:2.55cm;
                left: 0.3cm;
                position: absolute;font-size: 7.7px;">Sauf au profit d une banque d un organisme assimilé</span>
				<span style="top:%(lettre_supp)scm;
                left: %(lettre_gauche)scm;
                position: absolute;
                width: %(largeur_du_montant_en_mot)scm;
                line-height:%(line_spacing_for_amount_in_words)scm;
                font-weight: bold;" > Montant en lettre</span>
				<span style="top:2.2cm;
                left: 13.49cm;
                position: absolute;font-size:10px;width:4.8cm;font-family: 'Noto Naskh Arabic', serif;">إدفعوا مقابل هذا الصك غير القابل للتّظهير</span>
				<span style="top:2.55cm;
                left: 13.7cm;
                position: absolute;font-size:10px; letter-spacing: 0.25px;font-family: 'Noto Naskh Arabic', serif;">إلاّ لفائدة مصرف أو مؤثة ماليّة مماثلة</span>
				<span style="top:3.5cm;
                left: 0.3cm;
                position: absolute;font-size:10.7px;">A l ordre de</span>
				<span style="top:%(ben_supp)scm;
                left: %(ben_gauche)scm;
                position: absolute;font-size:12.5px; font-weight: bold;">Bénéficiaire</span>
				<span style="top:3.5cm;
                left: 16.9cm;
                position: absolute;font-size:11px;font-family: 'Noto Naskh Arabic', serif;">لأمر</span>
				<fieldset style="position:absolute; top:4.1cm; left:0.3cm; text-align: center;width: 3.5cm; height: 2.3cm; border: 0.5px solid;">
				<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:42.5px; right:46.33px">&nbsp&nbsp&nbsp&nbsp&nbsp</span>
				<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:42.5px; left:46.33px">&nbsp&nbsp&nbsp&nbsp&nbsp</span>
                <legend style="font-size: 9px;border:none;">Payable à  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp يدفع بـ <div></div></legend>
				<div style="position:absolute; bottom:8px; left:30px;">
					<span style="display:block ;margin-top: 0.1cm;border:none;">Adresse</span>
					<span style="left: 0cm;position: relative;">Telephone</span><br>
					<span style="left: 0cm;position: relative;">date</span>
				</div>
				</fieldset>
				<fieldset style="position:absolute; top:4.1cm;left:4.2cm; width: 7.2cm;height:2.1cm; text-align: center; border: 0.5px solid; " ">
				<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:42.5px; right:119.7px"">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
					<legend style="font-size: 9px; display: block; width: auto; padding: 0 30px;position:relative; left:10px;border:none;"> Titulaire du compte  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp صاحب الحساب</legend>
					<legend style="font-size: x-small; display: block; width: auto; padding: 0 10px; top:0.95cm;position:absolute;left:60px; border:none;"> <span style="padding:0 2px; background-color:white">le</span></legend>
					<legend style="font-size: x-small; position: absolute;  bottom: 0; right: 267px;top:0.95cm;padding: 0 5px;background: white;width:4px;border:none;"> <span style="padding-top: 35px; background-color: white;">A</span></legend>
					<legend style="font-size: x-small; display: block; width: auto; padding: 0 10px; top:0.95cm;position:absolute;left:170px;border:none;"> <span style="padding:0 2px; background-color:white">في</span></legend>
					<legend style="font-size: x-small; display: block; width: auto; padding: 0 3px; top:0.95cm;position:absolute;left:263px;background-color:white;border:none;"> <span style="padding-top: 35px; background-color: white;">بـ</span></legend>
						<div style="position:absolute; bottom:21px; left:70px;">
							<span style=" display:block ;margin-top: 0.3cm;border:none;" > Numero du compte</span>
							<span > Nom et Prenom </span></div>
							<span style="position:absolute;top:0.84cm;left:20px;">Lieu</span>
							<span style="position:absolute;top:0.84cm;left:120px;">Date</span>
							<span style="position:absolute;top:0.84cm;left:220px;">المكان</span>
							</fieldset>
					<fieldset style="position:absolute; top:4.1cm;left:11.7cm; width: 5.6cm;height:2.3cm; text-align: center; border: 0.5px solid;">
					<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:42.9px; right:49px;">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
					<span style="position:relative; border-left:0.5px solid; width:0.4px;bottom:28.75px; right:77.5px">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>

						<legend style="font-size: 9px; display: block; width: auto; padding: 0 30px;position:relative;left:11.74px;border:none;"> Signature (s) &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp الإمضاء</legend>
						<span style=" border:none;" > Signature</span></fieldset>
					<span style="position: absolute; left:2.3cm ; top: 7cm;">
						<div class="cmc7">[7204237103108]0050011500450326{</div>
					</span>
			</div>
		</div>
		</div>
		</div>""" % {
		"largeur_du_cheque": doc.largeur_du_cheque,
		"hauteur_du_cheque": doc.hauteur_du_cheque,
		"logo_inf": doc.logo_inf,
		"logo_gauche": doc.logo_gauche,
		"logo":doc.logo,
		"num_supp": doc.num_supp,
		"num_gauche": doc.num_gauche,
		"chiff_sup": doc.chiff_sup,
		"chiff_gauche": doc.chiff_gauche,
		"lettre_supp": doc.lettre_supp,
		"lettre_gauche": doc.lettre_gauche,
		"largeur_du_montant_en_mot": doc.largeur_du_montant_en_mot,
		"line_spacing_for_amount_in_words": doc.line_spacing_for_amount_in_words,
		"ben_supp": doc.ben_supp,
		"ben_gauche": doc.ben_gauche,
		"sign_supp": doc.sign_supp,
		"sign_gauche": doc.sign_gauche,
		"add_supp": doc.add_supp,
		"add_gauche": doc.add_gauche,
		"tel_supp": doc.tel_supp,
		"tel_gauche": doc.tel_gauche,
		"date_cpt_supp": doc.date_cpt_supp,
		"date_cpt_gauche": doc.date_cpt_gauche,
		"num_cpt_supp": doc.num_cpt_supp,
		"num_cpt_gauche": doc.num_cpt_gauche,
		"nom_supp": doc.nom_supp,
		"nom_gauche": doc.nom_gauche,
		"lieu_supp": doc.lieu_supp,
		"lieu_gauche": doc.lieu_gauche,
		"date_supp": doc.date_supp,
		"date_gauche": doc.date_gauche,
	}

	cheque_print.save(ignore_permissions=True)

	frappe.db.set_value("Modele de cheque", template_name, "check", 1)

	return cheque_print
