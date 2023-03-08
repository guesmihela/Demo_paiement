from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in payment_management/__init__.py
from payment_management import __version__ as version

setup(
	name="payment_management",
	version=version,
	description="payement management",
	author="tnt",
	author_email="tnt",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
