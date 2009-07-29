var TableEditors = {};
TableEditors.getEditorClassByName = function(name) {
  if(TableEditors[name]) {
    return TableEditors[name];
  }
  return null;
};
TableEditors.isDialog = function(name) {
  var dialogs = ["User"];
  return jQuery.inArray(name, dialogs) !== -1;
};
/**
 * 
 * @constructor
 */
TableEditors.CommonEditor = function() {
  
};
TableEditors.CommonEditor.prototype.init = function(row, cell, options) {
  this.options = options;
  this.cell = cell;
  this.row = row;
  this.model = row.getModel();
  this._registerEvents();
  this.setEditorValue();
  this.element.trigger("editorOpening");
};
/**
 * Save editor value if editor content is valid
 */
TableEditors.CommonEditor.prototype.save = function() {
  if(this.isValid() && this.element) {
    this.options.set.call(this.model, this.getEditorValue());
    this.close();
  }
};
TableEditors.CommonEditor.prototype.close = function() {
  this.element.trigger("editorClosing");
  this.element.remove();
  if(this.error) {
    this.error.remove();
  }
  this.element = null;
};
TableEditors.CommonEditor.prototype.focus = function() {
  this.element.focus();
};
TableEditors.CommonEditor.prototype.isValid = function() {
  return true;
};
TableEditors.CommonEditor.prototype._registerEvents = function() {
  var me = this;
  this.element.keypress(function(event) {
    me._handleKeyEvent(event);
    return true;
  });
  if(!this.options.editRow) {
    this.element.blur(function(event) {
      me._handleBlurEvent(event);
    });
  }
};
TableEditors.CommonEditor.prototype._handleBlurEvent = function(event) {
  this.save();
};
TableEditors.CommonEditor.prototype.saveRow = function() {
  this.cell.getElement().trigger("storeRequested", new DynamicsEvents.StoreRequested(this));
};
TableEditors.CommonEditor.prototype._handleKeyEvent = function(event) {
  if(event.keyCode === 27 && !this.options.editRow) {
    this.close();
  } else if(event.keyCode === 13 && !this.options.editRow) {
    this.save();
  } else if(event.keyCode === 13 && this.options.editRow) {
    this.saveRow();
  }
};
TableEditors.CommonEditor.prototype.setEditorValue = function(value) {
  if(!value) {
    value = this.options.get.call(this.model);
  }
  this.element.val(value);
};

TableEditors.CommonEditor.prototype.getEditorValue = function() {
  return this.element.val();
};

/**
 * 
 * @constructor
 * @base TableEditors.CommonEditor
 */
TableEditors.Text = function(row, cell, options) {
  this.element = $('<input type="text"/>').width("98%").appendTo(
      cell.getElement());
  this.init(row, cell, options);
};
TableEditors.Text.prototype = new TableEditors.CommonEditor();

/**
 * 
 * @constructor
 * @base TableEditors.CommonEditor
 */
TableEditors.SingleSelection = function(row, cell, options) {
  this.element = $('<select />').width("98%").appendTo(cell.getElement());
  this.init(row, cell, options);
  this._renderOptions();
  if(!this.options.editRow) {
    var me = this;
    this.element.change(function(event) {
      me._handleBlurEvent(event);
    });
  }
};

TableEditors.SingleSelection.prototype = new TableEditors.CommonEditor();

TableEditors.SingleSelection.prototype._renderOptions = function() {
  var me = this;
  var selected = this.options.get.call(this.model);
  var items = this.options.items;
  jQuery.each(items, function(key,val) {
    var el = $('<option />').val(key).text(val).appendTo(me.element);
    if(key === selected) {
      el.attr("selected", "selected");
    }
  });
};
/**
 * @constructor
 * @base TableEditors.CommonEditor
 */
TableEditors.Date = function(row, cell, options) {
  this.element = $('<input type="text"/>').width("98%").appendTo(
      cell.getElement());
  this.init(row, cell, options);
};
TableEditors.Date.prototype = new TableEditors.CommonEditor();

/**
 * @constructor
 * @base TableEditors.CommonEditor
 */
TableEditors.Estimate = function(row, cell, options) {
  this.element = $('<input type="text"/>').width("98%").appendTo(
      cell.getElement());
  this.init(row, cell, options);
};
TableEditors.Estimate.prototype = new TableEditors.CommonEditor();

/**
 * @constructor
 * @base TableEditors.CommonEditor
 */
TableEditors.Date = function(row, cell, options) {
  this.element = $('<input type="text"/>').width("98%").appendTo(
      cell.getElement());
  this.init(row, cell, options);
};
TableEditors.Date.prototype = new TableEditors.CommonEditor();

/**
 * @constructor
 * @base TableEditors.CommonEditor
 */

TableEditors.Wysiwyg = function(row, cell, options) {
  this.actualElement = $('<textarea></textarea>').appendTo(cell.getElement());
  this.actualElement.width("98%").height("240px");
  setUpWysiwyg(this.actualElement);
  this.element = $(this.actualElement.wysiwyg("getDocument"));
  this.init(row, cell, options);
};
TableEditors.Wysiwyg.prototype = new TableEditors.CommonEditor();

TableEditors.Wysiwyg.prototype.setEditorValue = function(value) {
  if(!value) {
    value = this.options.get.call(this.model);
  }
  this.actualElement.wysiwyg("setValue",value);
};

TableEditors.Wysiwyg.prototype.getEditorValue = function() {
  return this.actualElement.val();
};

TableEditors.Wysiwyg.prototype.close = function() {
  this.element = null;
  this.actualElement.trigger("editorClosing");
  this.actualElement.wysiwyg("remove");
  this.actualElement.remove();
};
TableEditors.Wysiwyg.prototype._handleKeyEvent = function(event) {
  if(event.keyCode === 27 && !this.options.editRow) {
    this.close();
  }
};

/**
 * @constructor
 * @base TableEditors.CommonEditor
 */
TableEditors.User = function(row, cell, options) {
  this.element = cell.getElement();
  this.init(row, cell, options);
  var me = this;
  this.autocomplete = $(window).autocompleteDialog({
    dataType: 'usersAndTeams',
    callback: function(ids) { me.save(ids); },
    cancel: function() { me.close(); },
    title: 'Select users'
  });
  this.value = [];
};
TableEditors.User.prototype = new TableEditors.CommonEditor();

TableEditors.User.prototype.save = function(ids) {
  this.options.set.call(this.model, ids);
  this.cell.getElement().trigger("editorClosing");
};
TableEditors.User.prototype._registerEvents = function() {
};
TableEditors.User.prototype.setEditorValue = function() { 
};
TableEditors.User.prototype.getEditorValue = function() { 
  return this.value;
};
TableEditors.User.prototype.close = function() {
  this.cell.getElement().trigger("editorClosing");
};


