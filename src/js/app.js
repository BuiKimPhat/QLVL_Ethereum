App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    // $.getJSON('../pets.json', function (data) {
    //   var petsRow = $('#petsRow');
    //   var petTemplate = $('#petTemplate');

    //   for (i = 0; i < data.length; i++) {
    //     petTemplate.find('.panel-title').text(data[i].name);
        // petTemplate.find('img').attr('src', data[i].picture);
    //     petTemplate.find('.pet-breed').text(data[i].breed);
    //     petTemplate.find('.pet-age').text(data[i].age);
    //     petTemplate.find('.pet-location').text(data[i].location);
    //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

    //     petsRow.append(petTemplate.html());
    //   }
    // });

    // Load supplies
    // $.getJSON('../supplies.json', function (data) {
    //   var supplyRow = $('#supplyRow');
    //   var supplyTemplate = $('#supplyTemplate');

    //   for (i = 0; i < data.length; i++) {
    //     if (!data[i].isActive) continue;
    //     supplyTemplate.find('.panel-title').text(data[i].name);
    //     supplyTemplate.find('.supply-quantity').text(data[i].quantity);
    //     supplyTemplate.find('.supply-unit').text(data[i].unit);
    //     supplyTemplate.find('.btn-adopt').attr('data-id', data[i].id);

    //     supplyRow.append(supplyTemplate.html());
    //   }
    // });

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

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleTransfer);
    $(document).on('submit', '#newSupplyForm', App.handleNewSupply);
  },

  getAllSupplies: function() {
    var supplyInstance;

    var supplyRow = $('#supplyRow');
    var supplyTemplate = $('#supplyTemplate');

    App.contracts.SupplyContract.deployed().then(function (instance) {
      supplyInstance = instance;

      return supplyInstance.GetAllSupplies.call();
    }).then(supplies => {
      console.log(supplies);
      supplyRow.empty();
      const [ids, names, quantities, units, actives] = supplies;
      for (i = 0; i < ids.length; i++) {
        if (!actives[i]) continue;
        supplyTemplate.find('.panel-title').text(names[i]);
        supplyTemplate.find('.supply-quantity').text(quantities[i]);
        supplyTemplate.find('.supply-unit').text(units[i]);
        supplyTemplate.find('.btn-adopt').attr('data-id', ids[i]);
  
        supplyRow.append(supplyTemplate.html());
      }  
    }).catch(err => {
      console.log(err);
    })

  },

  createSupply: (id, name, quantity, unit) => {
    var supplyInstance;

    App.contracts.SupplyContract.deployed().then(function (instance) {
      supplyInstance = instance;

      return supplyInstance.CreateSupply.call(id, name, quantity, unit);
    }).then(result => {
      return App.getAllSupplies.call();
    }).catch(err => {
      console.log(err.message);
    })
  },

  handleNewSupply: (e) => {
    e.preventDefault();
    var id = $('#supply-id').val();
    var name = $('#supply-name').val();
    var quantity = $('#supply-quantity').val();
    var unit = $('#supply-unit').val();
    App.createSupply(id,name,quantity,unit);
  }

  // markAdopted: function () {
    // var supplyInstance;

    // App.contracts.SupplyContract.deployed().then(function (instance) {
    //   supplyInstance = instance;

    //   return supplyInstance.GetAllSupplies.call();
    // }).then(function (adopters) {
    //   // for (i = 0; i < adopters.length; i++) {
    //   //   if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
    //   //     $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    //   //   }
    //   // }
    // }).catch(function (err) {
    //   console.log(err.message);
    // });

  // },

  // handleAdopt: function (event) {
  //   event.preventDefault();

  //   var petId = parseInt($(event.target).data('id'));

  //   var supplyInstance;

  //   web3.eth.getAccounts(function (error, accounts) {
  //     if (error) {
  //       console.log(error);
  //     }

  //     var account = accounts[0];

  //     App.contracts.SupplyContract.deployed().then(function (instance) {
  //       supplyInstance = instance;

  //       // Execute adopt as a transaction by sending account
  //       return supplyInstance.Transact(petId, { from: account });
  //     }).then(function (result) {
  //       return App.markAdopted();
  //     }).catch(function (err) {
  //       console.log(err.message);
  //     });
  //   });

  // }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
