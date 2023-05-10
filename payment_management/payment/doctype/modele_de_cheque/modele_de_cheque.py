# Copyright (c) 2023, Mohamed Ben Salem && Samar Othmeni and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from PIL import Image, ImageDraw, ImageFont
import os
import io
import base64
from PIL import Image, ImageDraw, ImageFont
import base64
import os
from io import BytesIO

class Modeledecheque(Document):
	pass

@frappe.whitelist()
def create_or_update_modele_du_cheque(template_name):
	if not frappe.db.exists("Print Format", template_name):
		cheque_print = frappe.new_doc("Print Format")
		cheque_print.update(
			{
				"doc_type": "Lettre Cheque",
				"standard": "No",
				"custom_format": 1,
				"print_format_type": "Jinja",
				"name": template_name,
			}
		)
	else:
		cheque_print = frappe.get_doc("Print Format", template_name)
	doc = frappe.get_doc("Modele de cheque", template_name)
	numero_compte = "11111111111111"

	# Créer une image CMC7 à partir du numéro de compte
	image = Image.new("RGB", (900, 300), (255, 255, 255))
	draw = ImageDraw.Draw(image)
	font_path = os.path.join(frappe.get_app_path("payment_management"), "payment", "doctype", "modele_de_cheque", "CMC7____.TTF")
	font = ImageFont.truetype(font_path, size=48)
	cmc7 = draw.text((50, 50), numero_compte, font=font, fill=(0, 0, 0))
	# Get the CMC7 image data as a base64-encoded string
	buffer = io.BytesIO()
	image.save(buffer, format="PNG")
	image_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
	text_width, text_height = draw.textsize(numero_compte, font=font)
	#####################

	numero_compte = "11111111111111"

	# Load font
	app_path = frappe.get_app_path("payment_management")
	font_path = os.path.join(app_path, "payment", "doctype", "modele_de_cheque", "CMC7____.TTF")
	font = ImageFont.truetype(font_path, size=48)

	# Get text dimensions
	text_width, text_height = font.getsize(numero_compte)

	# Create image buffer
	image = Image.new("RGB", (text_width + 100, text_height + 100), (255, 255, 255))
	draw = ImageDraw.Draw(image)
	# Draw text
	cmc7 = draw.text((50, 50), numero_compte, font=font, fill=(0, 0, 0))
	print(cmc7)

	# Save image buffer to byte array
	image_data = BytesIO()
	image.save(image_data, format="PNG")
	image_data = image_data.getvalue()

	# Encode byte array as base64 string
	image_data = base64.b64encode(image_data).decode("utf-8")
	#########'''''#############
	# Set the font path
	app_path = frappe.get_app_path("payment_management")
	font_path = os.path.join(app_path, "payment", "doctype", "modele_de_cheque", "CMC7____.TTF")

	# Set the font
	font = ImageFont.truetype(font_path, size=48)

	# Set the number to be converted to CMC7
	numero_compte = "11111111111111"

	# Get the size of the text
	text_width, text_height = font.getsize(numero_compte)

	# Set the size of the image
	image = Image.new("RGB", (text_width, text_height), color="white")

	# Draw the text on the image
	draw = ImageDraw.Draw(image)
	draw.text((0, 0), numero_compte, font=font, fill=(0, 0, 0))

	# Save the image to a buffer
	buffered = BytesIO()
	image.save(buffered, format="PNG")

	# Get the image data from the buffer
	img_str = base64.b64encode(buffered.getvalue()).decode()

	cmc7_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
	cheque_print.html = """
	<link href="https://fonts.cdnfonts.com/css/cmc-7" rel="stylesheet">           
		<style>
		@import url('https://fonts.cdnfonts.com/css/cmc-7');
		#cmc7-account-number {
  background-image: url('data:image/jpeg;base64,{{ cmc7_base64 }}');
  background-size: cover;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#cmc7-account-number span {
  font-family: CMC7;
  font-size: 48px;
  text-align: center;
  width: 100%;
}
		<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
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
		 .ordre-recv {
         }
         .dest-cl{
         text-shadow: none !important;
         float: right;
         margin-top: 40px;
         margin-right: 100px;
         text-align: right;
        }
        .cheque{
         margin-top: 30px;
         margin-left: 70px;
        }
        .expd-cl{
         text-shadow: none !important;
         float: right;
         margin-left: 70px;
         margin-top: 20px;
        }
        .coord-cl{
         text-shadow: none !important;
         text-align: left;
         float: left;
         margin-left: 70px;
         margin-top: 80px;
        }
        .body-cl{
         margin-left: 70px;
         margin-top: 20px;
         text-shadow: none !important;
         text-align: left;
         float: left;
        }
        hr.new2 {
        border-top: 1px dashed black;
        margin-left: 70px;
        margin-right: 70px;
        }
		 </style>
		<div class ="coord-cl">
        <b>Bénéficiare :  {{doc.tiers}}</b><br/>
        Adresse : <br/>
        Code postal : <br/>
        Ville : <br/>
        </div>
       <div class ="expd-cl">
       <p>
       <b>Expéditeur : {{doc.societe_name}}</b><br/>
        Adresse: <br/>
        Code postal: <br/>
        Ville: <br/>
       </p>
       </div>
    <div class ="body-cl">
        <div class ="ordre-recv"><p><u><b>OBJET : Paiement par Chèque de {{frappe.utils.money_in_words(doc.amount)}} pour {{doc.depense}}</b></u></p></div>
       <p>Chère Madame, Cher Monsieur,</p>
<p>Je vous adresse ci-joint un chèque de <b> {{frappe.utils.money_in_words(doc.amount)}}</b> (<b>{{doc.amount}}{{doc.default_currency}}</b>) pour le règlement de <b>{{doc.depense}}</b>. Le chèque porte le numéro <b>{{doc.num_cheque}}</b> et a été émis à partir de la banque <b>{{doc.bank}}</b> pour être débité de mon compte bancaire.</p>
<p>Veuillez noter que ce chèque est valable uniquement pour le règlement de la depense <b>{{doc.depense}}</b> et ne peut pas être encaissé pour une autre raison.</p>
<p>Je vous prie de bien vouloir l'encaisser dès que possible et de me faire parvenir un accusé de réception.</p>
<p>Je vous remercie de l'attention que vous porterez à ce paiement et reste à votre disposition pour toute information complémentaire.</p>
<p>Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.</p>
       </div>
<div class ="dest-cl">
     <p><b>{{doc.societe_name}}</b><br/>
    </div>
    <span><i class="fas fa-cut"></i><span>       
    <hr class="new2">
    <div id="cmc7-account-number"><span>{{ numero_compte }}</span></div>

    <div><img src="data:image/png;base64,"""+img_str+"""></div>
		 <div class ="cheque" style="position: relative;">
			<div style="position: relative; height: 8cm;width:17.7cm;">
			<div style="width:  %(largeur_du_cheque)scm; 
				height: %(hauteur_du_cheque)scm;">
				<img src="%(logo)s" style="position: absolute; left: %(logo_gauche)scm;top: %(logo_inf)scm;width: %(logo_width)scm;height: %(logo_heigth)scm;"/>
				<span style="top:%(num_supp)scm;
                left: %(num_gauche)scm;
                position: absolute; font-weight:bolder;"> {{ doc.num_cheque or '' }} </span>
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
                position: absolute; font-weight: bold;"> {{ doc.amount or '' }}</span>
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
                font-weight: bold;" > {{frappe.utils.money_in_words(doc.amount)}}</span>
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
                position: absolute;font-size:12.5px; font-weight: bold;">{{doc.tiers or''}}</span>
				<span style="top:3.5cm;
                left: 16.9cm;
                position: absolute;font-size:11px;font-family: 'Noto Naskh Arabic', serif;">لأمر</span>
				<fieldset style="display:inline-block;border:0.5px solid #000; width:%(pay_width)scm; padding:16px; margin-top:%(dist_pay_top_edge)scm; margin-left:%(dist_pay_left_edge)scm; height:%(pay_height)scm">
				<legend style="font-size: 9px; border:none;margin: 0px;"><span>Payable à </span> <span style="float:right;"> يدفع بـ</span></legend>
				  <span style="left: %(agence_gauche)scm; top:%(agence_supp)scm; position: absolute; font-weight:bold;">{{doc.agence or ''}}</span>
				  <span style="left: %(add_gauche)scm; top:%(add_supp)scm; position: absolute; font-weight:bold;">{{doc.adresse or ''}}</span><br>
				  <span style=left: %(tel_gauche)scm; top:%(tel_supp)scm; position: absolute; font-weight:bold;">{{doc.tel or ''}}</span>	
				  <span style=left: %(date_cpt_gauche)scm; top:%(date_cpt_supp)scm; position: absolute; font-weight:bold;">{{doc.date_creation or ''}}</span>											
				</fieldset>
				<fieldset style="display:inline-block; padding:16px; margin-top:%(dist_tit_top_edge)scm;margin-left:%(dist_tit_left_edge)scm; width: %(tit_width)scm;height:%(tit_height)scm; text-align: center; border: 0.5px solid;">
					<legend style="font-size: 9px; border:none;margin: 0px;"><span style="float: left;">Titulaire du compte</span><span style="float:right;">صاحب الحساب</span></legend>
					<legend style="font-size: x-small; display:block; width: auto; padding: 0 10px; top:5.7cm;position:absolute;left:6cm; border:none;"> <span style="background-color: white;">, le</span></legend>
					<legend style="font-size: x-small; position:absolute;  bottom: 0; padding: 0 1px;top:5.7cm;left:4cm;padding: 0 5px;background: white;width:4px"> <span style="padding-top: 34px; background-color: white;">A</span></legend>
					<legend style="font-size: x-small; position:absolute;  bottom: 0; padding: 0 5px;background: white;width:4px;left:8.8cm;top:5.7cm;"> <span style="padding:0 2px; background-color:white">في</span></legend>
					<legend style="font-size: x-small; position:absolute;  bottom: 0; padding: 0 1px;width:4px; background-color:white;left:11.3cm;top:5.7cm;"> <span style="padding-top: 34px; background-color: white;">بـ</span></legend>
					<div>
							<span style="position:absolute;top: %(num_cpt_supp)scm; left:%(num_cpt_gauche)scm; font-weight:bold;">{{doc.rib}}</span>
							<span style="position:absolute;top: %(nom_supp)scm; left:%(nom_gauche)scm;font-weight:bold;">{{doc.societe_name or ''}}</span></div>
							<span style="position:absolute;top:0.84cm;left:20px;"></span>
							<span style="position:absolute;top:%(date_supp)scm;left:%(date_gauche)scm;font-weight:bold;"> {{ frappe.utils.formatdate(doc.date_emission) or '' }}</span>
							<span style="position:absolute;top:0.84cm;left:220px;"></span>
							</fieldset>
					<fieldset style="display:inline-block;border:0.5px solid #000; width:%(sign_width)scm; padding:19px; margin-top:%(dist_sign_top_edge)scm; margin-left:%(dist_sign_left_edge)scm; height:%(sign_height)scm;">
					<legend style="font-size: 9px; border:none;"><span style="float:left;">Signature (s) </span><span style="float:right;">الإمضاء</span></legend>
						<span style="position:absolute;left:%(sign_left)scm; top:%(sign_top)scm; ;font-weight:bold;"> Signature</span></fieldset>
					<span style="position: absolute; left:2.3cm ; top: 7cm;">
						<div class="cmc7">[7204237103108]0050011500450326{</div>
					</span>
			</div>
		</div>
		</div>
		</div>
		""" % {
		"largeur_du_cheque": doc.largeur_du_cheque,
		"hauteur_du_cheque": doc.hauteur_du_cheque,
		"logo_inf": doc.logo_inf,
		"logo_gauche": doc.logo_gauche,
		"logo_width": doc.largeur_logo,
		"logo_heigth": doc.hauteur_logo,
		"logo": doc.logo,
		"num_supp": doc.num_supp,
		"num_gauche": doc.num_gauche,
		"chiff_sup": doc.chiff_sup,
		"chiff_gauche": doc.chiff_gauche,
		"lettre_supp": doc.lettre_supp,
		"date_cpt_gauche":doc.date_cpt_gauche,
		"date_cpt_supp":doc.date_cpt_supp,
		"lettre_gauche": doc.lettre_gauche,
		"largeur_du_montant_en_mot": doc.largeur_du_montant_en_mot,
		"line_spacing_for_amount_in_words": doc.line_spacing_for_amount_in_words,
		"pay_width": doc.pay_width,
		"pay_height": doc.pay_height,
		"agence_gauche":doc.agence_gauche,
		"agence_supp":doc.agence_supp,
		"dist_pay_top_edge": doc.dist_pay_top_edge,
		"dist_pay_left_edge": doc.dist_pay_left_edge,
		"dist_tit_top_edge":doc.dist_tit_top_edge,
		"dist_tit_left_edge":doc.dist_tit_left_edge,
		"tit_width":doc.tit_width,
		"tit_height":doc.tit_height,
		"ben_supp": doc.ben_supp,
		"ben_gauche": doc.ben_gauche,
		"sign_supp": doc.sign_top,
		"sign_gauche": doc.sign_left,
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
		"dist_sign_top_edge":doc.dist_sign_top_edge,
		"dist_sign_left_edge":doc.dist_sign_left_edge,
		"sign_width":doc.sign_width,
		"sign_height":doc.sign_height,
		"sign_top":doc.sign_top,
		"sign_left":doc.sign_left
	}
	cheque_print.save(ignore_permissions=True)
	frappe.db.set_value("Modele de cheque", template_name, "check", 1)
	return cheque_print

