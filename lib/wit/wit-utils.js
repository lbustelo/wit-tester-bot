var exp = {

  /**
   * Return all the entities, sorted by confidence, with a given name and minimum confidence level
   * */
  getAllEntities: function(entity_name, entities, min_confidence) {
    min_confidence = min_confidence || 0;

    let entityObj = entities[entity_name];

    if (!entityObj || (entityObj.length === 1 && entityObj[0].confidence <= min_confidence)) {
      return [];
    } else if (entityObj.length === 1) {
      return [entityObj[0]];
    }

    return entityObj.filter(function(eh) {
      return (eh.confidence && eh.confidence > min_confidence);
    }).sort(function(ent1, ent2) {
      if (ent1.confidence < ent2.confidence) {
        return -1;
      } else if (ent1.confidence > ent2.confidence) {
        return 1;
      } else {
        return 0;
      }
    }).map(function(i) {return i.value;});
  },

  /**
   * Return the entity with the highest confidence
   * */
  getBestEntity: function(entity_name, entities, min_confidence) {
    min_confidence = min_confidence || 0;

    var entityObj = entities[entity_name] && entities[entity_name][0];

    console.log("entities", entities[entity_name]);

    if (entityObj) {
      let bestConfidenceIndex = 0;
      let tempEntitiesArray = entities[entity_name];

      for (let i = 0; i < tempEntitiesArray.length; i++) {
        if (tempEntitiesArray[i].confidence > tempEntitiesArray[bestConfidenceIndex].confidence) {
          bestConfidenceIndex = i;
        }
      }

      return tempEntitiesArray[bestConfidenceIndex].confidence > min_confidence ? tempEntitiesArray[bestConfidenceIndex].value : null;
    } else {
      return null;
    }
  }
};

exp.getIntent = exp.getBestEntity.bind(null, 'intent');

module.exports = exp;
