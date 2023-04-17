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
		if self.is_new():
			self.state = 'EMIS'
		if self.expenses:
			for item in self.expenses:
				chequier = frappe.get_doc('Chequier', {"account": self.accounts})
				chequier.numero_dernier_cheque = item.num_cheque
				chequier.save()
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
	@frappe.whitelist()
	def mode_reglement(self):
		chequier = frappe.get_doc('Chequier', {"account": self.accounts})
		if chequier.numero_dernier_cheque == chequier.first_num:
			numero_cheque = chequier.numero_dernier_cheque
		else:
			numero_cheque = chequier.numero_dernier_cheque + 1
		if self.expenses:
			for item in self.expenses:
				item.mode_payment = self.payment_mode
				item.num_cheque = numero_cheque





