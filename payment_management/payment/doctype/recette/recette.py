# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Recette(Document):
	pass
	def validate(self):
		if self.is_new():
			self.state = 'CREE'
