# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class StructureFile(Document):
	pass
	def validate(self):
		'''count = 0
		if self.is_new_doc == '1':
			if self.champs:
				for item in self.champs:
					if item.column_start is not None and item.column_start != '' and item.column_length is not None and item.column_length != '':
						count = count + 1
			if count == 0 :
				frappe.throw("veuillez remplir au moins une ligne avec debut colonne et taille pour que votre structure sera valable ")
		doc = frappe.db.get_value("Data Import", filters={"name": self.import_name})
		if doc:
			frappe.db.set_value("Data Import", doc, "structure", 1)'''
			#doc_obj = frappe.get_doc("Data Import", doc)
			#doc_obj.reload()
			#doc_obj.structure = 1
			#doc_obj.save()
			#doc_obj.reload()
			#frappe.db.set_value("Data Import", doc, "structure", 1)

	@frappe.whitelist()
	def get_fiels(self, doctype):
		meta = frappe.get_meta(doctype)
		fields = meta.fields
		# columns = []
		# Set the child table entries on the "Structure File" document
		for field in fields:
			if field.fieldtype not in ["HTML", "Table", "Column Break", "Section Break"]:
				row = self.append('champs', {})
				row.column_name = field.fieldname
				row.column_length = ""
				row.column_start = ""
				row.column_type = ""
		return fields
	def autoname(self):
		self.name = self.structure_name

