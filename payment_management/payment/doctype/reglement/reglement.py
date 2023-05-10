# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Reglement(Document):
	pass
	def after_insert(self):
		if self.expenses:
			for item in self.expenses:
				frappe.db.set_value("Despenses", item.reference, {
					"state": item.state,
					"mode_payment": item.mode_payment})
	def after_save(self):
		if self.expenses:
			for item in self.expenses:
				frappe.db.set_value("Despenses", item.reference, {
					"state": item.state,
					"mode_payment": item.mode_payment})

	def validate(self):
		compteur = 0
		if self.is_new():
			self.state = 'EMIS'
			if self.payment_mode == 'Cheque':
				chequier = frappe.get_doc('Chequier', {"account": self.accounts})
				if chequier.numero_dernier_cheque == chequier.first_num:
					numero_cheque = chequier.numero_dernier_cheque
				else:
					numero_cheque = chequier.numero_dernier_cheque + 1
				if self.expenses:
					for item in self.expenses:
						compteur += 1
						if compteur != 1:
							numero_cheque = numero_cheque + 1
						item.num_cheque = numero_cheque
						if compteur == len(self.expenses):
							chequier.numero_dernier_cheque = item.num_cheque
						row = chequier.append('cheques_details', {})
						#Set values for the item fields
						row.num_cheque = item.num_cheque
						row.account = self.accounts
						row.bank = self.banque
						row.debit_operation = item.montant_net
						row.credit_operation = '0.00'
						row.type_operation = 'Chéque Emis'
						row.tiers = item.tiers
						row.amount = item.montant_net
						row.date_emission = item.date_emission
						row.depose = 0
						chequier.save()
						let_cheque = frappe.new_doc("Lettre Cheque")
						let_cheque.tiers = item.tiers
						let_cheque.account = self.accounts
						let_cheque.rib = self.rib
						let_cheque.bank = self.banque
						compte = frappe.get_doc("Compte Societe", self.accounts)
						let_cheque.agence = compte.agence
						let_cheque.adresse = compte.adresse
						let_cheque.tel = compte.tel
						let_cheque.sign = compte.sign
						let_cheque.default_currency = item.default_currency
						let_cheque.depense = item.reference
						let_cheque.societe_name = self.societe_name
						let_cheque.amount = item.montant_net
						let_cheque.num_cheque = item.num_cheque
						let_cheque.date_emission = item.date_emission
						#modele_cheque = frappe.get_doc('Modele de cheque', {"nom_de_banque": self.banque})
						#let_cheque.cheque = modele_cheque.cheque_print_preview
						let_cheque.insert()
						if item.default_currency != self.default_currency:
							frappe.throw("Devise des depenses doivent etre similaire au Devise du compte")
	@frappe.whitelist()
	def validate_reglement(self):
		self.state = 'VALIDE'
		self.date_validation = frappe.utils.today()
		if self.expenses:
			for item in self.expenses:
				item.state = 'VALIDEE'
				item.date_validation = frappe.utils.today()
				frappe.db.set_value("Despenses", item.reference, {
					"state": 'VALIDEE',
					"date_validation": frappe.utils.today()})
		self.save()
	#@frappe.whitelist()
	#def mode_reglement(self):
		#compteur = 0
		#chequier = frappe.get_doc('Chequier', {"account": self.accounts})
		#if chequier.numero_dernier_cheque == chequier.first_num:
		#	numero_cheque = chequier.numero_dernier_cheque
		#else:
		#	numero_cheque = chequier.numero_dernier_cheque + 1
		#if self.expenses:
			#for item in self.expenses:
				#compteur += 1
				#if compteur == 1:
					#numero_ch = numero_cheque
				#else:
					#numero_ch = numero_cheque + 1
				#item.mode_payment = self.payment_mode
				#item.num_cheque = numero_ch
	@frappe.whitelist()
	def mode_reglement(self):
		if self.expenses:
			for item in self.expenses:
				item.mode_payment = self.payment_mode




