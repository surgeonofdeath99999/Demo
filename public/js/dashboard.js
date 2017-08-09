$(document).ready(function(){	
	//Reload page
	setTimeout(	function(){window.location.replace('/');},1500001);
	//Friend request socket
	var ws = new WebSocket("ws://localhost:4000");
	   ws.onopen = function()
	   {
		  // Web Socket is connected, send data using send()
		  ws.send("Message to send");
		  alert("Message is sent...");
	   };
	//Get username
	$.ajax({
		type: "post",
		url: '/',
		data: {
			_token: $('input[type="hidden"]').val(),
			processType: 'getProfileName'
		},
		success: function(data){
			document.getElementById('profileName').innerHTML = data;
		}
	});	
	//Log out
	$('#btnLogOut').click( function(e){
		e.preventDefault();
		$.ajax({
			type: 'post',
			url: '/',
			data: {
				_token: $('input[type="hidden"]').val(),
				processType: 'logout'
			},
			success: function(data){
				window.location.replace('/');
			}
		});
	});
	//Search
	$('#searchArea').keyup( function(){
		var regex = /^[A-Za-z0-9_]{1,20}$/;
		var input = $('#searchArea').val();
		if(input==""){
			document.getElementById('searchItem').innerHTML = "";
			return false;
		}
		var text,i,script;
		if( !regex.test(input) ){
			return false;
		}
		$.ajax({
			type: 'post',
			url: '/search',
			data:{
				_token: $('input[type="hidden"]').val(),
				searchValue: $('#searchArea').val()
			},
			success:function(data){
				text="";
				script = '';
				for(i=0;i<data.length;i++){
					if( data[i].status === ""){
						script += 'function clickHandler'+i+'(){'+
						'$.ajax({'+
								'type:"post",'+
								'url:"/friendrequestprocess",'+
								'data:{'+
										"_token: $('input[type=\"hidden\"]').val(),"+
										'username: $("#profileName").val(),'+
										'friendRequestTo: $("#p'+i+'").attr("title")'+
									'},'+
								'beforeSend: function(){'+
											'$("#a'+i+'").remove();'+
											'$("#p'+i+'").append("<img id=\'img'+i+'\' style=\'float:right;\' src=\'gif/loading.gif\' width=\'18px\' height=\'18px\'>")'+
										'},'+
								'success: setTimeout(function(){'+
									'$("#img'+i+'").remove();'+
									'$("#p'+i+'").append("<span style=\'float:right;\'><a style=\'word-spacing:1px!important;color:green;font-size:15px;text-decoration:none\'> Request sent!</a><span style=\'color:green;margin-left:5px\' class=\'glyphicon glyphicon-ok\'></span></span>");'+
								'},2000)'+
							'});'+
							'};';
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<a onclick="clickHandler'+i+'();" id="a'+i+'" class="glyphicon glyphicon-plus" title="Add friend" style="float:right;color:green;cursor:pointer;text-decoration:none"></a></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
						
					}
					if( data[i].status === "friend"){
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<a class="glyphicon glyphicon-heart" title="This is your friend" style="float:right;color:red;cursor:default;text-decoration:none"></a></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
					}
					if( data[i].status === "sent"){
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<span style="float:right"><a title="Request sent!" style="cursor:default;font-size:15px;text-decoration:none;color:green">Request sent!</a><span class="glyphicon glyphicon-ok" style="color:green;margin-left:5px"></span></span></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
					}
					if( data[i].status === "self"){
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<span style="float:right"><a href="" class="glyphicon glyphicon-home" title="Home" style="text-decoration:none"></a></span></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
					}
				}
				document.getElementById('returnScript').innerHTML = script;
				document.getElementById('searchItem').innerHTML = text;
			}
		});	
	});
	$('#searchArea').focus(function(){
		var regex = /^[A-Za-z0-9_]{1,20}$/;
		var input = $('#searchArea').val();
		var text,i,script,temp;
		if(input==""){
			document.getElementById('searchItem').innerHTML = "";
			return false;
		}
		if( !regex.test(input) ){
			return false;
		}
		$.ajax({
			type: 'post',
			url: '/search',
			data:{
				_token: $('input[type="hidden"]').val(),
				searchValue: $('#searchArea').val()
			},
			success:function(data){
				text="";
				script = '';
				for(i=0;i<data.length;i++){
					if( data[i].status === ""){
						script += 'function clickHandler'+i+'(){'+
						'$.ajax({'+
								'type:"post",'+
								'url:"/friendrequestprocess",'+
								'data:{'+
										"_token: $('input[type=\"hidden\"]').val(),"+
										'username: $("#profileName").val(),'+
										'friendRequestTo: $("#p'+i+'").attr("title")'+
									'},'+
								'beforeSend: function(){'+
											'$("#a'+i+'").remove();'+
											'$("#p'+i+'").append("<img id=\'img'+i+'\' style=\'float:right;\' src=\'gif/loading.gif\' width=\'18px\' height=\'18px\'>")'+
										'},'+
								'success: setTimeout(function(){'+
									'$("#img'+i+'").remove();'+
									'$("#p'+i+'").append("<span style=\'float:right;\'><a style=\'word-spacing:1px!important;color:green;font-size:15px;text-decoration:none\'> Request sent!</a><span style=\'color:green;margin-left:5px\' class=\'glyphicon glyphicon-ok\'></span></span>");'+
								'},2000)'+
							'});'+
							'};';
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<a onclick="clickHandler'+i+'();" id="a'+i+'" class="glyphicon glyphicon-plus" title="Add friend" style="float:right;color:green;cursor:pointer;text-decoration:none"></a></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
						
					}
					if( data[i].status === "friend"){
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<a class="glyphicon glyphicon-heart" title="This is your friend" style="float:right;color:red;cursor:default;text-decoration:none"></a></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
					}
					if( data[i].status === "sent"){
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<span style="float:right"><a title="Request sent!" style="cursor:default;font-size:15px;text-decoration:none;color:green">Request sent!</a><span class="glyphicon glyphicon-ok" style="color:green;margin-left:5px"></span></span></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
					}
					if( data[i].status === "self"){
						text +='<p id="p'+i+'" title="'+data[i].username+'" class="list-group-item list-group-item-action" style="font-size:15px;width:100%">'+data[i].username+'<span style="float:right"><a href="" class="glyphicon glyphicon-home" title="Home" style="text-decoration:none"></a></span></p>';
						if(data.length==0){
							text="";
							text += '<p class="list-group-item" style="color:red;font-size:13px;border-radius:0">Username not found<span style="float:right" class="glyphicon glyphicon-remove"></span></p>';
						}
					}
				}
				document.getElementById('returnScript').innerHTML = script;
				document.getElementById('searchItem').innerHTML = text;
			}
		});
	});
	//Hide seach on outside click
	$('#searchItem').on('click',function(e){
		e.stopPropagation();
	});
	$('body').click(function(){
		document.getElementById('searchItem').innerHTML = '';
	});
});

