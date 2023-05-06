
source .local.env


# ec2 install


sudo apt-get update
sudo apt install python3-pip
git clone git@github.com:davidson-r/insidertradealert.git
cd insidertradealert
pip3 install -r requirements.txt


