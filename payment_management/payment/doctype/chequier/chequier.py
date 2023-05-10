# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Chequier(Document):
	pass
	def autoname(self):
		self.name = "CHQ-" + str(self.first_num) + "_" + str(self.last_num)
