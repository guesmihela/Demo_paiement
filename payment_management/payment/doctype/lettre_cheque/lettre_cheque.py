# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import os
from frappe import _
from frappe.model.document import Document
from frappe.utils.pdf import get_pdf

class LettreCheque(Document):
	PDF_CONTENT_ERRORS = ["ContentNotFoundError", "ContentOperationNotPermittedError", "UnknownContentError",
						  "RemoteHostClosedError"]
	path, name_t, name_l, name_p, name_lw = "", "", "", "", ""

	pass
	def autoname(self):
		self.name = "Lettre_cheque - " + str(self.num_cheque)

	@frappe.whitelist()
	def get_lettre(self):
		global path, name_p
		path = frappe.get_site_path('public', 'files')
		name_p = "lettre_cheque -{0}.pdf".format(self.num_cheque)
		lettre_doc = frappe.get_doc('Lettre Cheque', self.name)
		html = frappe.render_template("/payment_management/payment_management/templates/lettre_cheque/lettre.html", {
			"lettre_doc": lettre_doc
		})
		return html
@frappe.whitelist(allow_guest=True)
def generate_lettre(html):
	# Attaching PDF to response
	pl_fname = os.path.join(path, name_p)
	content = get_pdf(html)
	frappe.local.response.filename = pl_fname
	with open(pl_fname, "wb") as f:
		f.write(content)
	with open(pl_fname, "rb") as fileobj:
		filedata = fileobj.read()
		frappe.local.response.filecontent = get_pdf(html)
	frappe.local.response.type = 'pdf'
