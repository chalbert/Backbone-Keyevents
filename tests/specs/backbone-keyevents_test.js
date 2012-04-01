define([
  'jquery',
  'backbone',
  'backbone-keyevents'
], function($, Backbone){
  'use strict';

  describe("Backbone-Keyevents", function () {

    var view;
    beforeEach(function(){
      $('body').append('<div id="container"><a></a></div>');
      var View = Backbone.View.extend({
        el: '#container',
        elements: {
          content: '#content'
        },
        events: {
          'keypress:enter a': 'my_method1',
          'keypress:bouh a': 'my_method2',
          'click:enter a': 'my_method3'
        },
        my_method1: function(){},
        my_method2: function(){},
        my_method3: function(){}

      });
      view = new View();
    });

    /**
     * @method bindSpecificKeyEvent()
     */

    describe("bindSpecificKeyEvent()", function () {

      describe("If the event is a valid specific-key event", function () {

        it("Sould delete the specific-key events from the 'events' hash", function () {
          expect(view.events['keypress:bouh a']).not.toBe();
        });

        describe("If the selector is falsly", function () {

          it("Should bind directly the key event to the element`", function () {
            view.$el.bind = sinon.stub();
            view.bindSpecificKeyEvent('', 'keypress:right', 'myMethod');
            expect(view.$el.bind).toHaveBeenCalled();
          });

        });

        describe("If a selector is defined", function () {

          it("Should delegate the event", function () {
            view.$el.delegate = sinon.stub();
            view.bindSpecificKeyEvent('a', 'keypress:right', 'myMethod');
            expect(view.$el.delegate).toHaveBeenCalled();
          });

        });

      });

    });

    /**
     * @method isSpecificKeyEvent()
     */

    describe("isSpecificKeyEvent()", function () {

      it("Should return True if is a specific key event", function () {
        // False
        expect(view.isSpecificKeyEvent('keypress')).toBeFalsy();
        expect(view.isSpecificKeyEvent('click')).toBeFalsy();
        expect(view.isSpecificKeyEvent('click:enter')).toBeFalsy();
        expect(view.isSpecificKeyEvent('keypress:bouh')).toBeFalsy();
        // True
        expect(view.isSpecificKeyEvent('keypress:enter')).toBeTruthy();
        expect(view.isSpecificKeyEvent('keydown:w')).toBeTruthy();
        expect(view.isSpecificKeyEvent('keyup:escape')).toBeTruthy();
      });

    });


  });

});