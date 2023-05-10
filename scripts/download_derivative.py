
import requests
from headers import headers
import xmltodict


url1="https://www.sec.gov/Archives/edgar/data/1270710/000089924323012302/doc4.xml"
url2="https://www.sec.gov/Archives/edgar/data/1578732/000120919123027532/doc4.xml"
multi="https://www.sec.gov/Archives/edgar/data/1701967/000159653223000110/edgardoc.xml"
url3="https://www.sec.gov/Archives/edgar/data/922224/000120919123004678/doc4.xml"


response = requests.get(url3, headers=headers)
# print(response.content)
print(xmltodict.parse(response.content))
