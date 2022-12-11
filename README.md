# QLVT_Ethereum
A supply manager Dapps based on Ethereum.

### Prerequisites
- Ubuntu OS, NodeJS
- [Truffle](https://trufflesuite.com/docs/truffle/how-to/install/)
- [Ganache](https://trufflesuite.com/ganache/)/[Ganache CLI](https://github.com/trufflesuite/ganache)

### Install
```
git clone https://github.com/BuiKimPhat/QLVL_Ethereum.git
cd QLVL_Ethereum
npm install
```

### Run Ganache
Start Ganache and reconfig the server to run on all interfaces (0.0.0.0). The RPC server should be running on port 7545.

### Edit truffle config file
Open and edit `./truffle-config.js` file. Change the host IP of the development network to the IP of the server running Ganache.

### Compile, build and test
```
truffle compile
truffle test
```

### Apply changes of the contract and deploy to the network (reset everything)
```
truffle migrate --reset
```

### Run the Web UI of the Dapps
```
npm run dev
```

You can initialize the sample data on the `createSupply.html` page. Just press the **Khởi tạo dữ liệu** button.