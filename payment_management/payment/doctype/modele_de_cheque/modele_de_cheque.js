// Copyright (c) 2023, Mohamed Ben Salem && Samar Othmeni and contributors
// For license information, please see license.txt

frappe.provide("erpnext.cheque_print");

frappe.ui.form.on('Modele de cheque', {
	refresh: function(frm) {
		if(!frm.doc.__islocal) {
			frm.add_custom_button(frm.doc.check?__("Update Print Format"):__("Create Print Format"),
				function() {
					erpnext.cheque_print.view_cheque_print(frm);
				}).addClass("btn-primary");

			$(frm.fields_dict.cheque_print_preview.wrapper).empty()

			var style = document.createElement('style');
            style.innerHTML = "\
            @font-face {\
              font-family: 'myFont';\
              src: url('/Cmc7.ttf') format('.TTF');\
             }\
            .CMC7 {\
             font-family: 'CMC7';\
             font-weight: bold;\
             font-size: 12px;\
            }";
            // Ajouter la classe à la balise <head> de votre document
           document.getElementsByTagName('head')[0].appendChild(style);
			var template ='<div style="position: relative; overflow-x: scroll;">\
			<div style="width: {{ largeur_du_cheque }}cm; \
				height: {{ hauteur_du_cheque }}cm; padding-left:{{check_gauche}}cm; padding-top:{{check_supp}}cm;">\
				<img src="{{logo}}" style="display:inline-block; position: absolute;width:{{largeur_logo}}cm; height:{{hauteur_logo}}cm; left: {{logo_gauche}}cm; top: {{logo_inf}}cm;"/>\
			    <span style="top:{{num_supp}}cm;\
                left: {{num_gauche}}cm;\
                position: absolute; font-weight:bolder;"> 7204237 </span>\
				<span style="top:{{lbl_num_top_edge}}cm;\
                left: {{lbl_num_ch_left_edge}}cm;\
                position: absolute; font-size: x-small; letter-spacing:0.8px">عدد الصك</span>\
				<span style="top:{{num_supp}}cm;\
                left: {{lbl_num_ch_left_edge}}cm;\
                position: absolute;font-size: x-small;">Nº du cheque </span>\
				<span style="top:{{lbl_amount_top_edge}}cm;\
                left: {{lbl_amount_left}}cm;\
                position: absolute;font-size: 8px;">B.P.D</span>\
				<span style="top:{{chiff_sup}}cm;\
                left: {{chiff_gauche}}cm;\
                position: absolute; font-weight: bold;"> --Montant en chiffre--</span>\
				<span style="top:{{lbl_amount_top_edge}}cm;\
                left: 17.1cm;\
                position: absolute;font-size: x-small;">م.د</span>\
				<span style="top:{{lbl_amnt_word_top}}cm;\
                left: {{lbl_amnt_word_left}}cm;\
                position: absolute; font-size:10.7px;">Payer contre ce chèque non endossable</span>\
				<span style="top:{{lettre_supp}}cm;\
                left: {{lbl_amnt_word_left}}cm;\
                position: absolute;font-size: 8px;">Sauf au profit d une banque d un organisme assimilé</span>\
				<span style="top:{{lettre_supp}}cm;\
                left: {{lettre_gauche}}cm;\
                position: absolute;\
                width: {{largeur_du_montant_en_mot}}cm;\
                line-height:{{line_spacing_for_amount_in_words}} cm;\
                font-weight: bold;" > -----Montant en lettre -----------------</span>\
				<span style="top:{{lbl_amnt_word_top}}cm;\
                left: 13cm;\
                position: absolute;font-size:10px;width:4.8cm;">إدفعوا مقابل هذا الصك غير القابل للتّظهير</span>\
				<span style="top:{{lettre_supp}}cm;\
                left: 13.3cm;\
                position: absolute;font-size:10px; letter-spacing: 0.25px;">إلاّ لفائدة مصرف أو مؤثة ماليّة مماثلة</span>\
				<span style="top:{{ben_supp}}cm;\
                left: {{lbl_ben_left}}cm;\
                position: absolute;font-size:10.7px;">A l ordre de</span>\
				<span style="top:{{ben_supp}}cm;\
                left: {{ben_gauche}}cm;\
                position: absolute;font-size:12.5px; font-weight: bold;"> -----Bénéficiaire ------------------</span>\
				<span style="top:{{ben_supp}}cm;\
                left: 16.9cm;\
                position: absolute;font-size:11px;">لأمر</span>\
                <fieldset style ="display:inline-block;border:0.5px solid #000; width:{{pay_width}}cm; padding:16px; margin-top:{{dist_pay_top_edge}}cm; margin-left:{{dist_pay_left_edge}}cm; height:{{pay_height}}cm">\
                <legend style="font-size: 9px;"><span>Payable à </span> <span style="float:right; padding-bottom: 5px;"> يدفع بـ</span></legend>\
				    <span style="left: {{agence_gauche}}cm; top:{{agence_supp}}cm; position: absolute; font-weight:bold;">Agence</span>\
					<span style="left: {{add_gauche}}cm; top:{{add_supp}}cm; position: absolute; font-weight:bold;">Adresse</span>\
					<span style="left: {{tel_gauche}}cm; top:{{tel_supp}}cm; position: absolute; font-weight:bold;">Telephone</span><br>\
					<span style="left: {{date_cpt_gauche}}cm; top:{{date_cpt_supp}}cm; position: absolute; font-weight:bold;">date</span>\
				</fieldset>\
				<fieldset style="display:inline-block; padding:16px; margin-top:{{dist_tit_top_edge}}cm;margin-left:{{dist_tit_left_edge}}cm; width: {{tit_width}}cm;height:{{tit_height}}cm; text-align: center; border: 0.5px solid;">\
				    <legend style="font-size: 9px;"> <span style="float: left;padding-bottom: 5px;">Titulaire du compte</span> <span style="float:right; padding-bottom: 5px;">صاحب الحساب</span></legend>\
					<legend style="font-size: x-small; display:block; width: auto; padding: 0 10px; top:5.7cm;position:absolute;left:6cm"> <span style="background-color: white;">, le</span></legend>\
					<legend style="font-size: x-small; position:absolute;  bottom: 0; padding: 0 1px;top:5.7cm;left:4cm;padding: 0 5px;background: white;width:4px"> <span style="padding-top: 34px; background-color: white;">A</span></legend>\
					<legend style="font-size: x-small; position:absolute;  bottom: 0; padding: 0 5px;background: white;width:4px;left:8.8cm;top:5.7cm;"> <span style="padding:0 2px; background-color:white">في</span></legend>\
					<legend style="font-size: x-small; position:absolute;  bottom: 0; padding: 0 1px;width:4px; background-color:white;left:11.3cm;top:5.7cm;"> <span style="padding-top: 34px; background-color: white;">بـ</span></legend>\
						<div>\
							<span style="position:absolute;top: {{num_cpt_supp}}cm; left:{{num_cpt_gauche}}cm; font-weight:bold;" > Numero du compte</span><br>\
							<span style="position:absolute;top: {{nom_supp}}cm; left:{{nom_gauche}}cm;font-weight:bold;"> Nom et Prenom </span></div>\
							<span style="position:absolute;top:35px;left:20px;"></span>\
							<span style="position:absolute;top:{{date_supp}}cm;left:{{date_gauche}}cm;">{{ frappe.datetime.obj_to_user() }} </span>\
							<span style="position:absolute;top:35px;left:220px;"></span>\
					</fieldset>\
					<fieldset style ="display:inline-block;border:0.5px solid #000; width:{{sign_width}}cm; padding:19px; margin-top:{{dist_sign_top_edge}}cm; margin-left:{{dist_sign_left_edge}}cm; height:{{sign_height}}cm;"><legend style ="font-size:9px;"><span style="float:left;">Signature (s) </span><span style="float:right;">الإمضاء</span></legend>\
					 <span style="position:absolute;left:{{sign_left}}cm; top:{{sign_top}}cm; ;font-weight:bold;" > Signature</span>\
					</fieldset>\
					<span class ="CMC7" style="position:absolute; left:2.3cm ; top: 6.8cm; font-family:CMC7;font-weight:bold;font-size:12px">\
						[7204237103108]0050011500450326{\
					</span>\
			</div>\
		</div>';

			$(frappe.render(template, frm.doc)).appendTo(frm.fields_dict.cheque_print_preview.wrapper)
		}
	}
});

erpnext.cheque_print.view_cheque_print = function(frm) {
	frappe.call({
		method: "payment_management.payment.doctype.modele_de_cheque.modele_de_cheque.create_or_update_modele_du_cheque",
		args:{
			"template_name": frm.doc.name
		},
		callback: function(r) {
			if (!r.exe && !frm.doc.check) {
				var doc = frappe.model.sync(r.message);
				console.log("dddddddddddddddoc");
				frappe.set_route("Form", r.message.doctype, r.message.name);
			}
			else {
                var doc = frappe.model.sync(r.message);
			    console.log("dddddddddddddddoc" +r.message.doctype);
				frappe.msgprint(__("Print settings updated in respective print format"))
			}
		}
	})
}
