import requests
from headers import headers


companies = requests.get("https://www.sec.gov/files/company_tickers.json", headers=headers)
print(companies.json())





