$(document).ready( function(){
	$('#btnLogin').click( function(e){
		e.preventDefault();
		$('#btnLogin').popover('toggle');
		$('#btnSignUp').popover('hide');
	});
	$('#btnSignUp').click( function(e){
		e.preventDefault();
		$('#btnSignUp').popover('toggle');
		$('#btnLogin').popover('hide');
	});
	$(document).on('click','#signUpBtn',function(e){
		e.preventDefault();
		$.ajax({
			type: 'post',
			url: '/',
			data:{
				_token: $("input[type='hidden']").val(),
				username: $("input[name='username']").val(),
				password: $("input[name='password']").val(),
				email:  $("input[name='email']").val(),
				phonenumber:  $("input[name='phoneNumber']").val()
			},
			success: function(data){
				alert(data);
				$('#btnSignUp').popover('hide');
				$('#btnSignUp').popover('show');
			}
		});
	});
});
