/**
This is the entry point of the chatbot. Uses botly framework to communicate with Facebook's SEND API
Author: Siddharth Kothari 
Date: 20th July, 2017
**/

const express = require('express');
const Botly = require('botly');
const bodyParser = require('body-parser');
const responseBuilder = require('./response-builder');
const {Wit, log} = require('node-wit');
const string = require('string');
const chatLogger = require('./chat-logger');
const jsonfile = require('jsonfile');
const nodemailer = require('nodemailer');
const classifier = require('./nlu/classifier.js');
const PORT = 8089;

const SCORE_THRESHOLD = 8; //Minimum score needed to send user details to the HR department

const VERIFY_TOKEN = 'hello_world';
const ACCESS_TOKEN = 'EAAEW5FO6xjIBAHarouMunL4XCxLXKkD9FZBexdYjUWSWiusNGXia3c36XhAaEd3zGYRtf7TAOxMqm5tRGoQEi2PFMGTnhgsuBTlAaaJpZBq3TRp8nWFZA5HM1Kn87qqhn4d1C5K9wfY3Xa49ITmpEjvqHHc5Tocm5NavS8CMQZDZD';
const PAGE_ID = '1680388548649392';
const APP_SECRET = '92f32e23dad0458a6d4b79a9233e8fee';
const WIT_ACCESS_TOKEN = 'CZILV4RDAVKOEFL67M537IK726M4DGZ2'; //Access token for CloBot app



var ageState = [];
var nextState = [];	// Array to store userId-nextState pair
var previousState = []; // Array to store userId-previousState pair
var userName = [];	//Array to store userId-userName pair
var userLastName = [];  //Array to store userId-lastName pair
var selectionCategory = [];	// Array to store userId-firstName pair
var score = []; //Array to store the score of the user
var current_question_set = []; //Array to store the userId-question set pair
var questionFile; //Store the file question.json
var startTime = []; //Array to store the start time of quiz for a particular user
var userDetail = [];
var userone={};
userone.fname="";

//List of states 
const endssss="endstt";
const intent_final = "restaurant_search";
const welcome_state = "welcome";
const teen_state = "teens";
const middle_state = "middle";
const old_state = "senior";
const endss ="endings";
const pb_state = "per_bank";
const confirm_state = "confirm";
const user_input_state = "user input";
const fName_state = "first name";
const lName_state = "last name";
const gender_state = "gender";
const mobile_state = "mobile no";
const pr_email_state = "personal email";
const OTP_state = "OTP verify";
const DOB_state = "date of birth";
const high_qualify_state = "highest qualification";
const martial_status_state = "martial status";
const work_spouse_state = "spouse job";
const end_accup_state = "accept upgrade";
const residence_state = "type of residence";
const res_add_state = "residential address";
const family_no_state = "family members";
const dependent_member_state = "dependent members";
const emp_type_state = "employment type";
const other_type_state = "other type";
const employer_name_state = "employer name";
const work_employer_state = "no of empyear";
const work_exp_state = "total work exp";
const month_salary_state = "monthly salary";
const official_email_state = "official email id";
const money_req_state = "money required";
const money_req_other_state = "money other required";
const money_reason_state = "money reasons";
const money_reason_other_state = "money other reasons";
const money_timeline_state = "money timeline";
const exist_loan_state = "existing loan";
const exist_emi_state = "existing emi";
const aadhar_no_state = "aadhar no";
const pan_no_state = "pan no";

