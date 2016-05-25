'use strict'

$(document).ready(function(){

	/************** UI ******************/

	// Follow the instruction to acquire your device id from admin portal
	var TID = 'ThingsConnect device id'; 
	
	var COLORS = {
		red:false,
		green:false,
		yellow:false
	}
	var anqos = true;
    var dgqos   = true;
    var debug = true;

	$("#custom").spectrum({
		color: "#f00",
		 move: function(tinycolor) {
			var red = Math.floor(tinycolor._r)
			var green = Math.floor(tinycolor._g)
			var blue = Math.floor(tinycolor._b)

			red = 255-red
			green = 255-green
			blue = 255- blue

			console.log(red + ' ' + green + " " + blue)

			var gpio = new ThingsConnect.GPIO();

			gpio.setPins([6,7,8],ThingsConnect.IO.OUTPUT);
			gpio.setPinsValues([red,green,blue]);

			ThingsConnect.Manager.analogWriteTo(TID,gpio);
		},
	});

	var data = {
		labels: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
		datasets: [
			{
				label: "Distance",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			}
		]
	};

    var data2 = {
		labels: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"],
		datasets: [
			{
				label: "Distance",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			}
		]
	};

	var options = {}

	var ctx = document.getElementById("myChart").getContext("2d");
	var myLineChart = new Chart(ctx).Line(data);
    var ctx2 = document.getElementById("myChart2").getContext("2d");
	var myLineChart2 = new Chart(ctx2).Line(data2);

    var datapoint1 = 0;
    $("#anread").on('change', function() {
          var t = parseInt($(this).val());
          ThingsConnect.Manager.setAnalogReadTo(TID,t,function(d){

             myLineChart.datasets[0].points[datapoint1].value = parseInt(d)/1024*325;
             myLineChart.update();
             datapoint1 += 1;
             if(datapoint1 % 10 == 0) datapoint1 = 0;
          })
    });

    var datapoint2 = 0;
    $("#dgread").on('change', function() {
          var t = parseInt($(this).val());
          ThingsConnect.Manager.setDigitalReadTo(TID,t,function(d){

             myLineChart2.datasets[0].points[datapoint2].value = parseInt(d);
             myLineChart2.update();
             datapoint2 += 1;
             if(datapoint2 % 10 == 0) datapoint2 = 0;
          })
    });

	function colorOnClick(color){

		var self = $(this)
		var color = self.data('color')

		COLORS[color] = !COLORS[color]

		var gpio = new ThingsConnect.GPIO();
		var a = [0,0,0]
		if(COLORS['red']) a[0] = 1;
		if(COLORS['yellow']) a[1] = 1;
		if(COLORS['green']) a[2] = 1;

		gpio.setPins([1,2,3],ThingsConnect.IO.OUTPUT);
		gpio.setPinsValues(a);
		ThingsConnect.Manager.digitalWriteTo(TID,gpio);

		self.empty()
		self.append('<span>'+ (COLORS[color] ? 'ON' : 'OFF') +'</span>')
	}

	$('#green-btn').click(colorOnClick);
	$('#yellow-btn').click(colorOnClick);
	$('#red-btn').click(colorOnClick);

	$("#form-text").keypress(function(e){

		if(e.keyCode == 13){
			slwrite();
			$(this).val('');
		}

	});

	function slwrite(){

		var t = $("#form-text").val()
        var gpio = new ThingsConnect.GPIO();
		ThingsConnect.Manager.serialWriteTo(TID,t);

        $("#form-text").val("");
    }

	$("#an-qos").click(setqos);
    $("#dg-qos").click(setqos);
	function setqos(){

        var self = $(this)
		var type = self.data('type')
        var Interface;
        var qos;

        switch(type){

            case "analog":
                anqos = !anqos
                qos = anqos;
                Interface = ThingsConnect.Interface['Analog']
                break;
            case "digital":
                dgqos = !dgqos
                qos = dgqos;
                Interface = ThingsConnect.Interface['Digital'];
                break;
    	}

		ThingsConnect.Manager.setQOSTo(TID,Interface, qos? 1 : 0);

		self.empty()
		self.append('<span>' + (qos ? '1' : '0') +'</span>')
    }

	$("#debug-mode").click(setdebug);
    function setdebug(){

        var self = $(this)
        debug = !debug ;
        ThingsConnect.Manager.setDebugModeTo(TID,debug);

        self.empty()
        self.append('<span>' + (debug ? 'enabled' : 'disabled') +'</span>')
    }

	/************** end UI ******************/

	// Follow the instruction to acquire your all detail on admin portal
	var app = {
		appid 	: 'Your App Id', // You can get this in the web portal after subscribe
		appkey 	: 'Your App Key for javacript',
		userid	: 'Your User id',
		passcode: 'Your User passcode',
	}

	ThingsConnect
		.Manager
		.on('connected',
			function(){
				// must be defined before init
				console.log('registed a function to be called when connected...')
				// set serial baudrate and config
				var serial_pins = new ThingsConnect.GPIO();
				serial_pins.setSerial(115200);
				this.setSerialTo(TID,serial_pins);

				var pwm_pins = new ThingsConnect.GPIO();
				pwm_pins.setPWM(255);
				this.setPWMTo(TID,pwm_pins);

				// set input pins for digital read
				var input_pins = new ThingsConnect.GPIO();
				input_pins.setPins([4]);
				this.setPinsModeTo(TID,input_pins);

				this.setSerialReadTo(TID,function(m){
					// register serial read

					var t = $('#serial-rx').val();
					if(!t) $('#serial-rx').val(m);
					else  $('#serial-rx').val(t + '\n' + m);
				})
			}
		);

	ThingsConnect
		.Manager
		.init(app)
		.then(function(res){
			// init completed but may not be connected yet
			console.log(res) // resolve with a list of things id
		},function(err){
			// init error
			console.log(err)
		})

})
