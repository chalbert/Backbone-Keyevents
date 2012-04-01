/**
 * |--------------------|
 * | Backbone-Keyevents |
 * |--------------------|
 *  Backbone-Keyevents is freely distributable under the MIT license.
 *
 *  <a href="https://github.com/chalbert/Backbone-Keyevents">More details & documentation</a>
 *
 * @author Nicolas Gilbert
 *
 * @requires _
 * @requires Backbone
 * @requires Underscore-Keys - https://github.com/chalbert/Underscore-Keys
 */

(function(factory){
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'underscore-keys'], factory);
  } else {
    factory(_, Backbone);
  }

})(function (_, Backbone){
  'use strict';

  /**
   * @borrows Backbone.View#delegateEvents
   */
  var delegateEvents = Backbone.View.prototype.delegateEvents,

      /**
       * @lends BackboneKeyevents
       */
      BackboneKeyevents = {

        /**
         * Extends Backbone event delegation to add specific-key mapping
         *
         * @param {Object} events Backbone.View events object
         */

        delegateEvents: function(events){
          if (!(events || (events = this.events))) return;

          _.each(events, function(method, eventConfig){

            var eventParts = eventConfig.split(' '),
                event = eventParts[0],
                selector = eventParts[1] || '';

            if (this.isSpecificKeyEvent(event)) {
              this.bindSpecificKeyEvent(selector, event, method);
              delete events[eventConfig];
            }

          }, this);
          delegateEvents.call(this, events);
        },

        /**
         * Bind or delegate the key event
         *
         * @param {String} selector jQuery selector
         * @param {String} event Event to bind to
         * @param {String} method Method name
         */

        bindSpecificKeyEvent: function(selector, event, method) {
          var eventParts = this.getEventParts(event),
              data = {
                key: _.getKeycode(eventParts.key),
                method: method
              },
              router = $.proxy(this.keyEventRouter, this);

          if (selector === '') {
            this.$el.bind(eventParts.event, data, router);
          } else {
            this.$el.delegate(selector, eventParts.event, data, router);
          }
        },

        /**
         * Returns True if the passed event is a specific key event
         *
         * @param {String} event The event to test
         * @returns {Boolean} True is the event is a specific key event
         */

        isSpecificKeyEvent: function (event){
          if (!this.isEventWithOption(event)) return false;

          var eventParts = this.getEventParts(event);
          return _.isKeyEvent(eventParts.event) && _.isKey(eventParts.key);
        },

        /**
         * Return True if the passed event has options
         *
         * @param {String} event The event to test
         * @return {Boolean} return True if the event has options
         */

        isEventWithOption: function(event){
          return (event.indexOf(':') !== -1);
        },

        /**
         * Returns the components of the key event
         *
         * @param {String} event
         * @returns {Object} Parts of the events
         */

        getEventParts: function(event) {
          var parts = event.split(':');
          return {
            event: parts[0],
            key: parts[1]
          };
        },

        /**
         * Route keyevent to method
         *
         * @event
         * @param {Object} e Event object
         */

        keyEventRouter: function(e) {
          if (e.data.key === e.which) {
            this[e.data.method].apply(this);
          }
        }
      };

  _.extend(Backbone.View.prototype, BackboneKeyevents);

  return Backbone;

});
