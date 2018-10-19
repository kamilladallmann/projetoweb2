var mongoose = require('mongoose');
var Schema = mongoose.Schema;

detailSchema = new Schema( {

	name: String,
	image1:String,
	
	added_date:{
		type: Date,
		default: Date.now
	}
}),
Detail = mongoose.model('Detail', detailSchema);


module.exports = Detail;