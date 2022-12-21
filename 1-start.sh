#!/bin/sh

# Check and install nodejs and ganache (require network)
ganache --version
if [ $? ] ; then
    node -v
    if [ $? ] ; then
        echo "Installing NodeJS..."
        sudo apt update
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
        sudo apt-get install -y nodejs
    else
        echo "NodeJS is already installed"
    fi
    echo "Installing Ganache-cli..."
    npm install -g ganache
else
    echo "Ganache is already installed"
fi

# Check and install truffle (require network)
truffle -v
if [ $? ] ; then
    echo "Installing Truffle..."
    npm install -g truffle
else
    echo "Truffle is already installed"
fi

# Check and install dependencies (require network)
npm ls lite-server
if [ $? ] ; then
    echo "Installing lite-server and dependencies..."
    npm install
else
    echo "lite-serber is already installed"
fi

# Run ganache in detached mode (start Ethereum private network)
if [ $GANACHE ] ; then
    ganache instances stop $GANACHE
fi
GANACHE=$(ganache -h 0.0.0.0 -p 7545 --wallet.accountKeysPath ./account-keys.json -D)

# Compile and test smart contract
truffle compile && truffle test


# Migrate smart contract to ganache (deploy smart contract on network)
truffle migrate

# Run webserver
npm run dev