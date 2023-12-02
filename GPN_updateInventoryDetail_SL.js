/* eslint-disable import/no-amd */
/*******************************************************************************
 * The following javascript code is created by NS Enterprise Apps LLC, and is provided without guarantees or promises of future support
 *
 * Script Name :        [GPN] Suiteslet for WMS Inventory Count App
 * Author  :            Dean - dean@nsenterpriseapps.com
 * Revision :
 *
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 *
 * ******************************************************************************/

define([
	"N/file",
	"N/runtime",
	"N/log",
	"N/record",
	"N/search",
	"N/config",
	"N/runtime",
	"./GPN_countapp_mod.js",
  ], function (
	file,
	runtime,
	log,
	record,
	search,
	config,
	runtime,
	customoperations
  ) {
	function isAdmin(context) {
	  if (runtime.getCurrentUser().roleId === "administrator") return true;
	  if (context) {
		context.response.setHeader({
		  name: "Content-Type",
		  value: "application/json",
		});
		context.response.writeLine(
		  JSON.stringify({
			message: "This Operation is only Valid for Admin",
			status: 401,
		  })
		);
	  } else return false;
	}
	function getParams(context, type) {
	  if (type === "getCurrentInventoryOfLocation") {
		let locationId = context.request.parameters.location;
		return { locationId };
	  } else if (type === "submit-count") {
		let items = context.request.parameters.items;
		let locationId = context.request.parameters.location;
		let locationName = context.request.parameters.locationName;
		let userId = runtime.getCurrentUser().id;
		let userName = runtime.getCurrentUser().name;
		let status = runtime.getCurrentUser().status;
		return { items, locationId, userId, userName, locationName, status };
	  } else if (type === "get-inventory-details") {
		let userId = context.request.parameters.userId;
		let date = context.request.parameters.date;
		let startIdx = context.request.parameters.startIdx;
		let endIdx = context.request.parameters.endIdx;
		let locationId = context.request.parameters.locationId;
		return { userId, date, startIdx, endIdx, locationId };
	  } else if (type === "users") {
		let locationId = context.request.parameters.locationId;
		return { locationId };
	  }
	}
  
	function onRequest(context) {
	  try {
		const method = context.request.method;
		let type = context.request.parameters.type;
		if (method === "GET") {
		  if (type === "role") {
			var userRole = runtime.getCurrentUser().roleId;
			context.response.setHeader({
			  name: "Content-Type",
			  value: "application/json",
			});
			context.response.writeLine(
			  JSON.stringify({
				role: userRole,
				message: "Role Fetched Succesfully",
				status: 200,
			  })
			);
		  } else if (type === "finditem") {
			try {
			  let itemName = context.request.parameters.itemName;
			  if (!itemName) throw "Invalid Item Name";
			  var itemSearchObj = search.create({
				type: "item",
				filters: [
				  ["nameinternal", "is", itemName],
				  "OR",
				  ["inventorynumber.inventorynumber", "is", itemName],
				],
				columns: [
				  search.createColumn({
					name: "internalid",
					label: "Internal ID",
				  }),
				  search.createColumn({
					name: "itemid",
					label: "Item Name",
				  }),
				  search.createColumn({
					name: "isserialitem",
					label: "Is Serialized Item",
				  }),
				],
			  });
  
			  var searchResult = itemSearchObj.run().getRange(0, 1)[0];
  
			  log.debug("Found search result", searchResult);
  
			  let internalId = searchResult.getValue("internalid");
			  let isserialitem = searchResult.getValue("isserialitem");
			  let name = searchResult.getValue("itemid");
			  context.response.setHeader({
				name: "Content-Type",
				value: "application/json",
			  });
			  if (searchResult) {
				context.response.writeLine(
				  JSON.stringify({
					found: true,
					id: internalId,
					name,
					isserialitem,
					message: "Item Found Succesfully",
					status: 200,
				  })
				);
			  } else {
				context.response.writeLine(
				  JSON.stringify({
					found: false,
					message: "Item doesn't exist",
					status: 200,
				  })
				);
			  }
			} catch (error) {
			  context.response.setHeader({
				name: "Content-Type",
				value: "application/json",
			  });
			  context.response.writeLine(
				JSON.stringify({
				  found: false,
				  message: error || "Failed To Fetch Item",
				  status: 400,
				})
			  );
			}
		  } else if (type === "fetchItemByName") {
			let itemName = context.request.parameters.itemName;
			if (!itemName) throw "Invalid Item Name";
			var itemSearchObj = search.create({
			  type: "item",
			  filters: [["nameinternal", "is", itemName]],
			  columns: [
				search.createColumn({ name: "internalid", label: "Internal ID" }),
			  ],
			});
  
			var searchResult = itemSearchObj.run().getRange(0, 1)[0];
  
			log.debug("Found search result", searchResult);
  
			let quantity = context.request.parameters.quantity;
			let location = context.request.parameters.location;
			//   let userId = context.user.id;
			//   let userName = context.user.name;
  
			var itemSearchObj = search.create({
			  type: "item",
			  filters: [["nameinternal", "is", itemName]],
			  columns: [
				search.createColumn({ name: "internalid", label: "Internal ID" }),
			  ],
			});
  
			var searchResult = itemSearchObj.run().getRange(0, 1)[0];
  
			log.debug("Found search result", searchResult);
  
			let itemRecord = record.load({
			  type: "inventoryitem",
			  id: searchResult.getValue("internalid"),
			  isDynamic: false,
			});
  
			log.debug("Item record", itemRecord);
  
			let availableQuantity = itemRecord.getValue({
			  fieldId: "totalquantityonhand",
			});
  
			log.debug("Available quantity", availableQuantity);
  
			let availableLocation = itemRecord.getValue({
			  fieldId: "location",
			});
  
			log.debug("Available location", availableLocation);
  
			let itemCount = itemRecord.getLineCount({
			  sublistId: "locations",
			});
  
			for (let i = 0; i < itemCount; i++) {
			  let availableLocation2 = itemRecord.getSublistValue({
				sublistId: "locations",
				fieldId: "location_display",
				line: i,
			  });
  
			  log.debug("Available location 2", availableLocation2);
  
			  if (availableLocation2 === location) {
				let QuantityAvailable = itemRecord.getSublistValue({
				  sublistId: "locations",
				  fieldId: "quantityavailable",
				  line: i,
				});
				let remainingQuantity = QuantityAvailable - quantity;
  
				log.debug("Remaining Quantity", remainingQuantity);
  
				// next step will be to store the quantity in custom record.
				// new record.
				let customRecord = record.create({
				  type: customoperations.env.inventoryCountRecordFields.type,
				});
  
				const jsonDetails = {
				  item: itemName,
				  quantity: remainingQuantity,
				  location: location,
				  date: new Date(),
				};
  
				customRecord.setValue({
				  fieldId: "name",
				  value: `${itemName}_Inventory_Detail`,
				});
  
				customRecord.setValue({
				  fieldId:
					customoperations.env.inventoryCountRecordFields.details,
				  value: JSON.stringify(jsonDetails),
				});
  
				const customRecordId = customRecord.save();
  
				log.debug("Custom record id", customRecordId);
  
				break;
			  }
			}
		  } else if (type === "getCurrentInventoryOfLocation") {
			let params = getParams(context, "getCurrentInventoryOfLocation");
			log.debug("loc", { params, idArr: [params.locationId] });
			const currentInventoryCount =
			  customoperations.getCurrentInventoryCountOfItems(
				[],
				[params.locationId]
			  );
			log.debug("currentInventoryCount", currentInventoryCount);
  
			context.response.writeLine(
			  JSON.stringify({
				data: currentInventoryCount,
				message: "found",
				status: 200,
			  })
			);
		  } else if (type === "getInventoryDetails") {
			let params = getParams(context, "get-inventory-details");
			const inventoryDetails = customoperations.getInventoryCountDetails(
			  params.userId,
			  params.date,
			  params.startIdx,
			  params.endIdx,
			  params.locationId
			);
			log.debug("Inventory details", inventoryDetails);
  
			context.response.writeLine(
			  JSON.stringify({
				data: inventoryDetails,
				message: "found",
				status: 200,
			  })
			);
		  } else if (type === "getLocations") {
			const Locations = customoperations.getLocations();
  
			context.response.setHeader({
			  name: "Content-Type",
			  value: "application/json",
			});
			context.response.writeLine(
			  JSON.stringify({
				data: Locations,
				message: "Location Fetched Succesfully",
				status: 200,
			  })
			);
		  } else if (type === "getUsers") {
			let params = getParams(context, "users");
			let users = customoperations.getUsersOfInventoryCount(
			  params.locationId
			);
			context.response.setHeader({
			  name: "Content-Type",
			  value: "application/json",
			});
			if (users)
			  context.response.writeLine(
				JSON.stringify({
				  users,
				  message: "Users Fetched Succesfully",
				  status: 200,
				})
			  );
			else
			  context.response.writeLine(
				JSON.stringify({
				  users: [],
				  message: "Users Not Found",
				  status: 400,
				})
			  );
		  } else if (type === "test") {
			customoperations.getCurrentInventoryCountOfItems([6759], [4]);
		  } else {
			log.debug("env", customoperations.env.inventoryCountHTMLID);
			let htmlFile = file.load({
			  id: customoperations.env.inventoryCountHTMLID, // Change form location html file id
			});
  
			if (htmlFile) {
			  context.response.write({
				output: htmlFile.getContents(),
				contentType: "HTMLDOC",
			  });
			} else {
			  context.response.write("HTML file not found");
			}
		  }
		} else if (method === "POST") {
		  if (type === "submitCount") {
			try {
			  let params = getParams(context, "submit-count");
			  let ouput = customoperations.HandleSubmitCount(
				params.items,
				params.locationId,
				params.userId,
				params.userName,
				context,
				params.locationName,
				params.status
			  );
			  context.response.setHeader({
				name: "Content-Type",
				value: "application/json",
			  });
			  context.response.writeLine(
				JSON.stringify({
				  ouput,
				  message: "Custom Record created",
				  status: 200,
				})
			  );
			  return true;
			} catch (err) {
			  log.error("Error", err);
			  context.response.setHeader({
				name: "Content-Type",
				value: "application/json",
			  });
			  context.response.writeLine(
				JSON.stringify({
				  message:
					err?.message ||
					"Some error occured while submitting the inventory details!",
				  status: 404,
				})
			  );
			  return false;
			}
		  }
		  if (type === "approve") {
			isAdmin(context);
			let items = context.request.parameters.items;
			let status = context.request.parameters.status;
			if (!items.length) throw { message: "Invalid Payload!" };
			let summary = customoperations.approveInventoryCount(items, status);
			if (summary.success) {
			  context.response.setHeader({
				name: "Content-Type",
				value: "application/json",
			  });
			  context.response.writeLine(
				JSON.stringify({
				  ...summary,
				  status: 200,
				})
			  );
			} else {
			  context.response.setHeader({
				name: "Content-Type",
				value: "application/json",
			  });
			  context.response.writeLine(
				JSON.stringify({
				  ...summary,
				  status: 404,
				})
			  );
			}
		  }
		}
	  } catch (err) {
		log.error("Error", err);
		context.response.setHeader({
		  name: "Content-Type",
		  value: "application/json",
		});
		context.response.writeLine(
		  JSON.stringify({
			message: err?.message || "Please Verify the Data and Try Again!",
			status: 404,
		  })
		);
	  }
	}
  
	return {
	  onRequest: onRequest,
	};
  });