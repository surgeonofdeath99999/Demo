<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class demoController extends Controller
{
   public function formProcess(Request $request){
   //Sign Up
		if( $request->input('processType') == 'signUp' ){
			$validator = Validator::make($request->all(),[
				'username' => [	'bail',
								'required',
								'regex:/^[A-Za-z0-9_]{3,20}$/'
								],
				'password' => ['bail',
								'required',
								'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/'
								],
				'confirmpassword' =>['bail',
										'required',
										'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/'
										],
				'email' => ['bail',
							'required',
							'regex:/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i'
							],
				'phonenumber' => ['bail',
									'required',
									'regex:/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/'
									]
			]);
			if( $validator->fails() ){
					return "failed";
			}
			$username = $request->input('username');
			$password = md5( $request->input('password') );
			$email = $request->input('email');
			$phonenumber = $request->input('phonenumber');
			
			$checkUser = DB::select( 'select * from user where username=:user',['user'=> $username] );
			if( $checkUser ){
					return "user exists";
			}
			$checkEmail = DB::select( 'select * from user where email=:email',['email'=> $email] );
			if( $checkEmail ){
					return "email exists";
			}
			$checkPhone = DB::select( 'select * from user where phone=:phone',['phone'=> $phonenumber] );
			if( $checkPhone ){
					return "phone exists";
			}
			DB::insert('insert into user(username,password,email,phone,joindate) values (?,?,?,?,?)',[$username,$password,$email,$phonenumber,time()]);
			Schema::create( 'user_'.$username."_friendStatus", function(Blueprint $table){
				$table->increments('id');
				$table->string('friendName',50)->unique();
				$table->string('friendStatus',20);
			});
	   }
	//Login
		if( $request->input('processType') == 'login' ){
			$validator = Validator::make($request->all(),[
				'username' => [	'bail',
								'required',
								'regex:/^[A-Za-z0-9_]{3,20}$/'
								],
				'password' => ['bail',
								'required',
								'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/'
								]
			]);
			if( $validator->fails() ){
					return "failed";
			}
			$username = $request->input('username');
			$password = md5( $request->input('password') );
			$result = DB::select('select * from user where username=:username and password=:password',['username'=>$username, 'password'=>$password]);
			if( !$result ){
				return 'not found';
			}
			$request->session()->put('username',time());
			$request->session()->put('userProfile',$username);
			return 'login true';
		}
	//LogOut
		if( $request->input('processType') == 'logout' ){
			$request->session()->forget('username');
			$request->session()->forget('userProfile');
			return redirect('/');
		}
	//Get profile name
		if( $request->input('processType') == 'getProfileName' ){
			if( $request->session()->has('username') ){
				
				return $request->session()->get('userProfile');
			}
		}
   }
   //HomeProcess
   public function homeProcess( Request $request ){
   //Inactive
		if( $request->session()->has('username') ){
			if( time() - $request->session()->get('username') > 1500 ){
				$request->session()->forget('username');
				$request->session()->forget('userProfile');
				return view('index', ['content1' => 'You has been inactive for too long!!','content2'=>'Login again!!'] );
			}
			$request->session()->put( 'username',time() );
			return view('dashboard');
		}
		return view('index',['content1'=>'','content2'=>'']);
	
	}
//Search
	public function Search( Request $request){
		if( $request->session()->has('username') ){
			$validator = Validator::make($request->all(),[
				'searchValue' => [ 'bail',
									'required',
									'regex:/^[A-Za-z0-9_]{1,20}$/'
								]
			]);
			if( $validator->fails() ){
				return 'search failed';
			}
			$username = $request->session()->get('userProfile');
			$searchReq = $request->input('searchValue');
			$result = DB::table('user')->select('username')->where('username','like','%'.$searchReq.'%')->get();
			//Check friend status for searching
			for( $i=0; $i<count($result); $i++ ){
				$result[$i]->status = "";
				$friendCheck = $result[$i]->username;
				$checkResult = DB::table('user_'.$username.'_friendstatus')->select('friendStatus')->where('friendName','=',$result[$i]->username)->get();
				if( isset($checkResult[0]) ){
					if( $checkResult[0]->friendStatus == "Sent"){
						$result[$i]->status = "sent";
						continue;
					}
					if ( $checkResult[0]->friendStatus == "Friend" ){
						$result[$i]->status = 'friend';
						
					}
				}
				if( $result[$i]->username == $username ){
					$result[$i]->status = 'self';
				}	
			}
			return $result;
		}
	}


//Handle sending friend request
	public function frienRequestProcess(Request $request){
		if( $request->session()->has('username') ){
			$username = $request->session()->get('userProfile');
			$requestTo = $request->input('friendRequestTo');
			DB::table('user_'.$username.'_friendstatus')->insert([
				'friendName' => "$requestTo",
				'friendStatus' => 'Sent'
			]);
		}
	}
}
