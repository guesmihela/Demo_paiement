# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class JourneeDepenses(Document):
	pass
	def validate(self):
		if self.is_new():
			self.state = 'Non Cloturée'
		items = self.depenses
		for item in items:
			doc = frappe.get_doc("Despenses", item.depense)
			doc.journee = self.name
			doc.save()
