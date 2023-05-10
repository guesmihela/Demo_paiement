# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

class Societe(Document):
	pass

	#def after_save(self):
		#if self.accounts_company:
			#for row in self.accounts_company:
				#frappe.db.set_value("Compte Societe", row.compte, "is_default", row.is_default)
	def validate(self):

		if self.accounts_company:
			for row in self.accounts_company:
				frappe.db.set_value("Compte Societe", row.compte, "is_default", row.is_default)
		#for row in self.accounts_company:
			#frappe.db.set_value("Compte Societe", row.compte, "is_default", row.is_default)
		self.update_default_account = False
		if self.is_new():
			self.update_default_account = True
		self.validate_abbr()
		current_fiscal = frappe.db.get_value("Global Defaults", None, "current_fiscal_year")
		frappe.db.set_value("Default Global payment", None, "default_societe", self.name)
		frappe.db.set_value("Default Global payment", None, "default_currency", self.default_currency)
		frappe.db.set_value("Default Global payment", None, "current_fiscal_year", current_fiscal)
		global_defaults = frappe.get_doc("Default Global payment")
		global_defaults.check_permission("write")
		global_defaults.on_update()
		# clear cache
		frappe.clear_cache()
		self.set_default_account()


	def validate_abbr(self):
		if not self.abbr:
			self.abbr = "".join(c[0] for c in self.societe_name.split()).upper()

		self.abbr = self.abbr.strip()

		if not self.abbr.strip():
			frappe.throw(_("Abbreviation is mandatory"))

		if frappe.db.sql(
			"select abbr from tabCompany where name!=%s and abbr=%s", (self.name, self.abbr)
		):
			frappe.throw(_("Abbreviation already used for another company"))

	def set_default_account(self):
		if not self.accounts_company:
			self.default_account = ""
			return
		#if len([account.compte for account in self.accounts_company if account.is_default]) == 0:
		#	frappe.throw(_("Société doit avoir un {0} par defaut.").format(frappe.bold("Compte")))
		#elif len([account.compte for account in self.accounts_company if account.is_default]) > 1:
		#	frappe.throw(_("un seul {0} peut etre compte par defaut.").format(frappe.bold("Compte")))

		default_account_exists = False
		for d in self.accounts_company:
			if d.is_default == 1:
				default_account_exists = True
				self.default_account = d.compte.strip()
				break

		if not default_account_exists:
			self.default_account = ""