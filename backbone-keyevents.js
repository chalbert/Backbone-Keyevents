define([
  'underscore',
  'backbone',
  'underscore-keys'
], function(_, Backbone) {

  var delegateEvents = Backbone.View.prototype.delegateEvents;

  _.extend(Backbone.View.prototype, {

    delegateEvents: function(events){
      if (!(events || (events = this.events))) return;

      _.each(events, function(method, eventConfig){

        var eventParts = eventConfig.split(' '),
            event = eventParts[0],
            selector = eventParts[1] || '';

        if (_isSpecificKeyEvent(event)) {
          this._bindSpecificKeyEvent(selector, event, method);
          delete events[eventConfig];
        }

      }, this);
      delegateEvents.call(this, events);
    },
    _bindSpecificKeyEvent: function(selector, event, method) {
      var eventParts = _getEventParts(event),
          data = {
            key: _.getKeycode(eventParts.key),
            method: method
          },
          router = $.proxy(_keyEventRouter, this);

      if (selector === '') {
        this.$el.bind(eventParts.event, data, router);
      } else {
        this.$el.delegate(selector, eventParts.event, data, router);
      }
    }
  });

  //|---------|
  //| HELPERS |
  //|---------|

  function _isSpecificKeyEvent(event){
    if (!_isEventWithOption(event)) return false;

    var eventParts = _getEventParts(event);
    return _.isKeyEvent(eventParts.event) && _.isKey(eventParts.key);
  }

  function _isEventWithOption(event){
    return (event.indexOf(':') !== -1);
  }

  function _getEventParts(event) {
    var parts = event.split(':');
    return {
      event: parts[0],
      key: parts[1]
    };
  }

  function _getEventMethod(){
    return _.toArray(arguments).join('_');
  }

  function _keyEventRouter(e) {
    if (e.data.key === e.which) {
      this[e.data.method].apply(this);
    }
  }

  return Backbone;

});