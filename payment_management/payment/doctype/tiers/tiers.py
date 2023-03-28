# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _

class Tiers(Document):
	pass
	def validate(self):
		self.set_default_account()
	def set_default_account(self):
		if not self.acounts:
			self.default_account = ""
			return
		if len([account.compte for account in self.acounts if account.is_default]) == 0:
			frappe.throw(_("Tiers doit avoir un {0} par defaut.").format(frappe.bold("Compte")))
		elif len([account.compte for account in self.acounts if account.is_default]) > 1:
			frappe.throw(_("un seul {0} peut etre compte par defaut.").format(frappe.bold("Compte")))
		default_account_exists = False
		for d in self.acounts:
			if d.is_default == 1:
				default_account_exists = True
				self.default_account = d.compte.strip()
				break
		if not default_account_exists:
				self.default_account = ""
@frappe.whitelist()
def get_party_details(party_type, party):
	bank_account = ""
	if not frappe.db.exists(party_type, party):
		frappe.throw(_("Invalid {0}: {1}").format(party_type, party))
	#party_account = get_party_account(party_type, party, company)
	#account_currency = get_account_currency(party_account)
	#account_balance = get_balance_on(party_account, date, cost_center=cost_center)
	_party_name = "title" if party_type == "Shareholder" else party_type.lower() + "_name"
	party_name = frappe.db.get_value(party_type, party, _party_name)
	_party_type = party_type.lower() + "_type"
	type = frappe.db.get_value(party_type, party, _party_type)
	#if party_type in ["Customer", "Supplier"]:
		#bank_account = get_party_bank_account(party_type, party)
	return {
		#"party_account": party_account,
		"first_name": party_name,
		"type": type,
		#"party_account_currency": account_currency,
		#"party_balance": party_balance,
		#"account_balance": account_balance,
		#"bank_account": bank_account,
	}


