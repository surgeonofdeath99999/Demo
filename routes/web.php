<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'demoController@homeProcess');
Route::post('/','demoController@formProcess');
Route::post('/search','demoController@Search');
Route::post('/friendrequestprocess','demoController@frienRequestProcess');