const deny_state = "denial";
const employee_state = "employee";
const non_employee_state = "non employee";
const age_group = "age group";
const city = "residence";
const genders = "ling";
const number = "contactno";
const otp = "otp no";
const resultss = "output";
const work = "kaam";
const get_query_state = "get query";
const display_response_state = "display query";
const anything_else_state = "anything else";
const goodbye_state = "goodbye";
const customer_service_state = "customer service";
const cannot_understand_state = "undefined";
const server_error_state = "server error";
const help_state = "help";
const get_customer_query_state = "customer query";
const select_customer_state = "customer select";
const credit_customer_state = "creditcard customer";
const credit_apply_state = "creditcard apply";
const credit_eligible_state = "creditcard eligible";
const credit_bill_opts_state = "creditcard bill variants";
const credit_minors_state = "creditcard for minors";
const credit_types_state = "creditcard types";
const corporate_card_state = "corporate card";
const corporate_proc_state = "corporate card procedure";
const addon_count_state = "addon card nos";
const cardbill_cycle_state = "card bill cycle";
const display_customer_response_state = "customer response";
const get_email_state = "email";

//List of categories 
const finance_category = "finance";
const people_category = "people";
const job_category ="job";
const customer_category = "customer";
var intent11 = 'default'; 
// Create new instance of Botly with FB developer credentials
const botly = new Botly({
	accessToken: ACCESS_TOKEN,  
 	verifyToken: VERIFY_TOKEN, 
 	webhookPath: '/',
 	notificationType: Botly.CONST.REGULAR  
});

const witClient = new Wit ({
	accessToken: WIT_ACCESS_TOKEN,
	logger: new log.Logger(log.INFO)
});

/**
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: '', //TODO: insert account email here
		pass: ''//TODO: insert account password here
	}
});

**/

botly.on("message", function(senderId, message, data) {
	

		botly.setGetStarted({pageId: PAGE_ID, payload: "GET STARTED"}, (err, body) => {
    //current test welcome
	});
	//Set typing indicator to on
	botly.sendAction({"id": senderId, "action": "typing_on"});

	//Log the message as soon as the user sends it
	chatLogger.writeToLogFile(senderId, data.text, "User");
			setPreviousState(senderId,getNextState(senderId));

	console.log("Message from:"+senderId);
	console.log("Message is:"+message);
		console.log("Message is:"+data.text);
	console.log("Message is:"+getPreviousState(senderId));
	        classifier.parse(data.text, function(error, intent, entities) {
				console.log("TEST 1");
            if (error) {
				console.log(intent);
                
            } else {
				if(intent!=null){
				console.log("State 1");
				intent11=intent.name;
				}
			}});
			console.log(intent11);
			if(getPreviousState(senderId) ===  void 0 || getPreviousState(senderId) == undefined ){
								console.log("State 1");
								setNextState(senderId, welcome_state);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == welcome_state) {
								console.log("State 2");
								setNextState(senderId, pb_state);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}else if(getPreviousState(senderId) == pb_state) {
								console.log("State 2");
								setNextState(senderId, non_employee_state);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == non_employee_state) {
								console.log("State 2");
								setNextState(senderId, age_group);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == age_group) {
				
								setAgeGroup(senderId, data.text);
								console.log("State 2"+data.text);
								setNextState(senderId, city);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == city) {
								console.log("State 2");
								setNextState(senderId, genders);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == genders) {
								console.log("State 2");
								setNextState(senderId, work);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == work) {
								console.log("State 2");
								setNextState(senderId, number);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == number) {
								console.log("State 2");
								setNextState(senderId, otp);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == otp) {
								console.log("State 2");
								setNextState(senderId, resultss);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == resultss && (intent11 == intent_final || intent11 === intent_final || intent11 == 'restaurant_search')) {
								console.log("State 2 State 21111");
								setNextState(senderId, endss);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}
							else if(getPreviousState(senderId) == resultss) {
								console.log("endsssssssssssss");
								setNextState(senderId, endssss);
								chatLogger.writeToLogFile(senderId, "1", "User");
							}

				
					
					
					
					
   
			
		
	
			
			
				switch(getNextState(senderId)) {
				case welcome_state:
					sendWelcomeText(senderId);
						console.log("test2");
					// setNextState(senderId, welcome_state);
					break;
				case pb_state:
					sendPersonalBanking(senderId);
					// setNextState(senderId, employee_state);
					break;
				case non_employee_state:
					sendTellUS(senderId);
					// setNextState(senderId, non_employee_state);
					break;
				case age_group:
					setName(senderId,data.text);
					sendTellAge(senderId);
					// setNextState(senderId, anything_else_state);
					break;
				case city:
					sendTellCity(senderId);
					// setNextState(senderId, anything_else_state);
					break;
				case genders:
					sendTellGender(senderId);
					// setNextState(senderId, anything_else_state);
					break;
				case work:
					sendTellOccupation(senderId);
					// setNextState(senderId, anything_else_state);
					break;	
				case number:
					sendTellNO(senderId);
					// setNextState(senderId, anything_else_state);
					break;
				case otp:
					sendTellOTP(senderId);
					break;
				case resultss:
					sendResults(senderId);
					// setNextState(senderId, anything_else_state);
					break;
				case endss:
					sendResultss(senderId);
					// setNextState(senderId, anything_else_state);
					break;
				case endssss:
					sendResultsEnd(senderId);
					// setNextState(senderId, anything_else_state);
					break;
					
					
			}
				
				
	
	//Get the primary intent
	// let intentObject = responseBuilder.getIntent(senderId,data.text,responseBuilder.FILENAME_PRIMARY_INTENT);
	
	// //Set previous state
	// setPreviousState(senderId,getNextState(senderId));
		// chatLogger.writeToLogFile(senderId, getPreviousState(senderId), "User");

		// //Determine the next state
		// if(getNextState(senderId) == null) {
			// setNextState(senderId, welcome_state);
			// chatLogger.writeToLogFile(senderId, "1", "User");
		// }
		

});



