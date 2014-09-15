	var token;
	var url;
	var result;
	var jsonToPost;
	var json;
	var countEmails = 1;
	var requiredMsg = "Este campo es obligatorio.";
	var mailMsg = "Debes ingresar un mail con un formato valido.";
	var priceMsg = "El formato del monto es incorrecto, recuerda utilizar solo . para los decimales.";
  	var payerEmailValidator = [];
  	var initPoint;
  	var partialAmount;
  	var finalAmount;
  	var originalAmount;
  	var quantityForAmount;
  	var description;


		$('#amount').priceFormat({
		    prefix: '',
		    centsSeparator: ',',
		    thousandsSeparator: '.'
		});
		
	  	var descriptionValidator = $("#description").required(requiredMsg);
	  	var amountValidator = $("#amount").required(requiredMsg).and().price(priceMsg);
	  	payerEmailValidator[0] = $("#payer").required(requiredMsg).and().email(mailMsg);
	  	calculate();

		$("#meIncluded").bind("change" , function(){
			if($("#meIncluded").is(':checked'))
			    countEmails++;
			else
			    countEmails--;
		  	calculate();
	  	});
		  	
	  	$("#amount").bind("change" , function(){
		  	calculate();
	  	});
	
	  	$("[id*=payer]").bind("change" , function(){
		  	calculate();
	  	});
			
		$('form').submit(function(e) {
			e = e || window.event;
			e.preventDefault();
			var myForm = $('form').form();
			myForm.validate();
			if(myForm.isValidated()){
	  	    	MELI.init({client_id: 8258968359213576});
				MELI.login(function() {
					token = MELI.getToken();
				  	$.when(createPreference(), getUser()).then(function(){
				  		$('#container').load('congrats.html', function() {
        					$(this).html($(this).html().replace("initPoint", initPoint));
        					$(this).html($(this).html().replace("partialAmount", partialAmount));
        					$(this).html($(this).html().replace("finalAmount", finalAmount));
        					$(this).html($(this).html().replace("description", description));

   						})
				  	}, function(){alert("Error");});
				});
			}
			return false;
		});
	
		$("#addEmail").live('click', function(){
			$("#moreEmail").append("<div class='ch-form-row' id='row" + countEmails + "'><label>Email:</label><input type='email' id='payer" + countEmails + "' name='payer' class='extra-large'> <i id='remove1" + countEmails + "' class='ch-icon-remove-sign remove'></i></div>");
		  	payerEmailValidator[countEmails] = $("#payer" + countEmails).required(requiredMsg).and().email(mailMsg);
			countEmails++;
			calculate();
		});
	
	  	$(".remove").live("click", function(){
	      $(this).parent('div:first').fadeOut('slow', function(){
	        $(this).remove();
			countEmails--;
		  	payerEmailValidator[countEmails] = payerEmailValidator[countEmails].disable();
			calculate();
	       });
	 	});
	
	  	$("textarea").countdown({
			"max": 70,
			"plural": "Quedan # caracteres.",
			"singular": "Queda # caracter."
		});
	
		var meIncludedHelp = $("#meIncludedHelp").tooltip("Vamos a descontar también tu parte.");
		var servicesCostsHelp = $("#servicesCostsHelp").tooltip("%5.99 de Comisión MercadoPago<br>%2.01 de Comisión HagamosUnaVaquita");

		meIncludedHelp.position({
			"points": "lm rm",
			"offset": "10 0"
		});
		servicesCostsHelp.position({
			"points": "cb ct",
			"offset": "0 -10"
		});
	
	function calculate(){
		var amount = unmaskPrice($("#amount"));
		$("#originalAmount").html("$" +(amount * 1.00).toFixed(2));
		$("#serviceAmount").html("$" +(amount *  0.08).toFixed(2));
		$("#finalAmount").html("$" +(amount  *  1.08).toFixed(2));
		$("#partialAmount").html("$" +((amount  *  1.08)/countEmails ).toFixed(2));
		$("#quantityForAmount").html(countEmails);
	};

	function createPreference(){
		var amount = unmaskPrice($("#amount"));
		jsonToPost =  "{'items': [{'id': '" +
			new Date().getTime() + "','title': '" + $("#description").val() + "', 'quantity': 1, 'unit_price': " + $("#partialAmount").html().replace("$","") + ", 'currency_id': 'ARS', 'picture_url': 'http://hagamosunavaquita.com.ar/cowww.png'} ], 'marketplace_fee' : " + ((amount * 0.016117021277)/countEmails).toFixed(2) +"  }";
	    var url = "https://api.mercadolibre.com/checkout/preferences?access_token=" + token;
		return $.ajax(url, {
		    data : jsonToPost,
		    contentType : 'application/json',
		    type : 'POST',
		    success: function(data) {
			    result = data;
			    MELI.logout();
			    initPoint = result.init_point;
			    partialAmount = $("#partialAmount").html().replace("$","");
			    finalAmount = $("#finalAmount").html().replace("$","");
			    originalAmount = $("#originalAmount").html().replace("$","");
			    quantityForAmount = $("#quantityForAmount").html();
			    description = $("#description").val() ;
   
		 }});
	};

	function unmaskPrice(amount){
		return parseFloat(amount.unmask()/100).toFixed(2);
	}
	//facebook connect
	
	
	// Funcion para logarse con Facebook.
	function login() {
	  fb.login(function(){ 
	    if (fb.logged) {
		    
	    } else {
	      alert("No se pudo identificar al usuario");
	    }
	  });
	};

	// Funcion para publicar un mensaje en tu muro
	function publish () {
	    fb.publish({
	      message : "Probando la vaquita",
	      picture : "http://blog.ikhuerta.com/wp-content/themes/ikhuerta3/images/ikhuerta.jpg",
	      link : "http://blog.ikhuerta.com/simple-facebook-graph-javascript-sdk",
	      name : "Simple Facebook Graph Javascript SDK",
	      description : "Facebook Graph es una nueva forma de conectar tu web Facebook. Con este script es muy fácil conseguirlo :)"
	    },function(published){ 
	      if (published)
	       alert("publicado!");
	      else
	       alert("No publicado :(, seguramente porque no estas identificado o no diste permisos");
	    }, false, 'me/feed');  
	}

	function createEvent() {
	    fb.publish({
	      privacy_type : "SECRET",
	      name : "Hagamos una vaquita",
	      start_time : "2013-05-31T00:52:01+0000",
	      description : $("#description").val()
	    },function(published, response){ 
	      if (published){
	       	alert("publicado!");
	       	FB.api('/'+response.id+'/invited?users=1089675556,1271422896', 'post', null, null);
	       }
	      else
	       alert("No publicado :(, seguramente porque no estas identificado o no diste permisos");
	    }, false, 'me/events');  
	}

	function getUser(){
		return $.ajax("https://api.mercadolibre.com/users/me?access_token=" + token, {
		    type : 'GET',
		    success: function(data) {
			    var input = $("<input>").attr("type", "hidden").attr("name", "receiverName").val(data.first_name + " " + data.last_name);
			    $('form').append(input);	
			    input = $("<input>").attr("type", "hidden").attr("name", "receiverMail").val(data.email);
			    $('form').append(input);   
		      }});
	};
	  	 
