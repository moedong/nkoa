var Topic = require('../models').Topic;
var cache = require('co-cache')({
  expire: 10000
});

//新建一个话题
exports.addTopic = function (data) {
  return Topic.create(data);
};

//通过id获取一个话题,并增加pv 1
exports.getTopicById = function (id) {
  return Topic.findByIdAndUpdate(id, {$inc: {pv: 1}}).exec();
};

//通过标签和页码获取10个话题
exports.getTopicsByTab = cache(function getTopicsByTab(tab, p) {
  var query = {};
  if (tab) { query.tab = tab; }
  return Topic.find(query).skip((p - 1) * 10).sort('-updated_at').limit(10).select('-content').exec();
}, {
  key: function (tab, p) {
    tab = tab || 'all';
    return this.name + ':' + tab + ':' + p;
  }
});

