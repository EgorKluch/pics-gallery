/**
 * @author: EgorKluch (EgorKluch@gmail.com)
 * @date: 20.01.14
 */

'use strict';


var Picture = function (data) {
  this.id = data.id;
  this.userId = data.id;
  this.addedBy = data.addedBy;
  this.filename = data.filename;
  this.title = data.title;
  this.description = data.description;
};

Picture.prototype.getMysqlData = function () {
  return {
    id: this.id,
    user_id: this.userId,
    added_by: this.addedBy,
    filename: this.filename,
    title: this.title,
    description: this.description
  };
};
