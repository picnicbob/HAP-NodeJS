var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;


var PiBlindsAccessory = {
open: false,
state: Characteristic.PositionState.STOPPED
};

var blindsUUID = uuid.generate('hap-nodejs:accessories:'+'WindowCovering');
var blinds = exports.accessory = new Accessory('Pi Blinds', blindsUUID);

blinds.username = "00:00:00:00:00:01";
blinds.pincode = "000-00-001";

blinds
.getService(Service.AccessoryInformation)
.setCharacteristic(Characteristic.Manufacturer, "Thunk Labs LLC")
.setCharacteristic(Characteristic.Model, "Pi Blinds")
.setCharacteristic(Characteristic.SerialNumber, "0001");

blinds.on('identify', function(paired, callback) {
		  console.log("Identify the Blinds");
		  callback();
		  });

blinds
.addService(Service.WindowCovering, "Pi Blinds")
.setCharacteristic(Characteristic.TargetPosition, (PiBlindsAccessory.open ? 0 : 100))
.getCharacteristic(Characteristic.TargetPosition)
.on('get', function(callback) {
	callback(null, PiBlindsAccessory.position);
	})
.on('set', function(value, callback) {
	if (value == 0) {
	console.log("Closing the Blinds!");
	callback();
	var service = blinds.getService(Service.WindowCovering);
	PiBlindsAccessory.state = Characteristic.PositionState.DECREASING;
	service.setCharacteristic(Characteristic.PositionState, Characteristic.PositionState.DECREASING);
	PiBlindsAccessory.open = false;
	service.setCharacteristic(Characteristic.CurrentPosition, 0);
	PiBlindsAccessory.state = Characteristic.PositionState.STOPPED;
	service.setCharacteristic(Characteristic.PositionState, Characteristic.PositionState.STOPPED);
	}
	else if (value == 100) {
	console.log("Opening the Blinds!");
	callback();
	var service = blinds.getService(Service.WindowCovering);
	PiBlindsAccessory.state = Characteristic.PositionState.INCREASING;
	service.setCharacteristic(Characteristic.PositionState, Characteristic.PositionState.INCREASING);
	PiBlindsAccessory.open = true;
	service.setCharacteristic(Characteristic.CurrentPosition, 100);
	PiBlindsAccessory.state = Characteristic.PositionState.STOPPED;
	service.setCharacteristic(Characteristic.PositionState, Characteristic.PositionState.STOPPED);
	} else {
	callback(new Error("Invalid position state"));
	}
	});

blinds
.getService(Service.WindowCovering)
.getCharacteristic(Characteristic.PositionState)
.on('get', function(callback) {
	callback(null, PiBlindsAccessory.state);
	});


blinds
.getService(Service.WindowCovering)
.getCharacteristic(Characteristic.CurrentPosition)
.on('get', function(callback) {
	
	var err = null;
	
	if (PiBlindsAccessory.open) {
	console.log("Query: Are Blinds Open? Yes.");
	callback(err, 100);
	}
	else {
	console.log("Query: Are Blinds Open? No.");
	callback(err, 0);
	}
	});
