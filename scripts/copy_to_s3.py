# import boto3
# import os
# import platform


# s3 = boto3.resource(
#     's3',
#     # region_name='us-east-1',
#     aws_access_key_id=os.getenv('aws_access_key_id'),
#     aws_secret_access_key=os.getenv('aws_secret_access_key')
# )
# content="String content to write to a new S3 file"
# s3.Object('insidertradealert', 'raw/form4/newfile.txt').put(Body=content)


# submissions_path="data/form4"
# forms = os.listdir(submissions_path)


# print(forms)
