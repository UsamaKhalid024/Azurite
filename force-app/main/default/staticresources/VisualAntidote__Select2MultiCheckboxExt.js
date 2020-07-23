	Select2.class.multi.prototype.findHighlightableChoices = function () {
    return this.results.find(".select2-result-selectable:not(.select2-disabled)");
};

var Select2TriggerSelect = Select2.class.multi.prototype.triggerSelect;

Select2.class.multi.prototype.triggerSelect = function (data) {
    if (this.val().indexOf(this.id(data)) !== -1) {

        var val = this.id(data);
        var evt = $.Event("select2-removing");
        evt.val = val;
        evt.choice = data;
        this.opts.element.trigger(evt);

        if (evt.isDefaultPrevented()) {
            return false;
        }

        var existingVals = this.val();
        var self = this;
        if (!existingVals || existingVals.length == 0) return true;
        for (a = 0; a < existingVals.length; a++) {
            if (existingVals[a] === val) {
                //existingVals[a] = ''; replced with splice to fix empty value selectrd issue in tag checkbox list
                existingVals.splice(a,1);
                this.val(existingVals);
                this.results.find('.select2-result').each(function () {
                    var $this = $(this);
                    if (self.id($this.data('select2-data')) === val) {
                        $this.removeClass('select2-selected');
                    }
                });
            }
        }

        this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
        this.triggerChange({ removed: data });

    } else {
        return Select2TriggerSelect.apply(this, arguments);
    }
}
