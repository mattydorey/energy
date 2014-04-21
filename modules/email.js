var nodemailer = require("nodemailer");

function Email (contact, message) {
	var smtpTransport = nodemailer.createTransport("Sendmail");
	this.contact = contact;
	this.message = message;

	var mailOptions = {
	    from: "1@m3m3n70.com",
	    to: "1@m3m3n70.com",
	    //subject: "Order Socks!",
	    text: message
	}

	this.sendEmail = function (cb) {
		smtpTransport.sendMail(mailOptions, function (error, result) {
			console.log('message sent');
			cb(null, result);
		});
	}
}

//"Please order new socks for Matt at: http://www.uniqlo.com/us/men/innerwear-and-loungewear/color-socks/color/men-color-socks-076690.html#07 "
module.exports = Email;