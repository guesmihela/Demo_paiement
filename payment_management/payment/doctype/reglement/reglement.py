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
		if self.expenses:
			for item in self.expenses:
				if item.default_currency != self.default_currency:
					frappe.throw("Devise des depenses doivent etre similaire au Devise du compte")



