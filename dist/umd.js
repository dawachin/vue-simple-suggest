(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueSimpleSuggest = factory());
}(this, (function () { 'use strict';

  var defaultControls = {
    selectionUp: [38],
    selectionDown: [40],
    select: [13],
    hideList: [27],
    autocomplete: [32, 13]
  };

  var modes = {
    input: String,
    select: Object
  };

  var inputProp = {
    type: String
  };

  var inputProps = {
    type: inputProp,
    accesskey: inputProp,
    autocomplete: inputProp,
    form: inputProp,
    formaction: inputProp,
    formenctype: inputProp,
    formmethod: inputProp,
    formtarget: inputProp,
    height: inputProp,
    width: inputProp,
    inputmode: inputProp,
    max: inputProp,
    min: inputProp,
    minlength: inputProp,
    maxlength: inputProp,
    name: inputProp,
    pattern: inputProp,
    placeholder: inputProp,
    selectionDirection: inputProp,
    selectionEnd: inputProp,
    selectionStart: inputProp,
    size: inputProp,
    src: inputProp,
    step: inputProp,
    tabindex: inputProp,
    title: inputProp,
    spellcheck: {},
    readonly: {},
    required: {},
    multiple: {},
    formnovalidate: {},
    autofocus: {},
    checked: {},
    disabled: {}
  };

  function fromPath(obj, path) {
    return path.split('.').reduce(function (o, i) {
      return o === Object(o) ? o[i] : o;
    }, obj);
  }

  function hasKeyCode(arr, event) {
    if (arr.length <= 0) return false;

    var has = function has(arr) {
      return arr.some(function (code) {
        return code === event.keyCode;
      });
    };
    if (Array.isArray(arr[0])) {
      return arr.some(function (array) {
        return has(array);
      });
    } else {
      return has(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  var event = 'input';

  var VueSimpleSuggest = {
    render: function render() {
      var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest" }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", class: { designed: !_vm.destyled }, on: { "click": _vm.onInputClick, "input": _vm.onInput, "keydown": _vm.onArrowKeyDown, "keyup": function keyup($event) {
            _vm.onListKeyUp($event), _vm.onAutocomplete($event);
          } } }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", domProps: { "value": _vm.text || '' } }, 'input', _vm.$props, false))])], 2), _vm._v(" "), !!_vm.listShown && !_vm.removeList ? _c('div', { staticClass: "suggestions", class: { designed: !_vm.destyled } }, [_vm._t("misc-item-above", null, { suggestions: _vm.suggestions, query: _vm.text }), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
        return _c('div', { key: _vm.isPlainSuggestion ? 'suggestion-' + index : _vm.valueProperty(suggestion), staticClass: "suggest-item", class: {
            selected: _vm.selected && _vm.valueProperty(suggestion) == _vm.valueProperty(_vm.selected),
            hover: _vm.hovered && _vm.valueProperty(_vm.hovered) == _vm.valueProperty(suggestion)
          }, on: { "mouseenter": function mouseenter($event) {
              _vm.hover(suggestion, $event.target);
            }, "mouseleave": function mouseleave($event) {
              _vm.hover(null, $event.target);
            } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { suggestion: suggestion, query: _vm.text })], 2);
      }), _vm._v(" "), _vm._t("misc-item-below", null, { suggestions: _vm.suggestions, query: _vm.text })], 2) : _vm._e()]);
    },
    staticRenderFns: [],
    name: 'vue-simple-suggest',
    model: {
      prop: 'value',
      get event() {
        return event;
      }
    },
    props: Object.assign({}, inputProps, {
      controls: {
        type: Object,
        default: function _default() {
          return defaultControls;
        }
      },
      minLength: {
        type: Number,
        default: 1
      },
      maxSuggestions: {
        type: Number,
        default: 10
      },
      displayAttribute: {
        type: String,
        default: 'title'
      },
      valueAttribute: {
        type: String,
        default: 'id'
      },
      list: {
        type: [Function, Array],
        default: function _default() {
          return [];
        }
      },
      removeList: {
        type: Boolean,
        default: false
      },
      destyled: {
        type: Boolean,
        default: false
      },
      filterByQuery: {
        type: Boolean,
        default: false
      },
      filter: {
        type: Function,
        default: function _default(el) {
          return value ? ~this.displayProperty(el).toLowerCase().indexOf(value.toLowerCase()) : true;
        }
      },

      debounce: {
        type: Number,
        default: 0
      },
      value: {},
      mode: {
        type: String,
        default: event,
        validator: function validator(value) {
          return !!~Object.keys(modes).indexOf(value.toLowerCase());
        }
      }
    }),
    // Handle run-time mode changes:
    watch: {
      mode: function mode(v) {
        return event = v;
      }
    },
    //
    data: function data() {
      return {
        selected: null,
        hovered: null,
        suggestions: [],
        listShown: false,
        inputElement: null,
        canSend: true,
        timeoutInstance: null,
        text: this.value,
        isPlainSuggestion: false,
        controlScheme: {}
      };
    },

    computed: {
      slotIsComponent: function slotIsComponent() {
        return this.$slots.default && this.$slots.default.length > 0 && !!this.$slots.default[0].componentInstance;
      },
      listIsRequest: function listIsRequest() {
        return typeof this.list === 'function';
      },
      input: function input() {
        return this.slotIsComponent ? this.$slots.default[0].componentInstance : this.inputElement;
      },
      on: function on() {
        return this.slotIsComponent ? '$on' : 'addEventListener';
      },
      off: function off() {
        return this.slotIsComponent ? '$off' : 'removeEventListener';
      },
      hoveredIndex: function hoveredIndex() {
        var _this = this;

        return this.suggestions.findIndex(function (el) {
          return _this.hovered && _this.valueProperty(_this.hovered) == _this.valueProperty(el);
        });
      }
    },
    created: function created() {
      this.controlScheme = Object.assign({}, defaultControls, this.controls);
      event = this.mode;
    },
    mounted: function mounted() {
      this.inputElement = this.$refs['inputSlot'].querySelector('input');
      this.input[this.on]('blur', this.onBlur);
      this.input[this.on]('focus', this.onFocus);
    },
    beforeDestroy: function beforeDestroy() {
      this.input[this.off]('blur', this.onBlur);
      this.input[this.off]('focus', this.onFocus);
    },

    methods: {
      miscSlotsAreEmpty: function miscSlotsAreEmpty() {
        var _this2 = this;

        var slot = function slot(name) {
          return _this2.$scopedSlots['misc-item-' + name];
        };
        var isFunction = function isFunction(slotName) {
          return slot(slotName) && typeof slot(slotName) === 'function';
        };

        return ['above', 'below'].some(function (slotName) {
          return isFunction(slotName) ? !slot(slotName)(_this2) : !slot(slotName);
        });
      },
      displayProperty: function displayProperty(obj) {
        return (this.isPlainSuggestion ? obj : fromPath(obj, this.displayAttribute)) + '';
      },
      valueProperty: function valueProperty(obj) {
        return this.isPlainSuggestion ? obj : fromPath(obj, this.valueAttribute);
      },
      select: function select(item) {
        this.hovered = null;
        this.selected = item;

        this.$emit('select', item);

        // Ya know, input stuff
        this.$emit('input', this.displayProperty(item));
        this.inputElement.value = this.displayProperty(item);
        this.text = this.displayProperty(item);

        this.inputElement.focus();
      },
      hover: function hover(item, elem) {
        this.hovered = item;
        if (this.hovered != null) {
          this.$emit('hover', item, elem);
        }
      },
      hideList: function hideList() {
        var ignoreSelection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (this.listShown) {
          if (this.hovered && !ignoreSelection) {
            this.select(this.hovered);
          }
          this.listShown = false;
          this.$emit('hide-list');
        }
      },
      showList: function showList() {
        if (!this.listShown && this.text && this.text.length >= this.minLength) {
          if (this.suggestions.length > 0) {
            this.listShown = true;
            this.$emit('show-list');
          }
        }
      },
      onInputClick: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(this.minLength === 0 && !this.text)) {
                    _context.next = 3;
                    break;
                  }

                  _context.next = 3;
                  return this.research();

                case 3:

                  this.showList();

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function onInputClick(_x2) {
          return _ref.apply(this, arguments);
        }

        return onInputClick;
      }(),
      onArrowKeyDown: function onArrowKeyDown(event) {
        if (hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], event)) {
          event.preventDefault();
          this.showList();

          var isArrowDown = hasKeyCode(this.controlScheme.selectionDown, event);
          var direction = isArrowDown * 2 - 1;
          var listEdge = isArrowDown ? 0 : this.suggestions.length - 1;
          var hoversBetweenEdges = isArrowDown ? this.hoveredIndex < this.suggestions.length - 1 : this.hoveredIndex > 0;

          var item = null;

          if (!this.hovered) {
            item = this.selected || this.suggestions[listEdge];
          } else if (hoversBetweenEdges) {
            item = this.suggestions[this.hoveredIndex + direction];
          } else /* if hovers on edge */{
              item = this.suggestions[listEdge];
            }

          this.hover(item);
        }
      },
      onListKeyUp: function onListKeyUp(event) {
        var select = this.controlScheme.select,
            hideList = this.controlScheme.hideList;

        if (hasKeyCode([select, hideList], event)) {
          event.preventDefault();
          if (this.listShown) {
            this.hideList(hasKeyCode(hideList, event));
          } else if (hasKeyCode(select, event)) {
            this.research();
          }
        }
      },
      onAutocomplete: function onAutocomplete(event) {
        if (hasKeyCode(this.controlScheme.autocomplete, event) && (event.ctrlKey || event.shiftKey) && this.suggestions.length > 0 && this.suggestions[0]) {
          event.preventDefault();
          this.select(this.suggestions[0]);
          this.hover(this.suggestions[0]);
        }
      },
      onBlur: function onBlur(e) {
        this.hideList();
        this.$emit('blur', e);
      },
      onFocus: function onFocus(e) {
        this.$emit('focus', e);
        this.showList();
      },
      onInput: function onInput(inputEvent) {
        this.text = inputEvent.target.value;
        this.$emit('input', this.text);

        if (this.selected) {
          this.selected = null;
          this.$emit('select', null);
        }

        if (this.debounce) {
          clearTimeout(this.timeoutInstance);
          this.timeoutInstance = setTimeout(this.research, this.debounce);
        } else {
          this.research();
        }
      },
      research: function () {
        var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          var _this3 = this;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;

                  if (!this.canSend) {
                    _context2.next = 10;
                    break;
                  }

                  this.canSend = false;
                  _context2.t0 = this;
                  _context2.t1 = this;
                  _context2.next = 7;
                  return this.getSuggestions(this.text);

                case 7:
                  _context2.t2 = _context2.sent;

                  _context2.t0.$set.call(_context2.t0, _context2.t1, 'suggestions', _context2.t2);

                  this.canSend = true;

                case 10:
                  _context2.next = 17;
                  break;

                case 12:
                  _context2.prev = 12;
                  _context2.t3 = _context2['catch'](0);

                  this.clearSuggestions();
                  console.error(_context2.t3);
                  throw _context2.t3;

                case 17:
                  _context2.prev = 17;

                  this.$nextTick(function () {
                    if (_this3.suggestions.length === 0 && _this3.miscSlotsAreEmpty()) {
                      _this3.hideList(true);
                    } else {
                      _this3.showList();
                    }
                  });

                  return _context2.abrupt('return', this.suggestions);

                case 21:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[0, 12, 17, 21]]);
        }));

        function research() {
          return _ref2.apply(this, arguments);
        }

        return research;
      }(),
      getSuggestions: function () {
        var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var result;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(this.listShown && !value)) {
                    _context3.next = 4;
                    break;
                  }

                  this.hideList();
                  this.clearSuggestions();
                  return _context3.abrupt('return', this.suggestions);

                case 4:
                  if (!(this.minLength > 0 && value.length < this.minLength)) {
                    _context3.next = 6;
                    break;
                  }

                  return _context3.abrupt('return', this.suggestions);

                case 6:

                  this.selected = null;

                  // Start request if can
                  if (this.listIsRequest) {
                    this.$emit('request-start', value);
                  }

                  result = [];
                  _context3.prev = 9;

                  if (!this.listIsRequest) {
                    _context3.next = 19;
                    break;
                  }

                  _context3.next = 13;
                  return this.list(value);

                case 13:
                  _context3.t1 = _context3.sent;

                  if (_context3.t1) {
                    _context3.next = 16;
                    break;
                  }

                  _context3.t1 = [];

                case 16:
                  _context3.t0 = _context3.t1;
                  _context3.next = 20;
                  break;

                case 19:
                  _context3.t0 = this.list;

                case 20:
                  result = _context3.t0;


                  // IFF the result is not an array (just in case!) - make it an array
                  if (!Array.isArray(result)) {
                    result = [result];
                  }

                  if (_typeof(result[0]) === 'object' && !Array.isArray(result[0])) {
                    this.isPlainSuggestion = false;
                  } else {
                    this.isPlainSuggestion = true;
                  }

                  if (this.filterByQuery) {
                    result = result.filter(this.filter);
                  }

                  if (this.listIsRequest) {
                    this.$emit('request-done', result);
                  }
                  _context3.next = 34;
                  break;

                case 27:
                  _context3.prev = 27;
                  _context3.t2 = _context3['catch'](9);

                  if (!this.listIsRequest) {
                    _context3.next = 33;
                    break;
                  }

                  this.$emit('request-failed', _context3.t2);
                  _context3.next = 34;
                  break;

                case 33:
                  throw _context3.t2;

                case 34:
                  _context3.prev = 34;

                  if (this.maxSuggestions) {
                    result.splice(this.maxSuggestions);
                  }

                  return _context3.abrupt('return', result);

                case 38:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[9, 27, 34, 38]]);
        }));

        function getSuggestions() {
          return _ref3.apply(this, arguments);
        }

        return getSuggestions;
      }(),
      clearSuggestions: function clearSuggestions() {
        this.suggestions.splice(0);
      }
    }
  };

  return VueSimpleSuggest;

})));
