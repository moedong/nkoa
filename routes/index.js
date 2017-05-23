exports.get = function*() {
	var tab = this.query.tab;
	var p = this.query.p || 1;

	yield this.render('index', {
			topics: {
				user: {
					name: "mm",
					email: "123213"
				},
				title: "hahaha",
				content: "dewqewqew",
				tab: "ytry65y",
				pv: "t45t4t",
				comment: 1,
				created_at: "2017",
				updated_at: "201705"
			}
		}
	);
};