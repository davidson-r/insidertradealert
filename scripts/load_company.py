import requests
from headers import headers
from conn import engine


companies = requests.get("https://www.sec.gov/files/company_tickers.json", headers=headers)
companies = companies.json()


# companies = {"0":{"cik_str":320193,"ticker":"AAPL","title":"Apple Inc."},"1":{"cik_str":789019,"ticker":"MSFT","title":"MICROSOFT CORP"},"2":{"cik_str":1652044,"ticker":"GOOGL","title":"Alphabet Inc."},"3":{"cik_str":1018724,"ticker":"AMZN","title":"AMAZON COM INC"},"4":{"cik_str":1067983,"ticker":"BRK-B","title":"BERKSHIRE HATHAWAY INC"},"5":{"cik_str":1045810,"ticker":"NVDA","title":"NVIDIA CORP"},"6":{"cik_str":1326801,"ticker":"META","title":"Meta Platforms, Inc."}}
# companies = list(companies.values())
# companies = ",".join([f"""({x['cik_str']},'{x['title'].replace("'","''")}','{x['ticker']}')""" for x in companies])



for k,v in companies.items():
    print(k)
    with engine.begin() as conn:
        conn.exec_driver_sql(f"""INSERT INTO company (cik, name, ticker) 
                            VALUES ({v['cik_str']}, '{v['title'].replace("'","''")}', '{v['ticker']}')
                            ON CONFLICT (cik) DO UPDATE SET name = EXCLUDED.name, ticker = EXCLUDED.ticker""")
    



