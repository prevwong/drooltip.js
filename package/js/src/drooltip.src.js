
/**
Drooltip.js
Developed by: Prev Wong	(imprev.co)
Documentation: https://prevwong.github.io/drooltip.js/
Github: https://github.com/prevwong/drooltip.js/
License: MIT (https://raw.githubusercontent.com/prevwong/drooltip.js/master/LICENSE)
**/


(function() {
	window["Drooltip"] = function() {
		this.tooltips = { };

	    var defaults = {
	    	"element" : ".drooltip",
	    	"trigger" : "hover",
	    	"position" : "top",
	      	"background" : "#2175ff",
	      	"color" : "#fff",
	    	"animation": "bounce",
	      	"content" : null,
	      	"callback" : null
	    };

	    if (arguments[0] && typeof arguments[0] === "object") {
	      this.options = extendDefaults(defaults, arguments[0]);
	    }
	    this.build();
	};

	function formatPrivateContent(content){ 
		if ( content.match(/(?![^{]+})(?:\.|#)([_a-zA-Z]+[_a-zA-Z0-9-]*)/) !== null && content.replace(content.match(/(?![^{]+})(?:\.|#)([_a-zA-Z]+[_a-zA-Z0-9-]*)/)[0], "").replace(/ /g,"") === "" ) {
			// use element
			return {
				"type" : "element",
				"element" : content.match(/(?![^{]+})(?:\.|#)([_a-zA-Z]+[_a-zA-Z0-9-]*)/)[0]
			};
		} else if ( content.match(/\:(.*)\:/) !== null && content.replace(content.match(/\:(.*)\:/)[0], "") === "" ) {
			
			var pattern = content.match(/\:(.*)\:/);
			var dataString = pattern[1].match(/\[(.*)\]/)
			var type = pattern[1].replace(dataString[0], "").replace(/ /g, "");
			var url = dataString[1].split(',')[0]
			var json = null;
			if ( dataString[1].split(',')[1] !== null ) {
				json = dataString[1].split(',')[1].replace(/ /g, '')
			}

			return {
				url,
				json,
				type
			};


		} else {
			return content;
		}
	}

	function createTooltip(id, sourceElem, options) {
		var content = options["content"];
		if ( typeof(options["content"]) === "object" ) {
			if ( options["content"]["type"] === "jsonp" || options["content"]["type"] === "ajax" ) {
				requests[id] = { info: { source: sourceElem, position: options["position"] }, data: options["content"], loaded:false };
				content = "<div class = 'drooltipLoaderWrapper'><span style='background:"+ options["color"] +"' class = 'drooltipLoader'></span></div>";
			} else if ( options["content"]["type"] === "element" ) {
			  var elem = document.querySelector(options["content"]["element"]);
			  if ( elem !== null ) {
			  	elem.style.display = "none";
			    content = elem.outerHTML;
			    elem.parentNode.removeChild(elem);
			  } else { content = "HTML element not found"; }
			}
		} 
		var tooltip = document.createElement("div");
		tooltip.setAttribute("data-identifiers", id);
		tooltip.setAttribute("class", "drooltip");
		tooltip.setAttribute("style", "color: " + options["background"]); // for arrow
		document.body.appendChild(tooltip);

		var html = "";
		html += "<div style='background:"+ options["background"] +"' class = 'bg'></div>";
		html += "<div style='color:"+ options["color"] +"' class = 'content'>";
		html += content;
		html += "</div>";
		tooltip.innerHTML = html;

		if ( options["content"]["element"] !== undefined ) {
			if (tooltip.querySelector(options["content"]["element"]) !== null ) {  
				tooltip.querySelector(options["content"]["element"]).style.display = "";
			}
		}

		return document.querySelector("[data-identifiers='" + id + "']");
	}

	function jsonp(url, callback) {
		var callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
		window[callbackName] = function(data) {
		  delete window[callbackName];
		  document.body.removeChild(script);
		  callback(data);
		};

		var script = document.createElement("script");
		script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "callback=" + callbackName;
		document.body.appendChild(script);
	}

	function requestsHandler(id, element){
		var type = requests[id]["data"]["type"],
		    json = requests[id]["data"]["json"],
		    url = requests[id]["data"]["url"],
		    source = requests[id]["info"]["source"],
		    loaded = requests[id]["loaded"],
		    position = requests[id]["info"]["position"];

		if ( loaded !== true ) {
			if ( type === "ajax" ) { 
			  var xhr = new XMLHttpRequest();
			  xhr.open("GET", url);
			  if ( json !== undefined) { //json format
			    xhr.setRequestHeader("Content-Type", "application/json");
			  }
			  xhr.onload = function() {
			      if (xhr.status === 200) {
			          var content;
			          if ( json !== undefined ) { //json format
			          	if (json.slice(-2) === "()" ){
			          		content = window[json.replace("()", "")](JSON.parse(xhr.responseText))
			          	} else {
			          		content = JSON.parse(xhr.responseText)[json]
			          	}
			          } else {
			            content = xhr.responseText;
			          }

			          updateDynamicContent(id, element, source, position, content)
			          
			      }
			  };
			  xhr.send();

			} else if ( type === "jsonp" ){
			  jsonp(url, function(jsObject){
			  	var content;
			   if (json.slice(-2) === "()" ){
	          		content = window[json.replace("()", "")](jsObject)
	          	} else {
	          		content = jsObject[json];
	          	}
	          	updateDynamicContent(id, element, source, position, content)
			  });

			}
		}
	}

	function updateDynamicContent(id, element, source, position, content ){
	  element.querySelector(".content .drooltipLoader").classList.add("stop");
      setTimeout(function(){
      	  element.querySelector(".content").classList.add("showDynamic")
      	  setTimeout(function(){
      	  	element.querySelector(".content").innerHTML = content;
      	  	element.querySelector(".content").classList.remove("showDynamic")
      	  	getPosition(element, source, position, {"x":0, "y": 0});
      	  }, 200)
          requests[id]["loaded"] = true;
  	   }, 400)
	}

	function extendDefaults(source, properties) {
		var property;
		for (property in properties) {
		  if (properties.hasOwnProperty(property)) {
		    source[property] = properties[property];
		  }
		}
		return source;
	}

	/** Replicating jQuery Offset Method @thanks ubugnu **/
	function isWindow( obj ) {
	    return obj !== null && obj === obj.window;
	}
	function getWindow( elem ) {
	    return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}
	function offset( elem ) {
	    var docElem, win,
	        box = { top: 0, left: 0 },
	        doc = elem && elem.ownerDocument;

	    docElem = doc.documentElement;

	    if ( typeof elem.getBoundingClientRect !== typeof undefined ) {
	        box = elem.getBoundingClientRect();
	    }
	    win = getWindow( doc );
	    return {
	        top: box.top + win.pageYOffset - docElem.clientTop,
	        left: box.left + win.pageXOffset - docElem.clientLeft
	    };
	}

	function getElemDimensions(element) {
		var top  =  window.pageYOffset;
		var info = {
		  "left" : offset(element).left,
		  "top" : offset(element).top
		};

		element.classList.add("fake");
		info["width"] = element.offsetWidth;
		info["height"] = element.offsetHeight;
		element.classList.remove("fake");
		return info;
	}

	function getPosition(tooltip, source, required) {
		var _pos = ["top", "bottom", "right", "left"],
		    sourceDimensions = getElemDimensions(source),
		    tooltipDimensions = getElemDimensions(tooltip),
		    arrowSize = 6;

		var imaginaryPositions = {
		  "if_top_y" : sourceDimensions["top"] - tooltipDimensions["height"] - arrowSize,
		  "if_vertical_x" : sourceDimensions["left"] + sourceDimensions["width"] / 2 - tooltipDimensions["width"] / 2,
		  "if_bottom_y" : sourceDimensions["top"] + sourceDimensions["height"],
		  "if_horizontal_y" : sourceDimensions["top"] + (sourceDimensions["height"] / 2 - tooltipDimensions["height"] / 2) - arrowSize,
		  "if_left_x" : sourceDimensions["left"] - tooltipDimensions["width"],
		  "if_right_x": sourceDimensions["left"] + sourceDimensions["width"]
		};
		var positions = {
		  "top" : { "y_pos" : imaginaryPositions["if_top_y"], "x_pos" : imaginaryPositions["if_vertical_x"] },
		  "bottom" : { "y_pos" : imaginaryPositions["if_bottom_y"],"x_pos" : imaginaryPositions["if_vertical_x"] },
		  "right" : { "y_pos" : imaginaryPositions["if_horizontal_y"],"x_pos" : imaginaryPositions["if_right_x"] },
		  "left" : { "y_pos" : imaginaryPositions["if_horizontal_y"],"x_pos" : imaginaryPositions["if_left_x"] }
		};
		var key = Object.keys(positions)[computeBestPosition(imaginaryPositions, tooltipDimensions, required)];
		tooltip.classList.remove(..._pos);
		tooltip.classList.add(key);
		Object.assign(tooltip.style, { "left" : positions[key]["x_pos"] + "px", "top" : positions[key]["y_pos"] + "px"});
	}

	function computeBestPosition(imaginaryPositions, tooltipDimensions, required){
		var screenTop  = window.pageYOffset,
		    screenWidth = window.innerWidth,
		    screenHeight = window.innerHeight,
		    selector = [0,0,0,0];

		if ( screenTop < imaginaryPositions["if_top_y"] ) {
		  selector[0] +=1;
		  if ( required === "top" ) { selector[0] +=2; }
		} 

		if ( screenTop > imaginaryPositions["if_top_y"] || screenTop < imaginaryPositions["if_bottom_y"] ) {
		  selector[1] +=1;
		  if ( required === "bottom" ) { selector[1] +=2;  }
		}

		if ( imaginaryPositions["if_vertical_x"] < 0 || (required === "right" && (imaginaryPositions["if_right_x"] + tooltipDimensions["width"]) < screenWidth ) ) {
		  selector[2] += 1;
		  if ( required === "right" ) { selector[2] +=2;  }
		} 

		if ( imaginaryPositions["if_left_x"] > 0 ) {
		  selector[3] += 1;
		  if ( required === "left" ) { selector[3] +=2; }
		}
		return selector.indexOf(Math.max.apply(Math, selector));
	}

	function showTooltip(){
		var _ = this;
		var elem = _["tooltip"];
		var options = _["options"];
		var callback = options["callback"];
		var animateEffect = options["animation"];

		getPosition(_["tooltip"], _["source"], _["options"]["position"]);

		setTimeout(function(){
			elem.classList.remove("hideTooltip");

			if ( elem.classList.contains("open") === false ) {
			  if ( standardAnimations.indexOf(animateEffect) === -1 ) {
			    window[animateEffect]("animate", _, callback);
			  } else {
			    addStandardEffect(elem, animateEffect, callback);
			  }
			}
			elem.classList.add("open");
			setTimeout(function(){
				if ( options["content"]["type"] === "ajax" || options["content"]["type"] === "jsonp" && requests[_["id"]]["loaded"] === false ) {
					elem.style.transition = "none";
					requestsHandler(_["id"], elem)
					element.style.transition = "";
				}
			}, 500)
		}, 200)
	}

	function hideTooltip(){
		var _ = this;
		var elem = _["tooltip"];
		var options = _["options"];
		var callback = options["callback"];
		var animateEffect = options["animation"];
		var timeout = 0;

		if ( elem.classList.contains("animating") !== false ) {
		  // User clicked even though tooltip is still animating
		  timeout = 400;
		}

		setTimeout(function(){
			if ( elem.classList.contains("open") === true ) {
				if ( standardAnimations.indexOf(animateEffect) === -1 ) {
				    window[animateEffect]("deanimate", _, callback);
				  } else {
				    removeStandardEffect(elem, animateEffect);
				  }
				  elem.classList.remove("open");
			}
		}, timeout);
	}

	/** Custom Effects **/
	function floatEffect(fn, elem, callback) {
		 if ( fn === "animate" ) {
            addStandardEffect(elem, "bounce", null);
            setTimeout(function(){
                elem.classList.add( "drooltipFloat");
                if ( callback !== null && callback !== undefined ) {
				  window[callback]();
				}
            }, 100);
        } else {
            elem.classList.remove( "drooltipFloat");
            removeStandardEffect(elem, "bounce");
        }
	}

	function materialEffect(fn, elem, callback) {
		 if ( fn === "animate" ) {
		 	elem.classList.add("drooltipMaterial");
		 	setTimeout(function(){
	        	elem.classList.remove("hideTooltip");     
	            setTimeout(function(){
	                elem.classList.add("animate");
	                setTimeout(function(){ 
	                	arrowDisplay(elem, "show"); 
	                }, 100);
	            }, 200);
            }, 100);
        } else {
            arrowDisplay(elem, "hide");
            setTimeout(function(){
                elem.classList.remove("animate");
                setTimeout(function(){
                    elem.classList.remove("drooltipMaterial");
                    elem.classList.add("hideTooltip");
                }, 100);
            }, 200);
        }
	}

	/** Standard Effects **/
	function addStandardEffect(elem, animateEffect, callback){
		if ( animateEffect === "material" ) {
			materialEffect("animate", elem, callback);
			return false;
		}
		if ( animateEffect === "float" ) {
			floatEffect("animate", elem, callback);
			return false;
		}

		var animateEffectClass = "drooltip" + animateEffect[0].toUpperCase() + animateEffect.slice(1)
		elem.classList.remove("out");
		elem.classList.add(animateEffectClass, "animating");
		arrowDisplay(elem, "show");
		setTimeout(function(){
		  elem.classList.remove("hideTooltip");
		  setTimeout(function(){
		    elem.classList.remove(animateEffectClass, "animating");
		  }, 200);
		  if ( callback !== null && callback !== undefined ) {
		  	window[callback]();
		  }
		}, 200);
	}

	function removeStandardEffect(elem, animateEffect){
		if ( animateEffect === "material" ) {
			materialEffect("deanimate", elem);
			return false;
		}
		if ( animateEffect === "float" ) {
			floatEffect("deanimate", elem);
			return false;
		}

		var animateEffectClass = "drooltip" + animateEffect[0].toUpperCase() + animateEffect.slice(1)
	    elem.classList.add(animateEffectClass);
	    elem.classList.add("out");
	    arrowDisplay(elem, "hide");
	    setTimeout(function(){
	      elem.classList.add("hideTooltip");
	      elem.classList.remove(animateEffectClass);
	   }, 400);
	}

	function arrowDisplay(elem, action){
		if ( action === "show" ) {
		  elem.classList.add("showArrow");
		} else {
		  elem.classList.remove("showArrow");
		}
	}

	function listenerAdd(data, trigger) {
		var standardTriggers = ["hover", "click", "none"];
		//var tooltips = Object.assign({}, publicTooltips);
		if ( standardTriggers.indexOf(trigger) === -1 ) { 
		    window[trigger].call(this, data);
		    return false;
		} else {
			data["tooltip"].classList.add("hideTooltip");
			if ( trigger === "hover" ) {
				drooltipHover(data);
			} else if ( trigger === "click" ) {
				drooltipClick(data);
			} else if ( trigger === "none" ) {
				showTooltip.call(data);
			}
		}
		/**
		for ( var i in tooltips ) {
		  publicTooltips[i]["tooltip"].classList.add("hideTooltip");
		  if ( trigger === "hover" ) {
		    drooltipHover(publicTooltips[i]);
		  } else if ( trigger === "click" ) {
		    drooltipClick(publicTooltips[i]);
		  } else if ( trigger === "none" ) {
		    showTooltip.call(publicTooltips[i]);
		  }
		}
		**/
		

		
	}

	function drooltipHover(data){
		var mouseover = function (data) {
		    var timeout = null;
		    var exit = null;
		    window.addEventListener("mouseover", function(e){   
		    	 if ( data["source"].contains(e.target) || data["tooltip"].contains(e.target) ){
		    		clearTimeout(exit)
		    	} else {
					exit = setTimeout(function(){
						if ( data["tooltip"].classList.contains("open") ) {
							hideTooltip.call(data)
						}
					}, 200);
		    	}
		    })

		   	data["source"].addEventListener("mouseenter", function(e){   
		          timeout = setTimeout(function(){
		            showTooltip.call(data);
		          }, 200);
		    });

		    data["source"].addEventListener("mouseleave", function(e){   
		    	  clearTimeout(timeout)
		    });
		};
		mouseover(data);
	}

	function drooltipClick(data){
		window.addEventListener("click", function(e){   
		    if (data["source"].contains(e.target) || data["tooltip"].contains(e.target)){
		      showTooltip.call(data);
		    } else {
		      hideTooltip.call(data);
		    }
		});
	}

	
	function animateOrDeanimate(fn, data){
		if ( fn === "animate" ) {
			showTooltip.call(data);
		} else {
			hideTooltip.call(data);
		}
	}

	function animateOrDeanimateAll(fn){
		var instances = this.tooltips;
		for ( var i in instances ) {
			if ( fn === "animate" ) {
				showTooltip.call(instances[i], this.tooltips[i]["options"]);
			} else {
				hideTooltip.call(instances[i], this.tooltips[i]["options"]);
			}
		}
	}

	function showOrHideAllTooltips(fn){
		var instances = this.tooltips;
		for ( var i in instances ) {
			if ( fn === "show" ) {
				instances[i]["tooltip"].classList.remove("hideTooltip");
			} else {
				instances[i]["tooltip"].classList.add("hideTooltip");
			}
		  
		}
	}


	/** Global Objects, contains tooltips across all instances in a page; 
	required for setting positions and processing ajax/jsonp requests **/
	var tooltips = {},
		requests = {},
		standardAnimations = ["bounce", "fade", "material", "float"];

	/** Build(); Creates tooltips for given element(s) **/
	Drooltip.prototype.build = function(){
	    var elems = document.querySelectorAll(this.options["element"]),
	        id = this.options["element"];

	    var _ = this
	    tooltips[id] = {};
	    this.tooltips = {};
	    for (var i = 0; i < elems.length; ++i) {
	        elems[i].setAttribute("data-id", i);
	        var options = Object.assign({}, this.options),
	            privateOptions = elems[i].getAttribute("data-options"),
	            privateContent = elems[i].getAttribute("title");

	        if ( privateOptions !== null ) {
	          for ( var x in privateOptions.split(";") ) {
	          	  var property = privateOptions.split(";")[x].split(":")[0];
	              if ( property !== "content" ) {
	                var value = privateOptions.split(";")[x].split(":")[1];
	                options[property] = value;
	              }
	          }
	        }

	        if ( privateContent !== null && privateContent !== "" ) {
	        	options["content"] = formatPrivateContent(privateContent);
	        	elems[i].removeAttribute("title")
	        }

	        if ( options["content"] !== null ) {
	          var tooltip = createTooltip((id + "_" + i), elems[i], options);
	          tooltips[id][i] =  { "id": id + "_" + i, "source" :  elems[i], tooltip, options };
	          this.tooltips[i] = { "id": id + "_" + i, "source" :  elems[i], tooltip, options };
	        }	   

	        attachTriggerEvent.call(_, this.tooltips[i])     
	    }
  	}; 

	Drooltip.prototype.animateAllTooltips = function(){
		animateOrDeanimateAll.call(this, "animate");
	};


	Drooltip.prototype.deanimateAllTooltips = function(){
	 	animateOrDeanimateAll.call(this, "deanimate");
	};

	Drooltip.prototype.animateTooltip = function(data){
		animateOrDeanimate.call(this, "animate", data);
	};


	Drooltip.prototype.deanimateTooltip = function(data){
	 	animateOrDeanimate.call(this, "deanimate", data);
	};

	Drooltip.prototype.hideAllTooltips = function(){
		showOrHideAllTooltips.call(this, "hide");
	};


	Drooltip.prototype.showAllTooltips = function(){
		showOrHideAllTooltips.call(this, "show");
	};


	Drooltip.prototype.hideTooltip = function(tooltip){
	  tooltip.classList.add("hideTooltip");
	};


  	Drooltip.prototype.showTooltip = function(tooltip){
      tooltip.classList.remove("hideTooltip");
    };

    Drooltip.prototype.addStandardEffect = function(elem, effect) {
		addStandardEffect(elem, effect);
	};

	Drooltip.prototype.removeStandardEffect = function(elem, effect) {
		removeStandardEffect(elem, effect);
	};

	Drooltip.prototype.showArrow = function(elem) {
		arrowDisplay(elem, "show");
	};

	Drooltip.prototype.hideArrow = function(elem) {
		arrowDisplay(elem, "hide");
	};

	Drooltip.prototype.loadRequests = function(){
		for ( var i in requests ) {
		    var elem = document.querySelector("[data-identifiers='" + i + "']");
		    requestsHandler(requests[i], elem);
		}
	};

	/** Sets tooltips position **/
    Drooltip.prototype.setTooltipsPos = function(){
		var _ = this;
		for ( var i in tooltips ) {
		  
		  for ( var j in tooltips[i] ) {
		    var current = tooltips[i][j];
		    var position = current["options"]["position"];
		    var source = current["source"];
		    var tooltip = current["tooltip"];
		    var sourceDimensions = getElemDimensions(source);
		    var tooltipDimensions = getElemDimensions(tooltip);
		    getPosition(tooltip, source, position);
		  }
		}
	};

	Drooltip.prototype.updatePosition = function(data){
		getPosition(data["tooltip"], data["source"], data["options"]["position"]);
	}

	function attachTriggerEvent(data) {
		var source  = data["source"],
			tooltip = data["tooltip"],
			options =  data["options"],
			trigger = options["trigger"];

	    tooltip.classList.add( "loaded");
	    listenerAdd.call(this, data, trigger);
	}
})();


window.onload = function() {

	Drooltip.prototype.setTooltipsPos();	

	window.addEventListener('scroll', function(){ 
		Drooltip.prototype.setTooltipsPos();	
	}, true)

	window.onresize = function(){ Drooltip.prototype.setTooltipsPos(); }
};