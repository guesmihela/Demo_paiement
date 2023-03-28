# Copyright (c) 2023, tnt and contributors
# For license information, please see license.txt

import frappe
import random
from frappe.model.document import Document

class Compte(Document):
	pass


def generate_rib():
	# Génération d'un RIB
	bank_code = "20041"
	branch_code = "{:05d}".format(random.randint(0, 99999))
	account_number = "{:010d}".format(random.randint(0, 9999999999))
	rib_key = "{:02d}".format(random.randint(0, 99))
	rib = bank_code + branch_code + account_number + rib_key

	# Calcul de la clé RIB
	key = 97 - (int(rib) * 100 % 97)

	# Formatage du RIB complet avec la clé RIB
	formatted_rib = bank_code + " " + branch_code[:2] + " " + branch_code[2:] + " " + account_number[:2] + " " + \
					account_number[2:5] + " " + account_number[5:] + " " + "{:02d}".format(key)
	return formatted_rib


# Exemple d'utilisation
rib = generate_rib()
print("RIB généré : ", rib)
