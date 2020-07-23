/*selecttoradio library - custom library created by fast forms
 - Used to generate flexible controls for SELECT element , which rendered as radio button list, checkbox list
 */
(function ($) {
    "use strict";
    var SelectToRadio;
    var root;

    root = (typeof window !== "undefined" && window !== null) ? window : global;

    root.SelectToRadio = SelectToRadio = function () {

        function SelectToRadio() {
            this.show = function () {
                var _isObjectArrayAndHasValues = function (value) {
                    // value: array of 'option' element or array of string
                    if (value !== undefined && value != null && (typeof value === 'object') && value.length > 0) {
                        return true;
                    }
                    return false;
                };
                var _escapePicklistValueForSelector = function (picklistItemValue, needAdvancedEscape) {
                    // Use this method, when we are finding an option item based on value attribute in select element
                    //// for example : $('#dvFastForms #' + fieldId.replace(/\./g, "\\.") + " option[value='" + _escapePicklistValueForSelector(e) + "']")
                    // If you are populating option's value then escape " with &quot;
                    //// for example: $(elem1).append('<option value="' + e.replace(/\"/g, '&quot;') + '">' + e + '</option>');
                    if (picklistItemValue != undefined && picklistItemValue != '') {
                        var picklistValue = '';
                        if (picklistItemValue instanceof Array && picklistItemValue.length > 0) {
                            picklistValue = picklistItemValue[0];
                        } else {
                            picklistValue = picklistItemValue + '';
                        }
                        var escapedVal = picklistValue.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/\'/g, '\\\'');
                        if (needAdvancedEscape !== undefined && needAdvancedEscape) {
                            escapedVal = escapedVal.replace(/\:/g, '\\:');
                        }
                        return escapedVal;
                    }
                    return '';
                };
                var $elem = this.$elem,
                    $widget,
                    $all,
                    $allLI,
                    $allRadios,
                    isRadio,
                    mainElementId,
                    alignmentClass,
                    localControlType,
                    localClasswrapper,
                    userOptions = this.options,

                    initialOption = [],
                    initialOptionText = [];

                // run only once
                if (!$elem.data("SelectToRadio")) {

                    if (userOptions.initialSelectValue) {
                        initialOption = $("option[value=\"" + _escapePicklistValueForSelector(userOptions.initialSelectValue) + "\"]", $elem);
                    } else {
                        var intialvalues = [];
                        intialvalues = $('option:selected', $elem);
                        if (_isObjectArrayAndHasValues(intialvalues)) {
                            $.each(intialvalues, function (index, valueitem) {
                                $elem.find("option[value=\"" + _escapePicklistValueForSelector($(valueitem).val()) + "\"]").prop("selected", true);
                                initialOption.push($(valueitem).attr("value"));
                                initialOptionText.push($(valueitem).text());
                            });

                        } else if (intialvalues.length == 1) {
                            var valueitem = intialvalues;
                            initialOption.push($(valueitem).attr("value"));
                            initialOptionText.push($(valueitem).text());
                        }
                    }
                    if (userOptions.alignment === "horizontal") {
                        alignmentClass = "ff-ext-horizontal";
                    } else {
                        alignmentClass = "ff-ext-vertical";
                    }
                    if (userOptions.controlType === "ff-ext-checkbox") {
                        isRadio = false;
                        localControlType = "ff-ext-checkbox";
                        localClasswrapper = "checkbox";
                    } else {
                        isRadio = true;
                        localControlType = "ff-ext-radio";
                        localClasswrapper = "radiobtn";
                    }

                    $elem.data("SelectToRadio", {

                        userOptions: userOptions,

                        // initial radio based on the OPTION value
                        currentItemValue: initialOption,
                        currentItemText: initialOptionText,

                        // radio will be restored by calling clear method
                        originalItemValue: initialOption,
                        originalItemText: initialOptionText

                    });
                    mainElementId = $elem.attr("id");
                    $widget = $("<div />", {
                        "class": "ff-select-to-" + localClasswrapper + "-list custom-flex-control-container"
                    }).insertBefore($elem);
                    var $rbUl = $("<ul />", {
                        "id": "ul" + mainElementId,
                        "class": "ff-select-to-" + localClasswrapper + "-ul " + alignmentClass
                    });
                    // create li elements that will replace OPTIONs
                    $elem.find("option").each(function (index) {
                        var val, text, rbId, html, $li, $label, $inputControl;

                        val = $(this).val();
                        // create radios - but only if val is defined
                        if (val) {

                            text = $(this).text();
                            html = $(this).data("html");
                            rbId = mainElementId + "__" + index;
                            if (html) {
                                text = html;
                            }
                            $li = $("<li/>", {
                                "class": "ff-radio-li"
                            });
                            if (!isRadio) {
                                $li = $("<li/>", {
                                    "class": "ff-checkbox-li"
                                });
                            }
                            $label = $("<label/>", {
                                "for": rbId,
                                text: text
                            });
                            if (isRadio) {
                                $inputControl = $("<span />", {
                                    "class": "ff-ext-radio-css",
                                    name: mainElementId,
                                    id: rbId,
                                    "data-value": val
                                });
                            } else {
                                $inputControl = $("<span />", {
                                    "class": "ff-ext-checkbox-css",
                                    name: mainElementId,
                                    id: rbId,
                                    "data-value": val
                                });
                            }

                            $li.append($inputControl);
                            $li.append($label);
                            $rbUl.append($li);
                        }

                    });
                    $widget.append($rbUl);


                    // first OPTION empty - allow deselecting of radiobtns
                    $elem.data("SelectToRadio").deselectable = (!$elem.find("option:first").val()) ? true : false;

                    if (userOptions.readonly) {
                        $widget.addClass("ff-ext-readonly");
                    }

                    // radio change event
                    if (isRadio) {
                        $widget.on("radiochange",
                            function (event, value, text) {
                                // value or text undefined?
                                value = value ? value : $elem.data("SelectToRadio").currentItemValue;
                                text = text ? text : $elem.data("SelectToRadio").currentItemText;
                                // change selected OPTION in the select box (now hidden)
                                $elem.find("option[value=\"" + _escapePicklistValueForSelector(value) + "\"]").prop("selected", true);
                                $elem.change();
                            }).trigger("radiochange");

                        // radio style event
                        $widget.on("radiostyle",
                            function (event) {
                                $widget.find("li>span").removeClass("ff-ext-selected");
                                $widget.find("li>span").attr("data-" + localControlType + "-checked", false);
                                var selectedValue = $elem.data("SelectToRadio").currentItemValue;
                                var elemToSelect = $(this).find("li  span[data-value=\"" + _escapePicklistValueForSelector(selectedValue, true) + "\"]");
                                if (elemToSelect !== undefined && elemToSelect.length > 0) {
                                    elemToSelect.attr("data-" + localControlType + "-checked", true);
                                    elemToSelect.addClass("ff-ext-selected");
                                }
                            }).trigger("radiostyle");
                    } else {
                        //checkbox change event
                        $widget.on("checkboxchange",
                            function (event, value, text) {
                                value = value ? value : $elem.data("SelectToRadio").currentItemValue;
                                /*added to fix val() issue */
                                $elem.find("option").prop("selected", false);
                                /*added to fix val() issue */
                                if (_isObjectArrayAndHasValues(value)) {
                                    $elem.find("option").prop("selected", false);
                                    $.each(value, function (index, valueitem) {
                                        $elem.find("option[value=\"" + _escapePicklistValueForSelector(valueitem) + "\"]").prop("selected", true);
                                    });
                                } else if (value !== undefined) {
                                    // change selected OPTION in the select box (now hidden)
                                    $elem.find("option[value=\"" + _escapePicklistValueForSelector(value) + "\"]").prop("selected", true);
                                }
                                $elem.change();
                            }).trigger("checkboxchange");

                        //checkbox style event
                        $widget.on("checkboxstyle",
                            function (event) {
                                $widget.find("li").removeClass("ff-ext-selected");

                                var value = $elem.data("SelectToRadio").currentItemValue;

                                if (_isObjectArrayAndHasValues(value)) {
                                    $.each(value, function (index, valueitem) {
                                        var elemToSelect = $widget.find("li  span[data-value=\"" + _escapePicklistValueForSelector(valueitem, true) + "\"]");
                                        if (elemToSelect !== undefined && elemToSelect.length > 0) {
                                            elemToSelect.attr("data-" + localControlType + "-checked", true);
                                            elemToSelect.addClass("ff-ext-selected");
                                        }
                                    });
                                } else if (value !== undefined) {
                                    var elemToSelect = $widget.find("li  span[data-value=\"" + _escapePicklistValueForSelector(value, true) + "\"]");
                                    if (elemToSelect !== undefined && elemToSelect.length > 0) {
                                        elemToSelect.attr("data-" + localControlType + "-checked", true);
                                        elemToSelect.addClass("ff-ext-selected");
                                    }
                                }
                            }).trigger("checkboxstyle");
                    }
                    $allLI = $widget.find("li");

                    // fast clicks
                    // do not react to click events if radio is read-only
                    if (userOptions.readonly) {
                        $allLI.on("click", function (event) {
                            event.preventDefault();
                        });
                    }

                    // add interactions
                    if (!userOptions.readonly) {

                        $allLI.on("click", function (event) {
                            if (isRadio) {
                                callBackOnClickEvent(this, event);
                            } else {
                                checkBoxCallBackOnClickEvent(this, event);

                            }
                            return false;
                        });
                    }

                    $allRadios = $widget.find("li span");

                    /* Handle li clicks- for radio button list */
                    var callBackOnClickEvent = function (thisElement, eventElement) {
                        var $li = $(thisElement);
                        eventElement.preventDefault();
                        var value = $li.find("span").attr("data-value");
                        var text = $li.find("label").text();
                        if ($li.find("span").hasClass("ff-ext-selected")) {
                            $li.find("span").removeClass("ff-ext-selected");
                            $li.find("span").attr("data-" + localControlType + "-checked", true);
                        } else {
                            $widget.find("span").removeClass("ff-ext-selected");
                            $widget.find("span").attr("data-" + localControlType + "-checked", false);
                            $li.find("span").addClass("ff-ext-selected");
                            $li.find("span").attr("data-" + localControlType + "-checked", true);
                        }
                        // remember selected radio
                        $elem.data("SelectToRadio").currentItemValue = value;
                        $elem.data("SelectToRadio").currentItemText = text;
                        // onSelect callback
                        $widget.trigger("radiochange").trigger("radiostyle");
                        userOptions.onSelect.call(
                            thisElement,
                            $elem.data("SelectToRadio").currentItemValue,
                            $elem.data("SelectToRadio").currentItemText
                        );

                    };
                    /* Handle li clicks- for checkbox button list */
                    var checkBoxCallBackOnClickEvent = function (thisElement, eventElement) {

                        var valueArray = [];
                        var $li = $(thisElement);
                        eventElement.preventDefault();
                        if ($li.find("span").hasClass("ff-ext-selected")) {
                            $li.find("span").removeClass("ff-ext-selected");
                            $li.find("span").attr("data-" + localControlType + "-checked", false);
                        } else {
                            $li.find("span").addClass("ff-ext-selected");
                            $li.find("span").attr("data-" + localControlType + "-checked", true);
                        }

                        $(thisElement).parent().find("li span").each(function (i, spanelement) {
                            if ($(spanelement).attr("data-" + localControlType + "-checked") == "true") {
                                valueArray.push($(spanelement).attr("data-value"));
                            }
                        });
                        $elem.data("SelectToRadio").currentItemValue = valueArray;
                        // onSelect callback
                        $widget.trigger("checkboxchange").trigger("checkboxstyle");
                        userOptions.onSelect.call(
                            thisElement,
                            $elem.data("SelectToRadio").currentItemValue,
                            ""
                        );

                    };


                    // hide the select box
                    if (!$elem.hasClass("custom-select-offscreen")) {
                        $elem.addClass("custom-select-offscreen");
                    }
                }
            };
            this.destroy = function () {

                var value = this.$elem.data("SelectToRadio").currentItemValue;
                var text = this.$elem.data("SelectToRadio").currentItemText;
                var options = this.$elem.data("SelectToRadio").userOptions;

                this.$elem.removeData("SelectToRadio");

                this.$widget.off().remove();

                // show the select box
                this.$elem.removeClass("custom-select-offscreen");

                // onDestroy callback
                options.onDestroy.call(
                    this,
                    value,
                    text
                );

            };
        }

        SelectToRadio.prototype.init = function (options, elem) {
            var self;
            self = this;
            self.elem = elem;
            self.$elem = $(elem);

            return self.options = $.extend({}, $.fn.SelectToRadio.defaults, options);
        };

        return SelectToRadio;

    }();

    $.fn.SelectToRadio = function (method, options) {
        return this.each(function () {
            var plugin = new SelectToRadio();

            // plugin works with select fields
            if (!$(this).is("select")) {
                $.error("Sorry, this plugin only works with select fields.");
            }

            // method supplied
            if (plugin.hasOwnProperty(method)) {
                plugin.init(options, this);
                if (method === "show") {
                    return plugin.show(options);
                } else {
                    if (!$(this).hasClass("custom-select-offscreen")) {
                        $(this).addClass("custom-select-offscreen");
                    }
                    if (this.options.controlType === "ff-ext-checkbox") {
                        plugin.$widget = $(this).prev(".ff-select-to-checkbox-list");
                    } else {
                        plugin.$widget = $(this).prev(".ff-select-to-radiobtn-list");
                    }
                    // widget exists?
                    if (plugin.$widget && plugin.$elem.data("SelectToRadio")) {
                        return plugin[method](options);
                    }
                }

                // no method supplied or only options supplied
            } else if (typeof method === "object" || !method) {
                options = method;
                plugin.init(options, this);
                return plugin.show();

            } else {
                $.error("Method " + method + " does not exist on jQuery.SelectToRadio");
            }

        });
    };
    return $.fn.SelectToRadio.defaults = {
        initialSelectValue: null, // initial radio value
        controlType: "ff-ext-radio",
        alignment: "vertical", // layout vertical or horizontal
        readonly: false, // make the radio ready-only?
        onSelect: function () {}, // callback fired when a radio is selected
        onDestroy: function () {} // callback fired when a widget is destroyed
    };
})(jQuery);