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

			var template ='<div style="position: relative; overflow-x: scroll;">\
			<div style="position: relative; height: 8cm;width:17.7cm;">\
			<div style="width: {{ largeur_du_cheque }}cm; \
				height: {{ hauteur_du_cheque }}cm;">\
				<img src="{{logo}}" style="display:inline-block; position: absolute;width:{{largeur_logo}}cm; height:{{hauteur_logo}}cm; left: {{logo_gauche}}cm; top: {{logo_inf}}cm;"/>\
			    <span style="top:{{num_supp}}cm;\
                left: {{num_gauche}}cm;\
                position: absolute; font-weight:bolder;"> 7204237 </span>\
				<span style="top:0.9cm;\
                left: 0.3cm;\
                position: absolute; font-size: x-small; letter-spacing:0.8px">عدد الصك</span>\
				<span style="top:1.18cm;\
                left: 0.3cm;\
                position: absolute;font-size: x-small;">Nº du cheque </span>\
				<span style="top:0.9cm;\
                left: 12.5cm;\
                position: absolute;font-size: 8px;">B.P.D</span>\
				<span style="top:{{chiff_sup}}cm;\
                left: {{chiff_gauche}}cm;\
                position: absolute; font-weight: bold;"> --Montant en chiffre--</span>\
				<span style="top:0.9cm;\
                left: 17.1cm;\
                position: absolute;font-size: x-small;">م.د</span>\
				<span style="top:2.19cm;\
                left: 0.3cm;\
                position: absolute; font-size:10.7px;">Payer contre ce chèque non endossable</span>\
				<span style="top:2.55cm;\
                left: 0.3cm;\
                position: absolute;font-size: 8px;">Sauf au profit d une banque d un organisme assimilé</span>\
				<span style="top:{{lettre_supp}}cm;\
                left: {{lettre_gauche}}cm;\
                position: absolute;\
                width: {{largeur_du_montant_en_mot}}cm;\
                line-height:{{line_spacing_for_amount_in_words}} cm;\
                font-weight: bold;" > -----Montant en lettre -----------------</span>\
				<span style="top:2.2cm;\
                left: 13cm;\
                position: absolute;font-size:10px;width:4.8cm;">إدفعوا مقابل هذا الصك غير القابل للتّظهير</span>\
				<span style="top:2.55cm;\
                left: 13.3cm;\
                position: absolute;font-size:10px; letter-spacing: 0.25px;">إلاّ لفائدة مصرف أو مؤثة ماليّة مماثلة</span>\
				<span style="top:3.5cm;\
                left: 0.3cm;\
                position: absolute;font-size:10.7px;">A l ordre de</span>\
				<span style="top:{{ben_supp}}cm;\
                left: {{ben_gauche}}cm;\
                position: absolute;font-size:12.5px; font-weight: bold;"> -----Bénéficiaire ------------------</span>\
				<span style="top:3.5cm;\
                left: 16.9cm;\
                position: absolute;font-size:11px;">لأمر</span>\
				<fieldset style="position:absolute; top:4.1cm; left:0.3cm; text-align: center;width: 3.5cm; height: 2.1cm; border: 0.5px solid;">\
				<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:32.5px; right:46px">&nbsp&nbsp&nbsp&nbsp&nbsp</span>\
				<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:32.5px; left:46px">&nbsp&nbsp&nbsp&nbsp&nbsp</span>\
                <legend style="font-size: 9px;">Payable à  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp يدفع بـ <div></div></legend>\
				<div style="position:absolute; bottom:3px; left:30px;">\
					<span style="display:block ;margin-top: 0.1cm; font-weight:bold;">Adresse</span>\
					<span style="left: 0cm;position: relative; font-weight:bold;">Telephone</span><br>\
					<span style="left: 0cm;position: relative; font-weight:bold;">date</span>\
				</div>\
				</fieldset>\
				<fieldset style="position:absolute; top:4.1cm;left:4.2cm; width: 7.2cm;height:1.9cm; text-align: center; border: 0.5px solid; " ">\
				<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:32.5px; right:101px">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>\
				<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:32.8px; left:101px; background-color:white;">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>\
					<legend style="font-size: 9px; display: block; width: auto; padding: 0 30px;position:relative; left:10px;"> Titulaire du compte  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp صاحب الحساب</legend>\
					<legend style="font-size: x-small; display: block; width: auto; padding: 0 10px; top:37px;position:absolute;left:60px"> <span style="background-color: white;">le</span></legend>\
					<legend style="font-size: x-small; position: absolute;  bottom: 0; right: 100%;top:1cm;padding: 0 5px;background: white;width:4px"> <span style="padding-top: 35px; background-color: white;">A</span></legend>\
					<legend style="  font-size: x-small; position: absolute;  bottom: 0; left: 70%;transform: translate(-50%, 85%);padding: 0 5px;background: white;width:4px;"> <span style="padding:0 2px; background-color:white">في</span></legend>\
					<legend style="    font-size: x-small; position: absolute;  bottom: 0; left: 99%;transform: translate(-56%, 85%);padding: 0 1px;width:4px; background-color:white;"> <span style="padding-top: 35px; background-color: white;">بـ</span></legend>\
						<div style="position:absolute; bottom:13px; left:70px;">\
							<span style=" display:block ;margin-top: 0.3cm; font-weight:bold;" > Numero du compte</span>\
							<span style="font-weight:bold;""> Nom et Prenom </span></div>\
							<span style="position:absolute;top:35px;left:20px;"></span>\
							<span style="position:absolute;top:35px;left:90px;">{{ frappe.datetime.obj_to_user() }} </span>\
							<span style="position:absolute;top:35px;left:220px;"></span>\
							</fieldset>\
					<fieldset style="position:absolute; top:4.1cm;left:11.7cm; width: 5.6cm;height:2.1cm; text-align: center; border: 0.5px solid;">\
					<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:32.5px; right:86px">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>\
					<span style="position:relative; border-bottom:0.5px solid; width:0.4px;bottom:32.8px; left:53px">&nbsp&nbsp&nbsp</span>\
						<legend style="font-size: 9px; display: block; width: auto; padding: 0 30px;position:relative;left:10px;"> Signature (s) &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp الإمضاء</legend>\
						<span style=" display:block ;font-weight:bold;" > Signature</span></fieldset>\
					<span style="position: absolute; left:2.3cm ; top: 6.8cm; font-family:cmc7;font-weight:bold;font-size:12px">\
						[7204237103108]0050011500450326{\
					</span>\
			</div>\
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
				frappe.set_route("Form", r.message.doctype, r.message.name);
			}
			else {
				frappe.msgprint(__("Print settings updated in respective print format"))
			}
		}
	})
}