// Function to emit a 'message' event so every postback can be treated as a message
botly.on("postback", function(senderId,message,postback) {
	botly.emit("message", senderId, null, {"text":postback});
});


// Function to set the "get started" button for first time users;
botly.setGetStarted({pageId: PAGE_ID, payload: "GET STARTED"});


// Function to send greeting text
var sendWelcomeText = function(senderId, message) {
	let msg;
	let firstName = null;
	let lastName = null;
	console.log("test2");
	botly.getUserProfile(senderId, function(err, info) {
			if(info != undefined) {
				msg = "Hello, I am IDFCBot, what would you like to know with respect to IDFC Bank?";
			}
			else {
					msg = "Hi there, I am IDFCBot, what would you like to know with respect to IDFC Bank?";
			}

		botly.sendText({id:senderId, text: msg, quick_replies: welcome_quickReplyI}, function(err, data) {
			if(data) {
				chatLogger.writeToLogFile(senderId, msg, "CloBot");
				botly.sendAction({"id": senderId, "action": "typing_off"});
			}
		});
		setName(senderId,firstName);
		setLastName(senderId, lastName);
	});
};
			
		var sendPersonalBanking = function(senderId) {
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/S9i2j6O.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/nV4GVsK.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });		
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/B6iQXgx.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });		
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/qtOPCXX.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });		
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/zI0SwmI.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });	
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/rxCdpOD.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });		
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/ePc1TPD.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });
	// botly.sendImage({id: senderId, url: "https://i.imgur.com/wfLQnOQ.png", quick_replies: welcome_quickReply2}, (err, data) => {
	// });
			let buttons = [];
		buttons.push(botly.createWebURLButton("Accounts", "https://www.idfcbank.com/personal-banking/accounts.html"));
		buttons.push(botly.createPostbackButton("Register", "continue"));
		let element = {
		title: "Accounts & Deposits",
		item_url: "https://www.idfcbank.com/personal-banking/accounts.html",
		image_url: "https://i.imgur.com/76Xgpm0.jpg",
		subtitle: "",
		buttons: buttons
	}
		botly.sendGeneric({id: senderId, elements: element, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});
			
		// let buttons1 = [];
		// buttons.push(botly.createWebURLButton("Accounts", "https://www.idfcbank.com/personal-banking/accounts.html"));
		// buttons1.push(botly.createPostbackButton("Continue", "continue"));
		let element1 = {
		title: "Insurances & Online Services",
		item_url: "https://www.idfcbank.com/personal-banking.html",
		image_url: "https://i.imgur.com/3V8JPRi.jpg",
		subtitle: "",
		// buttons: buttons1
	}
		botly.sendGeneric({id: senderId, elements: element1, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});

			
		// let buttons2 = [];
		// buttons.push(botly.createWebURLButton("Accounts", "https://www.idfcbank.com/personal-banking/accounts.html"));
		// buttons1.push(botly.createPostbackButton("Continue", "continue"));
		let element2 = {
		title: "Loans & Investments",
		item_url: "https://www.idfcbank.com/personal-banking.html",
		image_url: "https://i.imgur.com/PIbN6zT.jpg",
		subtitle: "",
		// buttons: buttons2
	}
		botly.sendGeneric({id: senderId, elements: element2, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});
		let element3 = {
		title: "Payments & Cards",
		item_url: "https://www.idfcbank.com/personal-banking.html",
		image_url: "https://i.imgur.com/H6gI1kG.jpg",
		subtitle: "",
		// buttons: buttons2
	}
		botly.sendGeneric({id: senderId, elements: element3, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});
				
				
	
	
	
	
	
	
	
};
	
