# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class BordereauVirement(Document):
	pass
	def autoname(self):
		self.name = self.reference + "_" + self.account

