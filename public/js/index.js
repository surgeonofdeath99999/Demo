$(document).ready( function(){
	$('#btnLogin').click( function(e){
		e.preventDefault();
		$('#btnLogin').popover('toggle');
		$('#btnSignUp').popover('hide');
		document.getElementById('inactiveMess').innerHTML ='';
	});
	$('#btnSignUp').click( function(e){
		e.preventDefault();
		$('#btnSignUp').popover('toggle');
		$('#btnLogin').popover('hide');
		document.getElementById('inactiveMess').innerHTML ='';
	});
//Sign up
	$(document).on('click','#signUpForm',function(e){
		e.stopPropagation();
	});
	$(document).on('submit','#signUpForm',function(e){
		e.preventDefault();
		var usernameCheck = /^[A-Za-z0-9_]{3,20}$/;
		var	passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g;
		var	emailCheck = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		var	phoneCheck = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

		if( !usernameCheck.test( $("input[name='username']").val() ) ){
			document.getElementById('reponseMessages').innerHTML = 'Username should contain alphabets, numbers no special characters with min 3 and max 20 characters.';
			$('input[name="username"]').focus();
			return false;
		}
		if(!passwordCheck.test( $("input[name='password']").val() ) ){
			document.getElementById('reponseMessages').innerHTML = 'Your password should be at least eight characters, has at least one uppercase letter, one lowercase letter and one number';
			$('input[name="password"]').focus();
			return false;
		}
		if( $("input[name='password']").val() != $("input[name='passwordConfirm']").val() ){
			document.getElementById('reponseMessages').innerHTML = 'Password does not match!!';
			$('input[name="password"]').focus();
			return false;
		}
		if( !emailCheck.test( $("input[name='email']").val() ) ){
			document.getElementById('reponseMessages').innerHTML = 'Your email address is invalid!';
			$('input[name="email"]').focus();
			return false;
		}
		if( !phoneCheck.test( $("input[name='phoneNumber']").val() ) ){
			document.getElementById('reponseMessages').innerHTML = 'Your phone number is invalid!';
			$('input[name="phoneNumber"]').focus();
			return false;
		}
		document.getElementById('reponseMessages').innerHTML = '';
		
		$.ajax({
			type: 'post',
			url: '/',
			data:{
				_token: $("input[type='hidden']").val(),
				processType: 'signUp',
				username: $("input[name='username']").val(),
				password: $("input[name='password']").val(),
				confirmpassword: $("input[name='passwordConfirm']").val(),
				email:  $("input[name='email']").val(),
				phonenumber:  $("input[name='phoneNumber']").val()
			},
			success: function(data){
				if(data == "failed"){
					document.getElementById('reponseMessages').innerHTML = 'Your input is invalid!';
					$('input[name="username"]').focus();
					return false;
				}
				if(data == 'user exists'){
					document.getElementById('reponseMessages').innerHTML = 'Your username already exists!';
					$('input[name="username"]').focus();
					return false;
				}
				
				if(data == 'email exists'){
					document.getElementById('reponseMessages').innerHTML = 'Your email already exists!';
					$('input[name="email"]').focus();
					return false;
				}
				if(data == 'phone exists'){
					document.getElementById('reponseMessages').innerHTML = 'Your phone number already exists!';
					$('input[name="phoneNumber"]').focus();
					return false;
				}
				$('#reponseMessages').css('color','#00ff39');
				document.getElementById('reponseMessages').innerHTML = 'Your registration succeeds!';
				setTimeout(function(){
					$('#btnSignUp').popover('hide');
					$('#btnLogin').popover('show');
				},1200);
			}
		});
	});
//Login
$(document).on('click','#loginForm',function(e){
	e.stopPropagation();
});
$(document).on('submit','#loginForm',function(e){
		e.preventDefault();
		var usernameCheck = /^[A-Za-z0-9_]{3,20}$/;
		var	passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g;
		if( !usernameCheck.test( $("input[name='username']").val() ) ){
			document.getElementById('responseMess').innerHTML = 'Username should contain alphabets, numbers no special characters with min 3 and max 20 characters.';
			$('input[name="username"]').focus();
			return false;
		}
		if(!passwordCheck.test( $("input[name='password']").val() ) ){
			document.getElementById('responseMess').innerHTML = 'Your password should be at least eight characters, has at least one uppercase letter, one lowercase letter and one number';
			$('input[name="password"]').focus();
			return false;
		}
		document.getElementById('responseMess').innerHTML = '';
		$.ajax({
			type : 'post',
			url: '/',
			data:{
				_token: $("input[type='hidden']").val(),
				processType: 'login',
				username: $("input[name='username']").val(),
				password: $("input[name='password']").val()
			},
			success: function(data){
				if( data == 'failed' ){
					document.getElementById('responseMess').innerHTML = 'Your input is invalid!';
					$('input[name="username"]').focus();
					return false;
				}
				if( data == 'not found'){
					document.getElementById('responseMess').innerHTML = 'Username or password is invalid!';
					$('input[name="username"]').focus();
					return false;
				}
				if(data == 'login true'){
					$('#responseMess').css('color','green');
					document.getElementById('responseMess').innerHTML = 'Login succeed!';
					setTimeout( window.location.replace('/'),1200 );
				}
			}
		});
	});
	//Hide form on outside click
	$(document).on('click','.popover',function(e){
		e.stopPropagation();
	});
	$(document).on('click','body',function(){
		$('#btnLogin').popover('hide');
		$('#btnSignUp').popover('hide');
	});
});
