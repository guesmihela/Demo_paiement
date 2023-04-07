# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class Despenses(Document):
	pass
	def validate(self):
		if self.is_new():
			self.state = 'CREE'

	#def validate(self):
		#self.state = 'CREE'

	#def after_save(self):
		#self.state = 'CREE'

