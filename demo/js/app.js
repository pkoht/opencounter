var OC = { 
  
  prefix: 'OC-',
  
  forms: {},
  util: {},
  state: {},
  calculator: {},
  
  init: function() {
    console.log("Initializing");
    console.log(localStorage);
    OC.routing.init();
    $('.submit').bind({
      click: OC.forms.sumbit
    });
        
    // Check to see if we have stored data about any forms
    OC.forms.recallFields();
  }
};

/** 
 * Fill in any fields with saved data
 */
OC.forms.recallFields = function() {
  $('input').each(function(index){
    var name = $(this).attr('name');

    var key = OC.forms.key(name);
    var value = OC.util.getData(key);
    var type = $(this).attr('type');
  

    //if(value) { console.log(value); }
    
    if (type === 'radio') {
      if($(this).attr('value') == value) {
        $(this).prop("checked", true);
      }
    }else if(type === 'checkbox') {
      $(this).prop("checked", true);
    }else {
      $(this).val(value);
    }
    
  });
};

/** 
 * Generate a key for localStorage based on the name of a form field
 */ 
OC.forms.key = function(name) {
  return OC.prefix + 'field-' + name;
};

/**
 * Handle form submissions our way
 */
OC.forms.sumbit = function(event) {
  event.preventDefault();
  var form = $(this).closest('form');
  
  // Save the data from the form in localStorage
  var data = $(form).serializeObject();
  console.log(data);
  $.each(data, function(key, value){
    var localStorageKey = OC.forms.key(key);
    console.log("Key: " + key + " value: " + value);
    OC.util.storeData(localStorageKey, value);
  });
};

/** .........................................................................
 *  Utilities
 */

OC.state.set = function(key, val){
    var data = OC.util.getData("OC-state");
    if(data === null){
        data = {};
    }
    data[key] = val;
    OC.util.storeData("OC-state", data);
}
OC.state.get = function(key){

    var data = OC.util.getData("OC-state");
    if(data === null){
        data = {};
    }
    if(key === undefined){
        return data;
    }else{
        return data[key];
    }
}
 
OC.util.getData = function(key) {
    return JSON.parse(localStorage.getItem(key));
};

OC.util.storeData = function(key, data) {
  localStorage.setItem(key, JSON.stringify(data));

};


/** 
 * Utility to serialize complex things. Like forms.
 * http://stackoverflow.com/a/1186309/117014  
 * usage: $('form').serializeObject();
 */
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};