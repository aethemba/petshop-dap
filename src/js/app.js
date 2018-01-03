App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    // Artifacts are information about our contract such as 
    // its deployed address and Application Binary Interface (ABI)
    // The ABI is a JS object defining how to interact with the contract
    // including its variables, functions and parameters
    $.getJSON('Adoption.json', function(data){
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call(); // Call the blockchain without using ether. Does not create a transaction
    }).then(function(adopters) {
      for (i=0; i < adopters.length; i++) {
        if (adopters[i] != '0x0000000000000000000000000000000000000000') { // Internal representation of an empty address
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err){
      console.log(err.message);
    });

  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts){
      if (error) {
        console.log(error);
      }

      var account  = accounts[0];

      // Get deployed contract
      App.contracts.Adoption.deployed().then(function(instance){
        adoptionInstance = instance;

        // This is not a 'call' but a transaction. The contract requires a 'from' address 
        // and has a gas cost. 
        return adoptionInstance.adopt(petId, {from:account});
      }).then(function(result){
        return App.markAdopted();
      }).catch(function(err){
        // A possible error could be a faulty address or a lack of gas funds
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
