
/**
 * Model class for products.
 * @constructor
 * @base BacklogModel
 * @see BacklogModel#initializeBacklogModel
 */
var ProductModel = function ProductModel() {
  this.initializeBacklogModel();
  this.persistedClassName = "fi.hut.soberit.agilefant.model.Product";
  this.relations = {
    project: [],
    iteration: [],
    story: []
  };
  this.copiedFields = {
    "name":   "name",
    "description": "description"
  };
  this.classNameToRelation = {
      "fi.hut.soberit.agilefant.model.Project":       "project",
      "fi.hut.soberit.agilefant.model.Iteration":     "iteration",
      "fi.hut.soberit.agilefant.model.Story":         "story"
  };
};

ProductModel.prototype = new BacklogModel();


/**
 * Internal function to set data
 * @see CommonModel#setData
 */
ProductModel.prototype._setData = function(newData) {
  var data = {};
  
  // Set the id
  this.id = newData.id;
  
  // Copy fields
  this._copyFields(newData);
  
  // Set stories
  if (newData.stories) {
    this._updateRelations(ModelFactory.types.story, newData.stories);
  }
  
  if (newData.projects) {
    this._updateRelations("project", newData.projects);
  }
//  
//  if (newData.iterations) {
//    this._updateRelations("iteration", newData.iterations);
//  }
  
};

ProductModel.prototype.reloadProjects = function(filters, callback) {
  var me = this;
  var data = {productId: this.id};
  jQuery.ajax({
    url: "ajax/retrieveProductProjects.action",
    data: data,
    type: "post",
    dataType: "json",
    success: function(data, type) {
      me._updateRelations("project", data);
      if(callback) {
        callback();
      }
    }
  });
};

ProductModel.prototype._saveData = function(id, changedData) {
  var me = this;
  
  var url = "ajax/storeProduct.action";
  var data = this.serializeFields("product", changedData);
  data.productId = id;
  if (!id) {
    url = "ajax/storeNewProduct.action";
  }
 
  jQuery.ajax({
    type: "POST",
    url: url,
    async: true,
    cache: false,
    data: data,
    dataType: "json",
    success: function(data, status) {
      MessageDisplay.Ok("Product saved successfully");
      var object = ModelFactory.updateObject(data);
      if(!id) {
        object.callListeners(new DynamicsEvents.AddEvent(object));
      }
    },
    error: function(xhr, status, error) {
      MessageDisplay.Error("Error saving product", xhr);
      me.rollback();
    }
  });
};

ProductModel.prototype.reload = function() {
  var me = this;
  jQuery.getJSON(
    "ajax/retrieveProduct.action",
    {productId: me.getId()},
    function(data,status) {
      me.setData(data);
      me.callListeners(new DynamicsEvents.EditEvent(me));
    }
  );
};

ProductModel.prototype.addIteration = function(iteration) {
  this.addRelation(iteration);
  this.callListeners(new DynamicsEvents.RelationUpdatedEvent(this,"iteration"));
};

ProductModel.prototype.addProject = function(project) {
  this.addRelation(project);
  this.callListeners(new DynamicsEvents.RelationUpdatedEvent(this,"project"));
};

/* GETTERS */

ProductModel.prototype.getDescription = function() {
  return this.currentData.description;
};
ProductModel.prototype.setDescription = function(description) {
  this.currentData.description = description;
};

ProductModel.prototype.getIterations = function() {
  return this.relations.iteration;
};

ProductModel.prototype.getName = function() {
  return this.currentData.name;
};
ProductModel.prototype.setName = function(name) {
  this.currentData.name = name;
};

ProductModel.prototype.getProjects = function() {
  return this.relations.project;
};

ProductModel.prototype.getStories = function() {
  return this.relations.story;
};