const Xpan = function(args){
// var Xpan = function(args){
	this.args = args;
}

Xpan.prototype.test = function(){
	console.log('exp',this.args)
}

export default Xpan;
