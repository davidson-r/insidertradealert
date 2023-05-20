
source .local.env
pip3 freeze > requirements.txt

# ec2 install


sudo apt-get update
sudo apt install python3-pip
git clone git@github.com:davidson-r/insidertradealert.git
cd insidertradealert
pip3 install -r requirements.txt

sudo add-apt-repository universe
sudo apt install docker-compose
sudo systemctl enable docker
sudo apt install postgresql-client-common
sudo apt-get install postgresql-client



# ingest

python3 scripts/ingest_submissions.py

# Useful commands

pip3 freeze > requirements.txt


# ec2
c3.2xlarge
t2.micro


# psql
sudo psql -h localhost -p 5432 -U postgres

### open PSQL port
sudo ufw allow 5432/tcp


# Execute script
sh download_data.sh

