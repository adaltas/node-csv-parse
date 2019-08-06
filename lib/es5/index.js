"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/*
CSV Parse

Please look at the [project documentation](https://csv.js.org/parse/) for additional
information.
*/
var _require = require('stream'),
    Transform = _require.Transform;

var ResizeableBuffer = require('./ResizeableBuffer');

var cr = 13;
var nl = 10;
var space = 32;
var tab = 9;
var bom_utf8 = Buffer.from([239, 187, 191]);

var Parser =
/*#__PURE__*/
function (_Transform) {
  _inherits(Parser, _Transform);

  function Parser() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Parser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Parser).call(this, _objectSpread({}, {
      readableObjectMode: true
    }, {}, opts)));
    var options = {}; // Merge with user options

    for (var opt in opts) {
      options[underscore(opt)] = opts[opt];
    } // Normalize option `bom`


    if (options.bom === undefined || options.bom === null || options.bom === false) {
      options.bom = false;
    } else if (options.bom !== true) {
      throw new Error("Invalid Option: bom must be true, got ".concat(JSON.stringify(options.bom)));
    } // Normalize option `cast`


    var fnCastField = null;

    if (options.cast === undefined || options.cast === null || options.cast === false || options.cast === '') {
      options.cast = undefined;
    } else if (typeof options.cast === 'function') {
      fnCastField = options.cast;
      options.cast = true;
    } else if (options.cast !== true) {
      throw new Error('Invalid Option: cast must be true or a function');
    } // Normalize option `cast_date`


    if (options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === '') {
      options.cast_date = false;
    } else if (options.cast_date === true) {
      options.cast_date = function (value) {
        var date = Date.parse(value);
        return !isNaN(date) ? new Date(date) : value;
      };
    } else if (typeof options.cast_date !== 'function') {
      throw new Error('Invalid Option: cast_date must be true or a function');
    } // Normalize option `columns`


    var fnFirstLineToHeaders = null;

    if (options.columns === true) {
      // Fields in the first line are converted as-is to columns
      fnFirstLineToHeaders = undefined;
    } else if (typeof options.columns === 'function') {
      fnFirstLineToHeaders = options.columns;
      options.columns = true;
    } else if (Array.isArray(options.columns)) {
      options.columns = normalizeColumnsArray(options.columns);
    } else if (options.columns === undefined || options.columns === null || options.columns === false) {
      options.columns = false;
    } else {
      throw new Error("Invalid Option columns: expect an object or true, got ".concat(JSON.stringify(options.columns)));
    } // Normalize option `comment`


    if (options.comment === undefined || options.comment === null || options.comment === false || options.comment === '') {
      options.comment = null;
    } else {
      if (typeof options.comment === 'string') {
        options.comment = Buffer.from(options.comment);
      }

      if (!Buffer.isBuffer(options.comment)) {
        throw new Error("Invalid Option: comment must be a buffer or a string, got ".concat(JSON.stringify(options.comment)));
      }
    } // Normalize option `delimiter`


    if (options.delimiter === undefined || options.delimiter === null || options.delimiter === false) {
      options.delimiter = Buffer.from(',');
    } else if (Buffer.isBuffer(options.delimiter)) {
      if (options.delimiter.length === 0) {
        throw new Error("Invalid Option: delimiter must be a non empty buffer");
      } // Great, nothing to do

    } else if (typeof options.delimiter === 'string') {
      if (options.delimiter.length === 0) {
        throw new Error("Invalid Option: delimiter must be a non empty string");
      }

      options.delimiter = Buffer.from(options.delimiter);
    } else {
      throw new Error("Invalid Option: delimiter must be a string or a buffer, got ".concat(options.delimiter));
    } // Normalize option `escape`


    if (options.escape === undefined || options.escape === null) {
      options.escape = Buffer.from('"');
    } else if (typeof options.escape === 'string') {
      options.escape = Buffer.from(options.escape);
    }

    if (!Buffer.isBuffer(options.escape)) {
      throw new Error("Invalid Option: escape must be a buffer or a string, got ".concat(JSON.stringify(options.escape)));
    } else if (options.escape.length !== 1) {
      throw new Error("Invalid Option Length: escape must be one character, got ".concat(options.escape.length));
    } else {
      options.escape = options.escape[0];
    } // Normalize option `from`


    if (options.from === undefined || options.from === null) {
      options.from = 1;
    } else {
      if (typeof options.from === 'string' && /\d+/.test(options.from)) {
        options.from = parseInt(options.from);
      }

      if (Number.isInteger(options.from)) {
        if (options.from < 0) {
          throw new Error("Invalid Option: from must be a positive integer, got ".concat(JSON.stringify(opts.from)));
        }
      } else {
        throw new Error("Invalid Option: from must be an integer, got ".concat(JSON.stringify(options.from)));
      }
    } // Normalize option `from_line`


    if (options.from_line === undefined || options.from_line === null) {
      options.from_line = 1;
    } else {
      if (typeof options.from_line === 'string' && /\d+/.test(options.from_line)) {
        options.from_line = parseInt(options.from_line);
      }

      if (Number.isInteger(options.from_line)) {
        if (options.from_line <= 0) {
          throw new Error("Invalid Option: from_line must be a positive integer greater than 0, got ".concat(JSON.stringify(opts.from_line)));
        }
      } else {
        throw new Error("Invalid Option: from_line must be an integer, got ".concat(JSON.stringify(opts.from_line)));
      }
    } // Normalize option `info`


    if (options.info === undefined || options.info === null || options.info === false) {
      options.info = false;
    } else if (options.info !== true) {
      throw new Error("Invalid Option: info must be true, got ".concat(JSON.stringify(options.info)));
    } // Normalize option `max_record_size`


    if (options.max_record_size === undefined || options.max_record_size === null || options.max_record_size === false) {
      options.max_record_size = 0;
    } else if (Number.isInteger(options.max_record_size) && options.max_record_size >= 0) {// Great, nothing to do
    } else if (typeof options.max_record_size === 'string' && /\d+/.test(options.max_record_size)) {
      options.max_record_size = parseInt(options.max_record_size);
    } else {
      throw new Error("Invalid Option: max_record_size must be a positive integer, got ".concat(JSON.stringify(options.max_record_size)));
    } // Normalize option `objname`


    if (options.objname === undefined || options.objname === null || options.objname === false) {
      options.objname = undefined;
    } else if (Buffer.isBuffer(options.objname)) {
      if (options.objname.length === 0) {
        throw new Error("Invalid Option: objname must be a non empty buffer");
      }

      options.objname = options.objname.toString();
    } else if (typeof options.objname === 'string') {
      if (options.objname.length === 0) {
        throw new Error("Invalid Option: objname must be a non empty string");
      } // Great, nothing to do

    } else {
      throw new Error("Invalid Option: objname must be a string or a buffer, got ".concat(options.objname));
    } // Normalize option `quote`


    if (options.quote === null || options.quote === false || options.quote === '') {
      options.quote = null;
    } else {
      if (options.quote === undefined || options.quote === true) {
        options.quote = Buffer.from('"');
      } else if (typeof options.quote === 'string') {
        options.quote = Buffer.from(options.quote);
      }

      if (!Buffer.isBuffer(options.quote)) {
        throw new Error("Invalid Option: quote must be a buffer or a string, got ".concat(JSON.stringify(options.quote)));
      } else if (options.quote.length !== 1) {
        throw new Error("Invalid Option Length: quote must be one character, got ".concat(options.quote.length));
      } else {
        options.quote = options.quote[0];
      }
    } // Normalize option `raw`


    if (options.raw === undefined || options.raw === null || options.raw === false) {
      options.raw = false;
    } else if (options.raw !== true) {
      throw new Error("Invalid Option: raw must be true, got ".concat(JSON.stringify(options.raw)));
    } // Normalize option `record_delimiter`


    if (!options.record_delimiter) {
      options.record_delimiter = [];
    } else if (!Array.isArray(options.record_delimiter)) {
      options.record_delimiter = [options.record_delimiter];
    }

    options.record_delimiter = options.record_delimiter.map(function (rd) {
      if (typeof rd === 'string') {
        rd = Buffer.from(rd);
      }

      return rd;
    }); // Normalize option `relax`

    if (typeof options.relax === 'boolean') {// Great, nothing to do
    } else if (options.relax === undefined || options.relax === null) {
      options.relax = false;
    } else {
      throw new Error("Invalid Option: relax must be a boolean, got ".concat(JSON.stringify(options.relax)));
    } // Normalize option `relax_column_count`


    if (typeof options.relax_column_count === 'boolean') {// Great, nothing to do
    } else if (options.relax_column_count === undefined || options.relax_column_count === null) {
      options.relax_column_count = false;
    } else {
      throw new Error("Invalid Option: relax_column_count must be a boolean, got ".concat(JSON.stringify(options.relax_column_count)));
    } // Normalize option `skip_empty_lines`


    if (typeof options.skip_empty_lines === 'boolean') {// Great, nothing to do
    } else if (options.skip_empty_lines === undefined || options.skip_empty_lines === null) {
      options.skip_empty_lines = false;
    } else {
      throw new Error("Invalid Option: skip_empty_lines must be a boolean, got ".concat(JSON.stringify(options.skip_empty_lines)));
    } // Normalize option `skip_lines_with_empty_values`


    if (typeof options.skip_lines_with_empty_values === 'boolean') {// Great, nothing to do
    } else if (options.skip_lines_with_empty_values === undefined || options.skip_lines_with_empty_values === null) {
      options.skip_lines_with_empty_values = false;
    } else {
      throw new Error("Invalid Option: skip_lines_with_empty_values must be a boolean, got ".concat(JSON.stringify(options.skip_lines_with_empty_values)));
    } // Normalize option `skip_lines_with_error`


    if (typeof options.skip_lines_with_error === 'boolean') {// Great, nothing to do
    } else if (options.skip_lines_with_error === undefined || options.skip_lines_with_error === null) {
      options.skip_lines_with_error = false;
    } else {
      throw new Error("Invalid Option: skip_lines_with_error must be a boolean, got ".concat(JSON.stringify(options.skip_lines_with_error)));
    } // Normalize option `rtrim`


    if (options.rtrim === undefined || options.rtrim === null || options.rtrim === false) {
      options.rtrim = false;
    } else if (options.rtrim !== true) {
      throw new Error("Invalid Option: rtrim must be a boolean, got ".concat(JSON.stringify(options.rtrim)));
    } // Normalize option `ltrim`


    if (options.ltrim === undefined || options.ltrim === null || options.ltrim === false) {
      options.ltrim = false;
    } else if (options.ltrim !== true) {
      throw new Error("Invalid Option: ltrim must be a boolean, got ".concat(JSON.stringify(options.ltrim)));
    } // Normalize option `trim`


    if (options.trim === undefined || options.trim === null || options.trim === false) {
      options.trim = false;
    } else if (options.trim !== true) {
      throw new Error("Invalid Option: trim must be a boolean, got ".concat(JSON.stringify(options.trim)));
    } // Normalize options `trim`, `ltrim` and `rtrim`


    if (options.trim === true && opts.ltrim !== false) {
      options.ltrim = true;
    } else if (options.ltrim !== true) {
      options.ltrim = false;
    }

    if (options.trim === true && opts.rtrim !== false) {
      options.rtrim = true;
    } else if (options.rtrim !== true) {
      options.rtrim = false;
    } // Normalize option `to`


    if (options.to === undefined || options.to === null) {
      options.to = -1;
    } else {
      if (typeof options.to === 'string' && /\d+/.test(options.to)) {
        options.to = parseInt(options.to);
      }

      if (Number.isInteger(options.to)) {
        if (options.to <= 0) {
          throw new Error("Invalid Option: to must be a positive integer greater than 0, got ".concat(JSON.stringify(opts.to)));
        }
      } else {
        throw new Error("Invalid Option: to must be an integer, got ".concat(JSON.stringify(opts.to)));
      }
    } // Normalize option `to_line`


    if (options.to_line === undefined || options.to_line === null) {
      options.to_line = -1;
    } else {
      if (typeof options.to_line === 'string' && /\d+/.test(options.to_line)) {
        options.to_line = parseInt(options.to_line);
      }

      if (Number.isInteger(options.to_line)) {
        if (options.to_line <= 0) {
          throw new Error("Invalid Option: to_line must be a positive integer greater than 0, got ".concat(JSON.stringify(opts.to_line)));
        }
      } else {
        throw new Error("Invalid Option: to_line must be an integer, got ".concat(JSON.stringify(opts.to_line)));
      }
    }

    _this.info = {
      comment_lines: 0,
      empty_lines: 0,
      invalid_field_length: 0,
      lines: 1,
      records: 0
    };
    _this.options = options;
    _this.state = {
      bomSkipped: false,
      castField: fnCastField,
      commenting: false,
      enabled: options.from_line === 1,
      escaping: false,
      escapeIsQuote: options.escape === options.quote,
      expectedRecordLength: options.columns === null ? 0 : options.columns.length,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      info: Object.assign({}, _this.info),
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 2 : Math.max.apply(Math, _toConsumableArray(options.record_delimiter.map(function (v) {
        return v.length;
      }))),
      trimChars: [Buffer.from(' ')[0], Buffer.from('\t')[0]],
      wasQuoting: false,
      wasRowDelimiter: false
    };
    return _this;
  } // Implementation of `Transform._transform`


  _createClass(Parser, [{
    key: "_transform",
    value: function _transform(buf, encoding, callback) {
      if (this.state.stop === true) {
        return;
      }

      var err = this.__parse(buf, false);

      if (err !== undefined) {
        this.state.stop = true;
      }

      callback(err);
    } // Implementation of `Transform._flush`

  }, {
    key: "_flush",
    value: function _flush(callback) {
      if (this.state.stop === true) {
        return;
      }

      var err = this.__parse(undefined, true);

      callback(err);
    } // Central parser implementation

  }, {
    key: "__parse",
    value: function __parse(nextBuf, end) {
      var _this$options = this.options,
          bom = _this$options.bom,
          comment = _this$options.comment,
          escape = _this$options.escape,
          from = _this$options.from,
          from_line = _this$options.from_line,
          info = _this$options.info,
          ltrim = _this$options.ltrim,
          max_record_size = _this$options.max_record_size,
          quote = _this$options.quote,
          raw = _this$options.raw,
          relax = _this$options.relax,
          rtrim = _this$options.rtrim,
          skip_empty_lines = _this$options.skip_empty_lines,
          to = _this$options.to,
          to_line = _this$options.to_line;
      var record_delimiter = this.options.record_delimiter;
      var _this$state = this.state,
          bomSkipped = _this$state.bomSkipped,
          previousBuf = _this$state.previousBuf,
          rawBuffer = _this$state.rawBuffer,
          escapeIsQuote = _this$state.escapeIsQuote,
          trimChars = _this$state.trimChars;
      var buf;

      if (previousBuf === undefined) {
        if (nextBuf === undefined) {
          // Handle empty string
          this.push(null);
          return;
        } else {
          buf = nextBuf;
        }
      } else if (previousBuf !== undefined && nextBuf === undefined) {
        buf = previousBuf;
      } else {
        buf = Buffer.concat([previousBuf, nextBuf]);
      } // Handle UTF BOM


      if (bomSkipped === false) {
        if (bom === false) {
          this.state.bomSkipped = true;
        } else if (buf.length < 3) {
          // No enough data
          if (end === false) {
            // Wait for more data
            this.state.previousBuf = buf;
            return;
          } // skip BOM detect because data length < 3

        } else {
          if (bom_utf8.compare(buf, 0, 3) === 0) {
            // Skip BOM
            buf = buf.slice(3);
          }

          this.state.bomSkipped = true;
        }
      }

      var bufLen = buf.length;
      var pos;

      for (pos = 0; pos < bufLen; pos++) {
        // Ensure we get enough space to look ahead
        // There should be a way to move this out of the loop
        if (this.__needMoreData(pos, bufLen, end)) {
          break;
        }

        if (this.state.wasRowDelimiter === true) {
          this.info.lines++;

          if (info === true && this.state.record.length === 0 && this.state.field.length === 0 && this.state.wasQuoting === false) {
            this.state.info = Object.assign({}, this.info);
          }

          this.state.wasRowDelimiter = false;
        }

        if (to_line !== -1 && this.info.lines > to_line) {
          this.state.stop = true;
          this.push(null);
          return;
        } // Auto discovery of record_delimiter, unix, mac and windows supported


        if (this.state.quoting === false && record_delimiter.length === 0) {
          var record_delimiterCount = this.__autoDiscoverRowDelimiter(buf, pos);

          if (record_delimiterCount) {
            record_delimiter = this.options.record_delimiter;
          }
        }

        var chr = buf[pos];

        if (raw === true) {
          rawBuffer.append(chr);
        }

        if ((chr === cr || chr === nl) && this.state.wasRowDelimiter === false) {
          this.state.wasRowDelimiter = true;
        } // Previous char was a valid escape char
        // treat the current char as a regular char


        if (this.state.escaping === true) {
          this.state.escaping = false;
        } else {
          // Escape is only active inside quoted fields
          if (this.state.quoting === true && chr === escape && pos + 1 < bufLen) {
            // We are quoting, the char is an escape chr and there is a chr to escape
            if (escapeIsQuote) {
              if (buf[pos + 1] === quote) {
                this.state.escaping = true;
                continue;
              }
            } else {
              this.state.escaping = true;
              continue;
            }
          } // Not currently escaping and chr is a quote
          // TODO: need to compare bytes instead of single char


          if (this.state.commenting === false && chr === quote) {
            if (this.state.quoting === true) {
              var nextChr = buf[pos + 1];

              var isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr); // const isNextChrComment = nextChr === comment


              var isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos + 1, nextChr);

              var isNextChrDelimiter = this.__isDelimiter(nextChr, buf, pos + 1);

              var isNextChrRowDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRowDelimiter(buf, pos + 1) : this.__isRecordDelimiter(nextChr, buf, pos + 1); // Escape a quote
              // Treat next char as a regular character
              // TODO: need to compare bytes instead of single char

              if (chr === escape && nextChr === quote) {
                pos++;
              } else if (!nextChr || isNextChrDelimiter || isNextChrRowDelimiter || isNextChrComment || isNextChrTrimable) {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                continue;
              } else if (relax === false) {
                var err = this.__error("Invalid Closing Quote: got \"".concat(String.fromCharCode(nextChr), "\" at line ").concat(this.info.lines, " instead of delimiter, row delimiter, trimable character (if activated) or comment"));

                if (err !== undefined) return err;
              } else {
                this.state.quoting = false;
                this.state.wasQuoting = true; // continue

                this.state.field.prepend(quote);
              }
            } else {
              if (this.state.field.length !== 0) {
                // In relax mode, treat opening quote preceded by chrs as regular
                if (relax === false) {
                  var _err = this.__error("Invalid opening quote at line ".concat(this.info.lines));

                  if (_err !== undefined) return _err;
                }
              } else {
                this.state.quoting = true;
                continue;
              }
            }
          }

          if (this.state.quoting === false) {
            var recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos);

            if (recordDelimiterLength !== 0) {
              // Do not emit comments which take a full line
              var skipCommentLine = this.state.commenting && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0;

              if (skipCommentLine) {
                this.info.comment_lines++; // Skip full comment line
              } else {
                // Skip if line is empty and skip_empty_lines activated
                if (skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0) {
                  this.info.empty_lines++;
                  pos += recordDelimiterLength - 1;
                  continue;
                } // Activate records emition if above from_line


                if (this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1 : 0) >= from_line) {
                  this.state.enabled = true;

                  this.__resetField();

                  this.__resetRow();

                  pos += recordDelimiterLength - 1;
                  continue;
                } else {
                  var errField = this.__onField();

                  if (errField !== undefined) return errField;

                  var errRecord = this.__onRow();

                  if (errRecord !== undefined) return errRecord;
                }

                if (to !== -1 && this.info.records >= to) {
                  this.state.stop = true;
                  this.push(null);
                  return;
                }
              }

              this.state.commenting = false;
              pos += recordDelimiterLength - 1;
              continue;
            }

            if (this.state.commenting) {
              continue;
            }

            var commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr);

            if (commentCount !== 0) {
              this.state.commenting = true;
              continue;
            }

            var delimiterLength = this.__isDelimiter(chr, buf, pos);

            if (delimiterLength !== 0) {
              var _errField = this.__onField();

              if (_errField !== undefined) return _errField;
              pos += delimiterLength - 1;
              continue;
            }
          }
        }

        if (this.state.commenting === false) {
          if (max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size) {
            var _err2 = this.__error("Max Record Size: record exceed the maximum number of tolerated bytes of ".concat(max_record_size, " on line ").concat(this.info.lines));

            if (_err2 !== undefined) return _err2;
          }
        }

        var lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr); // rtrim in non quoting is handle in __onField

        var rappend = rtrim === false || this.state.wasQuoting === false;

        if (lappend === true && rappend === true) {
          this.state.field.append(chr);
        } else if (rtrim === true && !this.__isCharTrimable(chr)) {
          var _err3 = this.__error("Invalid Closing Quote: found non trimable byte after quote at line ".concat(this.info.lines));

          if (_err3 !== undefined) return _err3;
        }
      }

      if (end === true) {
        if (this.state.quoting === true) {
          var _err4 = this.__error("Invalid Closing Quote: quote is not closed at line ".concat(this.info.lines));

          if (_err4 !== undefined) return _err4;
        } else {
          // Skip last line if it has no characters
          if (this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0) {
            var _errField2 = this.__onField();

            if (_errField2 !== undefined) return _errField2;

            var _errRecord = this.__onRow();

            if (_errRecord !== undefined) return _errRecord;
          } else if (this.state.wasRowDelimiter === true) {
            this.info.empty_lines++;
          } else if (this.state.commenting === true) {
            this.info.comment_lines++;
          }
        }
      } else {
        this.state.previousBuf = buf.slice(pos);
      }

      if (this.state.wasRowDelimiter === true) {
        this.info.lines++;
        this.state.wasRowDelimiter = false;
      }
    } // Helper to test if a character is a space or a line delimiter

  }, {
    key: "__isCharTrimable",
    value: function __isCharTrimable(chr) {
      return chr === space || chr === tab || chr === cr || chr === nl;
    }
  }, {
    key: "__onRow",
    value: function __onRow() {
      var _this$options2 = this.options,
          columns = _this$options2.columns,
          info = _this$options2.info,
          from = _this$options2.from,
          relax_column_count = _this$options2.relax_column_count,
          raw = _this$options2.raw,
          skip_lines_with_empty_values = _this$options2.skip_lines_with_empty_values;
      var _this$state2 = this.state,
          enabled = _this$state2.enabled,
          record = _this$state2.record; // Convert the first line into column names

      if (columns === true) {
        return this.__firstLineToColumns(record);
      }

      var recordLength = record.length;

      if (columns === false && this.info.records === 0) {
        this.state.expectedRecordLength = recordLength;
      } else if (enabled === true) {
        if (recordLength !== this.state.expectedRecordLength) {
          if (relax_column_count === true) {
            this.info.invalid_field_length++;
          } else {
            if (columns === false) {
              var err = this.__error("Invalid Record Length: expect ".concat(this.state.expectedRecordLength, ", got ").concat(recordLength, " on line ").concat(this.info.lines));

              if (err !== undefined) return err;
            } else {
              var _err5 = this.__error("Invalid Record Length: header length is ".concat(columns.length, ", got ").concat(recordLength, " on line ").concat(this.info.lines));

              if (_err5 !== undefined) return _err5;
            }
          }
        }
      }

      if (enabled === false) {
        return this.__resetRow();
      }

      if (skip_lines_with_empty_values === true) {
        if (record.map(function (field) {
          return field.trim();
        }).join('') === '') {
          this.__resetRow();

          return;
        }
      }

      if (this.state.recordHasError === true) {
        this.__resetRow();

        this.state.recordHasError = false;
        return;
      }

      this.info.records++;

      if (from === 1 || this.info.records >= from) {
        if (columns !== false) {
          var obj = {}; // Transform record array to an object

          for (var i in record) {
            if (columns[i] === undefined || columns[i].disabled) continue;
            obj[columns[i].name] = record[i];
          }

          var objname = this.options.objname;

          if (objname === undefined) {
            if (raw === true || info === true) {
              this.push(Object.assign({
                record: obj
              }, raw === true ? {
                raw: this.state.rawBuffer.toString()
              } : {}, info === true ? {
                info: this.state.info
              } : {}));
            } else {
              this.push(obj);
            }
          } else {
            if (raw === true || info === true) {
              this.push(Object.assign({
                record: [obj[objname], obj]
              }, raw === true ? {
                raw: this.state.rawBuffer.toString()
              } : {}, info === true ? {
                info: this.state.info
              } : {}));
            } else {
              this.push([obj[objname], obj]);
            }
          }
        } else {
          if (raw === true || info === true) {
            this.push(Object.assign({
              record: record
            }, raw === true ? {
              raw: this.state.rawBuffer.toString()
            } : {}, info === true ? {
              info: this.state.info
            } : {}));
          } else {
            this.push(record);
          }
        }
      }

      this.__resetRow();
    }
  }, {
    key: "__firstLineToColumns",
    value: function __firstLineToColumns(record) {
      var firstLineToHeaders = this.state.firstLineToHeaders;

      try {
        // record = record.filter(function(field){ return field !== undefined})
        var headers = firstLineToHeaders === undefined ? record : firstLineToHeaders.call(null, record);

        if (!Array.isArray(headers)) {
          return this.__error("Invalid Header Mapping: expect an array, got ".concat(JSON.stringify(headers)));
        }

        var normalizedHeaders = normalizeColumnsArray(headers);
        this.state.expectedRecordLength = normalizedHeaders.length;
        this.options.columns = normalizedHeaders;

        this.__resetRow();

        return;
      } catch (err) {
        return err;
      }
    }
  }, {
    key: "__resetRow",
    value: function __resetRow() {
      var info = this.options.info;

      if (this.options.raw === true) {
        this.state.rawBuffer.reset();
      }

      this.state.record = [];
      this.state.record_length = 0;
    }
  }, {
    key: "__onField",
    value: function __onField() {
      var _this$options3 = this.options,
          cast = _this$options3.cast,
          rtrim = _this$options3.rtrim,
          max_record_size = _this$options3.max_record_size;
      var _this$state3 = this.state,
          enabled = _this$state3.enabled,
          wasQuoting = _this$state3.wasQuoting; // Deal with from_to options

      if (this.options.columns !== true && enabled === false) {
        return this.__resetField();
      }

      var field = this.state.field.toString();

      if (rtrim === true && wasQuoting === false) {
        field = field.trimRight();
      }

      if (cast === true) {
        var _this$__cast = this.__cast(field),
            _this$__cast2 = _slicedToArray(_this$__cast, 2),
            err = _this$__cast2[0],
            f = _this$__cast2[1];

        if (err !== undefined) return err;
        field = f;
      }

      this.state.record.push(field); // Increment record length if record size must not exceed a limit

      if (max_record_size !== 0 && typeof field === 'string') {
        this.state.record_length += field.length;
      }

      this.__resetField();
    }
  }, {
    key: "__resetField",
    value: function __resetField() {
      this.state.field.reset();
      this.state.wasQuoting = false;
    } // Return a tuple with the error and the casted value

  }, {
    key: "__cast",
    value: function __cast(field) {
      var isColumns = Array.isArray(this.options.columns); // Dont loose time calling cast if the field wont be part of the final record

      if (isColumns === true && this.options.columns.length <= this.state.record.length) {
        return [undefined, undefined];
      }

      var context = {
        column: isColumns === true ? this.options.columns[this.state.record.length].name : this.state.record.length,
        empty_lines: this.info.empty_lines,
        header: this.options.columns === true,
        index: this.state.record.length,
        invalid_field_length: this.info.invalid_field_length,
        quoting: this.state.wasQuoting,
        lines: this.info.lines,
        records: this.info.records
      };

      if (this.state.castField !== null) {
        try {
          return [undefined, this.state.castField.call(null, field, context)];
        } catch (err) {
          return [err];
        }
      }

      if (this.__isInt(field) === true) {
        return [undefined, parseInt(field)];
      } else if (this.__isFloat(field)) {
        return [undefined, parseFloat(field)];
      } else if (this.options.cast_date !== false) {
        return [undefined, this.options.cast_date.call(null, field, context)];
      }

      return [undefined, field];
    }
  }, {
    key: "__isInt",
    value: function __isInt(value) {
      return /^(\-|\+)?([1-9]+[0-9]*)$/.test(value);
    }
  }, {
    key: "__isFloat",
    value: function __isFloat(value) {
      return value - parseFloat(value) + 1 >= 0; // Borrowed from jquery
    }
  }, {
    key: "__compareBytes",
    value: function __compareBytes(sourceBuf, targetBuf, pos, firtByte) {
      if (sourceBuf[0] !== firtByte) return 0;
      var sourceLength = sourceBuf.length;

      for (var i = 1; i < sourceLength; i++) {
        if (sourceBuf[i] !== targetBuf[pos + i]) return 0;
      }

      return sourceLength;
    }
  }, {
    key: "__needMoreData",
    value: function __needMoreData(i, bufLen, end) {
      if (end) {
        return false;
      }

      var _this$options4 = this.options,
          comment = _this$options4.comment,
          delimiter = _this$options4.delimiter,
          escape = _this$options4.escape;
      var _this$state4 = this.state,
          quoting = _this$state4.quoting,
          recordDelimiterMaxLength = _this$state4.recordDelimiterMaxLength;
      var numOfCharLeft = bufLen - i - 1;
      var requiredLength = Math.max( // Skip if the remaining buffer smaller than comment
      comment ? comment.length : 0, // Skip if the remaining buffer smaller than row delimiter
      recordDelimiterMaxLength, // Skip if the remaining buffer can be row delimiter following the closing quote
      // 1 is for quote.length
      quoting ? 1 + recordDelimiterMaxLength : 0, // Skip if the remaining buffer can be delimiter
      delimiter.length, // Skip if the remaining buffer can be escape sequence
      // 1 is for escape.length
      1);
      return numOfCharLeft < requiredLength;
    }
  }, {
    key: "__isDelimiter",
    value: function __isDelimiter(chr, buf, pos) {
      var delimiter = this.options.delimiter;
      var delLength = delimiter.length;
      if (delimiter[0] !== chr) return 0;

      for (var i = 1; i < delLength; i++) {
        if (delimiter[i] !== buf[pos + i]) return 0;
      }

      return delimiter.length;
    }
  }, {
    key: "__isRecordDelimiter",
    value: function __isRecordDelimiter(chr, buf, pos) {
      var record_delimiter = this.options.record_delimiter;
      var recordDelimiterLength = record_delimiter.length;

      loop1: for (var i = 0; i < recordDelimiterLength; i++) {
        var rd = record_delimiter[i];
        var rdLength = rd.length;

        if (rd[0] !== chr) {
          continue;
        }

        for (var j = 1; j < rdLength; j++) {
          if (rd[j] !== buf[pos + j]) {
            continue loop1;
          }
        }

        return rd.length;
      }

      return 0;
    }
  }, {
    key: "__autoDiscoverRowDelimiter",
    value: function __autoDiscoverRowDelimiter(buf, pos) {
      var chr = buf[pos];

      if (chr === cr) {
        if (buf[pos + 1] === nl) {
          this.options.record_delimiter.push(Buffer.from('\r\n'));
          this.state.recordDelimiterMaxLength = 2;
          return 2;
        } else {
          this.options.record_delimiter.push(Buffer.from('\r'));
          this.state.recordDelimiterMaxLength = 1;
          return 1;
        }
      } else if (chr === nl) {
        this.options.record_delimiter.push(Buffer.from('\n'));
        this.state.recordDelimiterMaxLength = 1;
        return 1;
      }

      return 0;
    }
  }, {
    key: "__error",
    value: function __error(msg) {
      var skip_lines_with_error = this.options.skip_lines_with_error;
      var err = new Error(msg);

      if (skip_lines_with_error) {
        this.state.recordHasError = true;
        this.emit('skip', err);
        return undefined;
      } else {
        return err;
      }
    }
  }]);

  return Parser;
}(Transform);

