<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class demoController extends Controller
{
   public function loginProcess(Request $request){
		$username = $request->input('username');
		$password = $request->input('password');
		$email = $request->input('email');
		$phonenumber = $request->input('phonenumber');	
   }
}
