# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

# import frappe
import frappe
import frappe.defaults
from frappe.custom.doctype.property_setter.property_setter import make_property_setter
from frappe.utils import cint

keydict = {
	# "key in defaults": "key in Global Defaults"
	"fiscal_year": "current_fiscal_year",
	"company": "default_company",
	"currency": "default_currency",
	"country": "country",
	"hide_currency_symbol": "hide_currency_symbol"
}
from frappe.model.document import Document

class DefaultGlobalpayment(Document):
	def on_update(self):
		"""update defaults"""
		for key in keydict:
			frappe.db.set_default(key, self.get(keydict[key], ""))

		# update year start date and year end date from fiscal_year
		if self.current_fiscal_year:
			if fiscal_year := frappe.get_all(
				"Fiscal Year",
				filters={"name": self.current_fiscal_year},
				fields=["year_start_date", "year_end_date"],
				limit=1,
				order_by=None,
			):
				ysd = fiscal_year[0].year_start_date or ""
				yed = fiscal_year[0].year_end_date or ""

				if ysd and yed:
					frappe.db.set_default("year_start_date", ysd.strftime("%Y-%m-%d"))
					frappe.db.set_default("year_end_date", yed.strftime("%Y-%m-%d"))

		# enable default currency
		if self.default_currency:
			frappe.db.set_value("Currency", self.default_currency, "enabled", 1)
		frappe.clear_cache()

	@frappe.whitelist()
	def get_defaults(self):
		return frappe.defaults.get_defaults()