var parse = function parse() {
  var data, options, callback;

  for (var i in arguments) {
    var argument = arguments[i];

    var type = _typeof(argument);

    if (data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))) {
      data = argument;
    } else if (options === undefined && isObject(argument)) {
      options = argument;
    } else if (callback === undefined && type === 'function') {
      callback = argument;
    } else {
      throw new Error("Invalid argument: got ".concat(JSON.stringify(argument), " at index ").concat(i));
    }
  }

  var parser = new Parser(options);

  if (callback) {
    var records = options === undefined || options.objname === undefined ? [] : {};
    parser.on('readable', function () {
      var record;

      while (record = this.read()) {
        if (options === undefined || options.objname === undefined) {
          records.push(record);
        } else {
          records[record[0]] = record[1];
        }
      }
    });
    parser.on('error', function (err) {
      callback(err, undefined, parser.info);
    });
    parser.on('end', function () {
      callback(undefined, records, parser.info);
    });
  }

  if (data !== undefined) {
    parser.write(data);
    parser.end();
  }

  return parser;
};

parse.Parser = Parser;
module.exports = parse;

var underscore = function underscore(str) {
  return str.replace(/([A-Z])/g, function (_, match, index) {
    return '_' + match.toLowerCase();
  });
};

var isObject = function isObject(obj) {
  return _typeof(obj) === 'object' && obj !== null && !Array.isArray(obj);
};

var normalizeColumnsArray = function normalizeColumnsArray(columns) {
  // console.log('columns', columns)
  var normalizedColumns = [];

  for (var i = 0; i < columns.length; i++) {
    var column = columns[i];

    if (column === undefined || column === null || column === false) {
      normalizedColumns[i] = {
        disabled: true
      };
    } else if (typeof column === 'string') {
      normalizedColumns[i] = {
        name: column
      };
    } else if (isObject(column)) {
      if (typeof column.name !== 'string') {
        throw new Error("Invalid Option columns: property \"name\" is required at position ".concat(i, " when column is an object literal"));
      }

      normalizedColumns[i] = column;
    } else {
      throw new Error("Invalid Option columns: expect a string or an object, got ".concat(JSON.stringify(column), " at position ").concat(i));
    }
  } // console.log(normalizedColumns)


  return normalizedColumns;
};