var sendTellOTP = function(senderId) {
	let msg = "Please enter the OTP sent to your mobile number:";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};


var sendTellUS = function(senderId) {
	let msg = "Shall I address you by your first name? Please help me with it? :";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};

var sendTellAge = function(senderId) {
	let msg = "Please tell us your age group? :";

	botly.sendText({id:senderId, text: msg, quick_replies: welcome_quickReply3}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};
var sendTellCity = function(senderId) {
	let msg = "City :";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};
var sendTellGender = function(senderId) {
	let msg = "Gender :";

	// botly.sendText({id:senderId, text: msg}, function(err, data) {
		// if(data) {
			// chatLogger.writeToLogFile(senderId, msg, "CloBot");
			// botly.sendAction({"id": senderId, "action": "typing_off"});
		// }
	// });
	
	botly.sendText({id:senderId, text: msg, quick_replies: gender_quickReply}, function(err, data) {
			if(data) {
				chatLogger.writeToLogFile(senderId, msg, "CloBot");
				botly.sendAction({"id": senderId, "action": "typing_off"});
			}
		});
};
var sendTellOccupation = function(senderId) {
	let msg = "Occupation :";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};
var sendTellNO = function(senderId) {
	let msg = "Contact No :";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};

var sendResults = function(senderId) {
	let msg = "As per your inputs best suited account for you would be:";
		botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
	let testage=getAgeGroup(senderId);
	console.log(testage);
	if(testage == teen_state)
	{
		console.log(testage);
		let buttons = [];
		buttons.push(botly.createWebURLButton("Go to Askrround", "https://www.idfcbank.com/personal-banking/accounts.html"));
		buttons.push(botly.createPostbackButton("Continue", "continue"));
		let element = {
		title: "What do you want to do next?",
		item_url: "https://www.idfcbank.com/personal-banking/accounts.html",
		image_url: "https://i.imgur.com/NCY3GAb.png",
		subtitle: "Choose now!",
		buttons: buttons
		}
		botly.sendGeneric({id: senderId, elements: element, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});
	}
	else if(testage==middle_state){
		
		let buttons = [];
		buttons.push(botly.createPostbackButton("Request callback", "Request callback"));
		buttons.push(botly.createPostbackButton("Thanks", "restart"));
		let element = {
		title: "personal banking",
		item_url: "https://www.idfcbank.com/personal-banking/accounts/zerobalance-savings-account.html",
		image_url: "https://i.imgur.com/xNBfssp.png",
		// subtitle: "Choose now!",
		buttons: buttons
	}
		botly.sendGeneric({id: senderId, elements: element, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});
		
	}
	else if(testage==old_state){
		let buttons = [];
		buttons.push(botly.createWebURLButton("Go to Askrround", "https://www.idfcbank.com/personal-banking/accounts.html"));
		buttons.push(botly.createPostbackButton("Continue", "continue"));
		let element = {
		title: "What do you want to do next?",
		item_url: "https://www.idfcbank.com/personal-banking/accounts.html",
		image_url: "https://i.imgur.com/y1ZactZ.png",
		subtitle: "Choose now!",
		buttons: buttons
	}
		botly.sendGeneric({id: senderId, elements: element, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});
	}
	else{
		let buttons = [];
		buttons.push(botly.createWebURLButton("Go to Askrround", "https://www.idfcbank.com/personal-banking/accounts.html"));
		buttons.push(botly.createPostbackButton("Continue", "continue"));
		let element = {
		title: "What do you want to do next?",
		item_url: "https://www.idfcbank.com/personal-banking/accounts.html",
		image_url: "https://i.imgur.com/y1ZactZ.png",
		subtitle: "Choose now!",
		buttons: buttons
	}
		botly.sendGeneric({id: senderId, elements: element, aspectRatio: Botly.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL}, (err, data) => {
			console.log("send generic cb:", err, data);
			});
	}
	


};



var sendResultss = function(senderId) {
	let tests = getName(senderId);
	let msg = "Thanks "+tests+". We will call you shortly :";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
	setNextState(senderId, undefined);
};



var sendResultsEnd = function(senderId) {
	let msg = "Thanks for talking to IDFC Bank. For any other queries, type \" Restart \"";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
	setNextState(senderId, undefined);
};






// Function to send text when user is an employee
var sendEmployText = function(senderId) {
	let msg = "Shall I address you by your first name? Please help me with it? :";

	botly.sendText({id:senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};


// Function to send a goodbye message 
var sendGoodbyeText = function(senderId) {
	let msg = "Goodbye, I hope I could help you!";

	botly.sendText({id:senderId, text: msg, quick_replies: hello_quickReplies}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};


// Function to send a response to the query by getting intent from wit.ai
var sendResponseText = function(senderId, input) {
	let finalIntent,msg,response;

	witClient.message(input, {}).then((data) => {

		if (getFirstEntityFromWit(data, "intent") != undefined) {
			finalIntent = getFirstEntityFromWit(data, "intent")+" "+getFirstEntityFromWit(data, "sub_intent");
		}
		else {
			finalIntent = "undefined";
		}
	
		//Get rid of all whitespaces from finalIntent using string(finalIntent).trim().s
		response = responseBuilder.getResponse(string(finalIntent).trim().s, getName(senderId));

		if(response == undefined) {
			sendServerErrorText(senderId);
		}
		else {
			botly.sendText({id: senderId, text: response}, function(info, data) {
				if(data) {
					chatLogger.writeToLogFile(senderId, response, "CloBot");
					botly.sendAction({"id": senderId, "action": "typing_off"});
					setNextState(senderId, anything_else_state);
					sendAnythingElseText(senderId);
				}
			});
		}
	}).catch(console.error);	
};






/**
	//Get the end time, subtract start time from it and send email
	let end = new Date();

	let time_in_seconds = ((end - startTime[senderId])/1000) % 60;

	let htmlEmail = "<table style='width:100%'><tr><th>Name</th><th>Time (in seconds)</th><th>Score</th><tr><td>"+getName(senderId)+" "+getLastName(senderId)+"</td><td>"+time_in_seconds+"</td><td>"+getScore(senderId)+"</td></tr></table>";

	var mailOptions = {
		from: 'sid.koth1996@gmail.com',
		to: 'sid.koth1996@gmail.com',
		subject: 'TEST COMPLETED: '+getName(senderId) +" "+ getLastName(senderId),
		html: htmlEmail
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Email sent: "+ info.response);
		}

	});
**/





//Function to send an error message to user
var sendServerErrorText = function(senderId) {
	let msg = "Sorry, our servers are currently down. Please try again later";
	botly.sendText({id: senderId, text: msg}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};

//Function to send help message to user
var sendHelpText = function(senderId) {
	let msg = "I can help answer any query you may have. I may not understand everything so you can always ask me for our customer service number!";

	botly.sendText({id: senderId, text: msg, quick_replies: help_quickReplies}, function(err, data) {
		if(data) {
			chatLogger.writeToLogFile(senderId, msg, "CloBot");
			botly.sendAction({"id": senderId, "action": "typing_off"});
		}
	});
};

// Function to extract an entity from wit.ai response. Takes response object as parameter
var getFirstEntityFromWit = function(data, entity) {
	
	if(Array.isArray(data.entities["intent"])) {
		//Intent is present, return the value of the intent
			if(data.entities[entity] != undefined && data.entities[entity][0].suggested == undefined) {
				//Entity is present and the entity is not suggested by wit. Return the value
					return data.entities[entity][0].value;
			}
			else {
				//The entity is not present, return empty string.
				return "";
			}
	}
	else {
		//Intent is not present, return undefined
		return undefined;
	}
};

// Getter and setter functions for next state and previous state
var setPreviousState = function(senderId, state) {
	previousState[senderId] = state;
};

var getPreviousState = function(senderId) {
	return previousState[senderId];
};

var setNextState = function(senderId, state) {
	nextState[senderId] = state;
};

var getAgeGroup = function(senderId) {
	return ageState[senderId];
};

var setAgeGroup = function(senderId, state) {
	ageState[senderId] = state;
};


var getNextState = function(senderId) {
	return nextState[senderId];
};

// Function to set name
var setName = function(senderId, firstName) {
	userName[senderId] = firstName;
};

var getName = function(senderId) {
	return userName[senderId];
};

var setLastName = function(senderId, lastName) {
	userLastName[senderId] = lastName;
};

var getLastName = function(senderId) {
	return userLastName[senderId];
};

//Functions to handle score keeping for users
var initialiseScore = function(senderId) {
	score[senderId] = 0;
};

var incrementScore = function(senderId) {
	score[senderId] += 1;
};

var getScore = function(senderId) {
	return score[senderId];
};

var setQuestionSet = function(senderId, questionSet) {
	current_question_set[senderId] = questionSet;
};

var getQuestionSet = function(senderId) {
	return current_question_set[senderId];
};

// Create quick replies
var welcome_quickReply = [];
welcome_quickReply.push(botly.createQuickReply("Yes","Yes"));
welcome_quickReply.push(botly.createQuickReply("No","No"));

var welcome_quickReplyI = [];
welcome_quickReplyI.push(botly.createQuickReply("PERSONAL","PERSONAL"));
welcome_quickReplyI.push(botly.createQuickReply("CORPORATE","CORPORATE"));

var welcome_quickReply3 = [];
welcome_quickReply3.push(botly.createQuickReply("18-25 age group","teens"));
welcome_quickReply3.push(botly.createQuickReply("25-60 age group","middle"));
welcome_quickReply3.push(botly.createQuickReply("Above 60 age group","senior"));

var welcome_quickReply2 = [];
welcome_quickReply2.push(botly.createQuickReply("ACCOUNTS","ACCOUNTS"));

var gender_quickReply = [];
gender_quickReply.push(botly.createQuickReply("Male","Male"));
gender_quickReply.push(botly.createQuickReply("Female","Female"));

var qualification_quickReply = [];
qualification_quickReply.push(botly.createQuickReply("PG","PG"));
qualification_quickReply.push(botly.createQuickReply("Graduate","Graduate"));
qualification_quickReply.push(botly.createQuickReply("10th, 12th or Diploma","10th, 12th or Diploma"));
qualification_quickReply.push(botly.createQuickReply("Other","Other"));

var martial_quickReply = [];
martial_quickReply.push(botly.createQuickReply("Married","Married"));
martial_quickReply.push(botly.createQuickReply("Single","Single"));
martial_quickReply.push(botly.createQuickReply("Other","Other"));

var residence_quickReply = [];
residence_quickReply.push(botly.createQuickReply("Self-owned","Self-owned"));
residence_quickReply.push(botly.createQuickReply("Rented","Rented"));
residence_quickReply.push(botly.createQuickReply("Company Sponsored","Company Sponsored"));


var spouse_quickReply = [];
spouse_quickReply.push(botly.createQuickReply("Yes","Yes"));
spouse_quickReply.push(botly.createQuickReply("No","No"));

var formend_quickReply = [];
formend_quickReply.push(botly.createQuickReply("Accept","Acceptx"));
formend_quickReply.push(botly.createQuickReply("Upgrade","Upgradey"));


var fam_no_quickReply = [];
fam_no_quickReply.push(botly.createQuickReply("One","One"));
fam_no_quickReply.push(botly.createQuickReply("Two","Two"));
fam_no_quickReply.push(botly.createQuickReply("Three","Three"));
fam_no_quickReply.push(botly.createQuickReply("More than Three","More than Three"));

var employm_quickReply = [];
employm_quickReply.push(botly.createQuickReply("Self-Employed","Self-Employed"));
employm_quickReply.push(botly.createQuickReply("Salaried","Salaried"));
employm_quickReply.push(botly.createQuickReply("Pensioner","Pensioner"));
employm_quickReply.push(botly.createQuickReply("Other","Other"));

var reason_loan_quickReply = [];
reason_loan_quickReply.push(botly.createQuickReply("Paying loans","Paying loans"));
reason_loan_quickReply.push(botly.createQuickReply("Education/ Wedding","Education/ Wedding"));
reason_loan_quickReply.push(botly.createQuickReply("Home Improvement","Home Improvement"));
reason_loan_quickReply.push(botly.createQuickReply("Others","Others"));


var employee_quickReplies = [];
employee_quickReplies.push(botly.createQuickReply("Finance/Payroll","Finance"));
employee_quickReplies.push(botly.createQuickReply("People(HR)","People"));
employee_quickReplies.push(botly.createQuickReply("Restart","Restart"));

var nonEmployee_quickReplies = [];
nonEmployee_quickReplies.push(botly.createQuickReply("Customer","Customer"));
nonEmployee_quickReplies.push(botly.createQuickReply("Job Seeker/Student","Job Seeker"));
nonEmployee_quickReplies.push(botly.createQuickReply("Restart","Restart"));

var restart_quickReplies = [];
restart_quickReplies.push(botly.createQuickReply("Restart","Restart"));

var customer_quickReplies = [];
customer_quickReplies.push(botly.createQuickReply("Credit Card","Credit Card"));
customer_quickReplies.push(botly.createQuickReply("Banking Services","Banking Services"));

var help_quickReplies = []; 
help_quickReplies.push(botly.createQuickReply("Customer Service", "Customer Service"));
help_quickReplies.push(botly.createQuickReply("Restart", "Restart"));


var hello_quickReplies = [];
hello_quickReplies.push(botly.createQuickReply("Hello","Hello"));

var anythingElse_quickReplies = [];
anythingElse_quickReplies.push(botly.createQuickReply("Yes","Yes"));
anythingElse_quickReplies.push(botly.createQuickReply("No","No"));

var start_quickReplies = [];
start_quickReplies.push(botly.createQuickReply("Start","Start"));

var app = express();
app.use(bodyParser.json());
app.use("/webhook",botly.router());
app.listen(PORT);
console.log("CloBot started on port "+PORT);

