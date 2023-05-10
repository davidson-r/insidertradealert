
source .local.env


# ec2 install


sudo apt-get update
sudo apt install python3-pip
git clone git@github.com:davidson-r/insidertradealert.git
cd insidertradealert
pip3 install -r requirements.txt


# ingest

python3 scripts/ingest_submissions.py

# Useful commands

pip3 freeze > requirements.txt


# ec2
c3.2xlarge
t2.micro
