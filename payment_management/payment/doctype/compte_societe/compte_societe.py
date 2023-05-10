# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CompteSociete(Document):
	pass
	def autoname(self):
		doc = frappe.get_doc("Societe", self.societe_name)
		self.name = self.bank_name + "-" + doc.abbr
	def after_insert(self):
		societe = frappe.get_doc("Societe", self.societe_name)
		row = societe.append('accounts_company', {})
		row.default_currency = self.default_currency
		row.rib = self.rib
		row.is_default = self.is_default
		row.compte = self.name
		societe.save()
	def validate(self):
		if self.is_new():
			self.date_creation = frappe.utils.today()
		doc = frappe.get_doc("Societe", self.societe_name)
		self.account_name = self.bank_name + "-" + doc.abbr

		#societe = frappe.get_doc("Societe", self.societe_name)
		#row = societe.append('accounts_company', {})
		#row.default_currency = self.default_currency
		#row.rib = self.rib
		#row.is_default = self.is_default
		#row.compte = self.name
		#societe.save()
		#items = [
		#	"compte": self.name,
		#	"default_currency": self.default_currency,
		#	"rib": self.rib,
		#    "is_default" : self.is_default
		#]
		#societe.accounts_company

