define([
  'underscore',
  'backbone',
  'underscore-keys'
], function(_, Backbone) {

  var delegateEvents = Backbone.View.prototype.delegateEvents;

  _.extend(Backbone.View.prototype, {

    delegateEvents: function(events){
      _.each(events, function(method, eventConfig){

        var eventParts = eventConfig.split(' '),
            event = eventParts[0],
            selector = eventParts[1] || '';

        if (_isSpecificKeyEvent(event)) {
          this._bindSpecificKeyEvent(this, selector, event);
          delete events[eventConfig];
        }

      }, this);
      delegateEvents.call(this, events);
    },
    bindSpecificKeyEvent: function(selector, event) {
      var eventParts = _getEventParts(event),
          data = {
            key: _.getKeycode(eventParts.key),
            keyName: eventParts.key,
            el: selector
          },
          router = _keyEventRouter;

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

    var eventParts = this._getEventParts(event);
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
      var method = _getEventMethod(e.data.el, e.type, e.data.keyName);
      this[method].apply(this);
    }
  }

  return Backbone;

});