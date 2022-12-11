App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('SupplyContract.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SupplyArtifact = data;
      App.contracts.SupplyContract = TruffleContract(SupplyArtifact);

      // Set the provider for our contract
      App.contracts.SupplyContract.setProvider(App.web3Provider);

      // Use our contract to retrieve supplies
      return App.getAllSupplies();
    });

    return App.bindEvents();
  },

  initData: () => {
    $.getJSON('../supplies.json', function (data) {
      for (i = 0; i < data.length; i++) {
        App.createSupply(data[i].id, data[i].name, data[i].quantity, data[i].unit);
      }
    });
  },

  bindEvents: function () {
    $(document).on('click', '.btn-transfer', App.handleTransfer);
    $(document).on('click', '.btn-init-data', App.initData);
    $(document).on('submit', '#newSupplyForm', App.handleNewSupply);
    $(document).on('submit', '#editSupplyForm', App.handleEditSupply);
  },

  getAllSupplies: function () {
    var supplyInstance;

    var supplyRow = $('#supplyRow');
    var supplyTemplate = $('#supplyTemplate');

    App.contracts.SupplyContract.deployed().then(function (instance) {
      supplyInstance = instance;
      console.log(supplyInstance);

      return supplyInstance.GetAllSupplies.call();
    }).then(supplies => {
      console.log(supplies);
      supplyRow.empty();
      const { 0: ids, 1: names, 2: quantities, 3: units, 4: actives } = supplies;
      for (i = 0; i < ids.length; i++) {
        if (!actives[i]) continue;
        supplyTemplate.find('.panel-title').text(names[i]);
        supplyTemplate.find('.supply-id').text(ids[i]);
        supplyTemplate.find('.supply-quantity').text(quantities[i]);
        supplyTemplate.find('.supply-unit').text(units[i]);
        supplyTemplate.find('.btn-transfer').attr('data-id', ids[i]);

        supplyRow.append(supplyTemplate.html());
      }
    }).catch(err => {
      console.log(err);
    })

  },

  createSupply: (id, name, quantity, unit) => {
    var supplyInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) console.log(error);
      var account = accounts[0];
      App.contracts.SupplyContract.deployed().then(function (instance) {
        supplyInstance = instance;
        console.log(supplyInstance);
        return supplyInstance.CreateSupply.sendTransaction(id, name, quantity, unit, {from: account});
      }).then(result => {
        console.log(result);
        window.location.assign("/");
      }).catch(err => {
        console.log(err.message);
      })
    });
  },

  handleNewSupply: (e) => {
    e.preventDefault();
    const id = $('#supply-id').val();
    const name = $('#supply-name').val();
    const quantity = $('#supply-quantity').val();
    const unit = $('#supply-unit').val();
    App.createSupply(id, name, quantity, unit);
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
