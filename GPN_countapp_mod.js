/* eslint-disable import/no-amd */
/*******************************************************************************
 * The following javascript code is provided without guarantees or promises of future support, unless otherwise negotiated
 *
 * Revision :   WMS-1
 * @NApiVersion 2.1
 * @NModuleScope Public
 *
 * ******************************************************************************/
define(["N/record", "N/search", "N/log", "N/format", "N/runtime"], function (
  record,
  search,
  log,
  format,
  runtime
) {
  // represents the record module. // function. The 'record' argument is an object that // The next line marks the beginning of the callback
  // The next line marks the beginning of the entry point
  // function.
  let accountId = "1017606_sb1";
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
  }
  let env =
    accountId == "1017606_sb1"
      ? {
          inventoryCountHTMLID: "10338",
          failoverLocationId: "412",
          inventoryCountRecordFields: {
            type: "customrecord_inventory_count",
            date: "custrecord_ic_date",
            details: "custrecord_count_details",
            user: "custrecord_ic_user",
            location: "custrecord_ic_location",
            name: "name",
            status: "custrecord_ic_status",
          },
          defaultValues: {
            subsidiary: 4,
            adjustmentsAccount: 542,
          },
        }
      : {
          inventoryCountHTMLID: "10338",
          failoverLocationId: "412",
          inventoryCountRecordFields: {
            type: "customrecordinventory_count_details",
            date: "custrecord1",
            details: "custrecordjson_details",
            user: "custrecorduser",
            location: "custrecordlocation",
            name: "name",
            status: "custrecordstatus",
          },
          defaultValues: {
            subsidiary: 1,
            adjustmentsAccount: 569,
          },
        };
  function getEnvVariables(requestedInfo, environmentObj = runtime.accountId) {
    let str = "env" + "." + requestedInfo;
    try {
      return eval(str);
    } catch (e) {
      return {
        error: e.message,
        "params request": requestedInfo,
        "string construct": str,
      };
    }
  }
  function HandleSubmitCount(
    items,
    locationId,
    userId,
    userName,
    context,
    locationName,
    status
  ) {
    log.debug("env", env.inventoryCountRecordFields);
    let customRecord = record.create({
      type: env.inventoryCountRecordFields.type,
    });

    const jsonDetails = {
      items: JSON.parse(items),
      location: locationId,
      locationName,
      user: userId,
      userName: userName,
      date: new Date(),
    };

    log.debug("json", jsonDetails);
    customRecord.setValue({
      fieldId: "name",
      value: `${locationId} ${userId} Inventory Detail`,
    });

    customRecord.setValue({
      fieldId: env.inventoryCountRecordFields.user,
      value: userId,
    });
    customRecord.setValue({
      fieldId: env.inventoryCountRecordFields.date,
      value: new Date(),
    });
    customRecord.setValue({
      fieldId: env.inventoryCountRecordFields.location,
      value: locationId,
    });

    customRecord.setValue({
      fieldId: env.inventoryCountRecordFields.details,
      value: JSON.stringify(jsonDetails),
    });

    const customRecordId = customRecord.save();
    return customRecordId;
  }
  function getItemByName(itemName) {
    try {
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

      let fieldsToFetch = ["internalid", "displayname"];
    } catch (error) {}
  }
  function getUsersOfInventoryCount(locationId) {
    try {
      log.debug("accID", env.inventoryCountRecordFields);

      // ["custrecordlocation","anyof",locationId]

      let customrecordinventory_count_detailsSearchObj = search.create({
        type: env.inventoryCountRecordFields.type,
        filters: [],
        columns: [
          search.createColumn({
            name: env.inventoryCountRecordFields.user,
            summary: "GROUP",
            label: "Created By",
          }),
        ],
      });
      let fetchedDetails = [];

      var searchResultCount =
        customrecordinventory_count_detailsSearchObj.runPaged().count;
      log.debug(
        "customrecordinventory_count_detailsSearchObj result count",
        searchResultCount
      );
      customrecordinventory_count_detailsSearchObj
        .run()
        .each(function (result) {
          // .run().each has a limit of 4,000 results
          let id = result.getValue({
            name: env.inventoryCountRecordFields.user,
            summary: "GROUP",
          });

          if (id)
            fetchedDetails.push({
              name: result.getText({
                name: env.inventoryCountRecordFields.user,
                summary: "GROUP",
              }),
              id,
            });
          return true;
        });
      // customrecordinventory_count_detailsSearchObj.run().each(function (result) {});

      return fetchedDetails;
    } catch (err) {
      log.error("Error", err);
      return false;
    }
  }
  function getInventoryCountDetails(
    userId,
    date,
    startIdx = 0,
    endIdx = 20,
    locationId
  ) {
    try {
      let filters = [];
      if (userId) {
        filters.push([env.inventoryCountRecordFields.user, "anyof", userId]);
      }
      if (!!date)
        filters.length
          ? filters.push("AND", [
              env.inventoryCountRecordFields.date,
              "on",
              formatDate(date),
            ])
          : filters.push([
              env.inventoryCountRecordFields.date,
              "on",
              formatDate(date),
            ]);
      if (locationId)
        filters.length
          ? filters.push("AND", [
              env.inventoryCountRecordFields.location,
              "is",
              locationId,
            ])
          : filters.push([
              env.inventoryCountRecordFields.location,
              "is",
              locationId,
            ]);
      let customrecordinventory_count_detailsSearchObj = search.create({
        type: env.inventoryCountRecordFields.type,
        filters: filters,
        columns: [
          "internalid",
          search.createColumn({
            name: "name",
            label: "Name",
          }),
          search.createColumn({
            name: "created",
            sort: search.Sort.DESC,
            label: "Date Created",
          }),
          search.createColumn({ name: "scriptid", label: "Script ID" }),
          search.createColumn({
            name: env.inventoryCountRecordFields.details,
            label: "Details",
          }),
          search.createColumn({
            name: env.inventoryCountRecordFields.location,
            label: "location",
          }),
        ],
      });
      let fetchedDetails = [],
        items = [],
        ids = {};

      let searchResult = customrecordinventory_count_detailsSearchObj
        .run()
        .getRange({
          start: startIdx,
          end: endIdx,
        });

      searchResult.forEach(function (result) {
        let details = JSON.parse(
          result.getValue({
            name: env.inventoryCountRecordFields.details,
          })
        );
        let location = result.getValue(env.inventoryCountRecordFields.location);

        details?.items?.map((item) => {
          items.push({
            ...item,
            location: details.location,
            locationName: details.locationName,
            userName: details.userName,
            user: details.user,
            date: details.date,
            record: result.getValue("internalid"),
          });
          ids[item.itemId] = location;
        });
      });
      let currentInventoryCounts = [];
      log.debug("ids", Object.keys(ids), Object.values(ids));
      currentInventoryCounts = getCurrentInventoryCountOfItems(
        Object.keys(ids),
        Object.values(ids)
      );

      return { items, currentInventoryCounts };
    } catch (err) {
      log.error("Error", err);
      return { items: [], currentInventoryCounts: {} };
    }
  }
  function getLocations() {
    try {
      var locationSearchObj = search.create({
        type: "location",
        filters: [],
        columns: [
          search.createColumn({ name: "internalid", label: "Internal ID" }),
          search.createColumn({
            name: "name",
            sort: search.Sort.ASC,
            label: "Name",
          }),
          search.createColumn({ name: "phone", label: "Phone" }),
          search.createColumn({ name: "city", label: "City" }),
          search.createColumn({ name: "state", label: "State/Province" }),
          search.createColumn({ name: "country", label: "Country" }),
        ],
      });
      var searchResultCount = locationSearchObj.runPaged().count;
      log.debug("locationSearchObj result count", searchResultCount);
      let Locations = [];
      locationSearchObj.run().each(function (result) {
        Locations.push({
          id: result.getValue({
            name: "internalid",
          }),
          name: result.getValue({
            name: "name",
          }),
          phone: result.getValue({
            name: "phone",
          }),
          city: result.getValue({
            name: "city",
          }),
          state: result.getValue({
            name: "state",
          }),
          country: result.getValue({
            name: "country",
          }),
        });
        return true;
      });
      return Locations;
    } catch (error) {
      log.error("error", error);
      return [];
    }
  }
  function getCurrentInventoryCountOfItems(
    itemIdArray,
    locationIdArray,
    pageNum,
    pageSize
  ) {
    let filters = [];
    if (itemIdArray.length)
      filters.push(["internalid", "anyof", ...itemIdArray]);
    if (locationIdArray?.length) {
      if (filters.length) filters.push("AND");
      filters.push([
        "inventorylocation.internalid",
        "anyof",
        ...locationIdArray,
      ]);
    }
    if (filters.length) filters.push("AND");
    filters.push(["locationquantityavailable", "greaterthan", "0"]);
    log.debug("filters", filters);
    var itemSearchObj = search.create({
      type: "item",
      filters: filters,
      columns: [
        search.createColumn({
          name: "internalid",
          summary: "GROUP",
          label: "Internal ID",
        }),
        search.createColumn({
          name: "displayname",
          summary: "GROUP",
          label: "Display Name",
        }),
        search.createColumn({
          name: "locationquantityavailable",
          summary: "GROUP",
          label: "Location On Hand",
        }),
        search.createColumn({
          name: "name",
          join: "inventoryLocation",
          summary: "GROUP",
          label: "Name",
        }),
        search.createColumn({
          name: "internalid",
          join: "inventoryLocation",
          summary: "GROUP",
          label: "Internal ID",
        }),
        search.createColumn({
          name: "itemid",
          summary: "GROUP",
          sort: search.Sort.ASC,
          label: "Name",
        }),
      ],
    });

    let searchResult = itemSearchObj.runPaged({
      pageSize: pageSize,
    });
    log.debug("page entries for query", searchResult.count);
    let paginatedData = searchResult.fetch({
      index: pageNum,
    });

    log.debug("Last page", paginatedData.isLast);

    let itemsQuantityPerLocation = {};
    paginatedData.data.forEach(function (result) {
      log.debug("result", result);
      let itemId = result.getValue({
        name: "internalid",
        summary: "GROUP",
      });
      let quantity = result.getValue({
        name: "locationquantityavailable",
        summary: "GROUP",
      });
      let location = result.getValue({
        name: "internalid",
        join: "inventoryLocation",
        summary: "GROUP",
      });
      let item = result.getValue({
        name: "itemid",
        summary: "GROUP",
      });
      itemsQuantityPerLocation[`${itemId}_${location}`] = quantity;
      itemsQuantityPerLocation[`${itemId}_${location}_name`] = item
        .split(" ")
        .pop();
      return true;
    });
    // let itemsQuantityPerLocation = {};
    // itemSearchObj.run().each(function (result) {
    //   let itemId = result.getValue({
    //     name: "internalid",
    //     summary: "GROUP",
    //   });
    //   let quantity = result.getValue({
    //     name: "locationquantityavailable",
    //     summary: "GROUP",
    //   });
    //   let location = result.getValue({
    //     name: "internalid",
    //     join: "inventoryLocation",
    //     summary: "GROUP",
    //   });
    //   let item = result.getValue({
    //     name: "itemid",
    //     summary: "GROUP",
    //   });
    //   itemsQuantityPerLocation[`${itemId}_${location}`] = quantity;
    //   itemsQuantityPerLocation[`${itemId}_${location}_name`] = item
    //     .split(" ")
    //     .pop();
    //   return true;
    // });
    return { data: itemsQuantityPerLocation, isLastPage: paginatedData.isLast };
  }
  function approveInventoryCount(itemsList, statusInput) {
    try {
      // const itemIdArray = input.map((obj) => obj.itemId);
      log.debug("items", itemsList, typeof itemsList);
      let items = JSON.parse(itemsList);
      let status = statusInput?.includes("rejected") ? "rejected" : "";
      let updatedInventory = 0;
      let groupByRecord = {};
      items.forEach((item, i) => {
        groupByRecord[item.record] = groupByRecord[item.record]
          ? [...groupByRecord[item.record], item]
          : [item];
      });
      log.debug("groupByRecord", { groupByRecord, status });

      // let itemsQuantityPerLocation = getCurrentInventoryCountOfItems(itemIdArray, [location]);
      let interoryAjdustments = Object.keys(groupByRecord).map((recordId) => {
        let customrecordinventory = record.load({
          type: env.inventoryCountRecordFields.type,
          id: recordId,
          isDynamic: false,
        });
        // Create Inventory Adjustment
        let InventoryAdjustment = null;
        log.debug({
          title: "customrecordinventory",
          details: "customrecordinventory",
        });
        let updatedItemsUq = {};
        let updatedItems = groupByRecord[recordId].map((item, i) => {
          let inventoryCount = item.quantity;
          let quanity_on_hand = item.onHand || 0;
          let updated_qty_diff = inventoryCount - quanity_on_hand;
          if (status !== "rejected" && updated_qty_diff != 0) {
            // let quanity_on_hand = itemsQuantityPerLocation[`${item.itemId}_${location}`];
            if (i === 0) {
              InventoryAdjustment = record.create({
                type: record.Type.INVENTORY_ADJUSTMENT,
                isDynamic: false,
              });

              InventoryAdjustment.setValue({
                fieldId: "memo",
                value: "Inventory Count Reconcilation",
              });
              InventoryAdjustment.setValue({
                fieldId: "trandate",
                value: new Date(
                  customrecordinventory.getValue(
                    env.inventoryCountRecordFields.date
                  )
                ),
              });
              InventoryAdjustment.setValue({
                fieldId: "subsidiary",
                value: env.defaultValues.subsidiary,
              });
              InventoryAdjustment.setValue({
                fieldId: "account",
                value: env.defaultValues.adjustmentsAccount,
              });
              InventoryAdjustment.setValue({
                fieldId: "adjlocation",
                value: customrecordinventory.getValue(
                  env.inventoryCountRecordFields.location
                ),
              });
            }
            if (updated_qty_diff !== 0) {
              log.debug("all fields", [
                { fieldId: "memo", value: "Inventory Count Reconcilation" },
                {
                  fieldId: "trandate",
                  value: customrecordinventory.getValue(
                    env.inventoryCountRecordFields.date
                  ),
                  value2: new Date(
                    customrecordinventory.getValue(
                      env.inventoryCountRecordFields.date
                    )
                  ),
                  t: new Date(),
                },
                {
                  fieldId: "subsidiary",
                  value: env.defaultValues.subsidiary,
                },
                {
                  fieldId: "account",
                  value: env.defaultValues.adjustmentsAccount,
                },
                {
                  fieldId: "adjlocation",
                  value: customrecordinventory.getValue(
                    env.inventoryCountRecordFields.location
                  ),
                },
                {
                  sublistId: "inventory",
                  fieldId: "item",
                  value: item.itemId,
                  line: i,
                },
                {
                  sublistId: "inventory",
                  fieldId: "location",
                  value: item.location,
                  line: i,
                },
                {
                  sublistId: "inventory",
                  fieldId: "adjustqtyby",
                  value: updated_qty_diff,
                  line: i,
                },
              ]);
              InventoryAdjustment.setSublistValue({
                sublistId: "inventory",
                fieldId: "item",
                value: item.itemId,
                line: i,
              });
              InventoryAdjustment.setSublistValue({
                sublistId: "inventory",
                fieldId: "location",
                value: item.location,
                line: i,
              });
              InventoryAdjustment.setSublistValue({
                sublistId: "inventory",
                fieldId: "adjustqtyby",
                value: updated_qty_diff,
                line: i,
              });
              // if (updated_qty_diff < 0) {
              // 	log.debug({
              // 		title: "line",
              // 		details: i,
              // 	});
              // 	let inventoryDetailSubrecord = InventoryAdjustment.getSublistSubrecord({ sublistId: "inventory", fieldId: "inventorydetail", line: i });
              // 	log.debug({
              // 		title: "inventoryDetailSubrecord",
              // 		details: inventoryDetailSubrecord,
              // 	});
              // 	inventoryDetailSubrecord.setSublistValue({ sublistId: "inventoryassignment", fieldId: "inventorystatus", value: "1", line: 0 }); //good
              // 	inventoryDetailSubrecord.setSublistValue({ sublistId: "inventoryassignment", fieldId: "quantity", value: updated_qty_diff, line: 0 });
              // 	// inventoryDetailSubrecord.save({ enableSourcing: true, ignoreMandatory: true });
              // }
            }
          }
          updatedItemsUq[`${item.itemId}@${inventoryCount}`] =
            status === "rejected" ? "Rejected" : "Approved";
          return item;
        });
        let invadjtId = null,
          IAtranId = null;
        if (status !== "rejected" && InventoryAdjustment) {
          log.debug({
            title: "InventoryAdjustment",
            details: InventoryAdjustment,
          });
          invadjtId = InventoryAdjustment.save({
            enableSourcing: true,
            ignoreMandatory: true,
          });
          IAtranId = record
            .load({ type: "inventoryadjustment", id: invadjtId })
            .getValue("tranid");
          updatedInventory++;

          log.debug({
            title: "invadjt",
            details: invadjtId,
          });
        }
        let previousJson = customrecordinventory.getValue({
          fieldId: env.inventoryCountRecordFields.details,
        });
        log.debug("updatedItemsUq", updatedItemsUq);
        const jsonDetails = JSON.parse(previousJson);
        let newItms = jsonDetails.items.map((item, i) => {
          let updatedItemStatus =
            updatedItemsUq[`${item.itemId}@${item.quantity}`];
          log.debug(`${item.itemId}@${item.quantity} ${i}`, {
            updatedItemStatus,
          });
          return {
            ...item,
            status: updatedItemStatus ? updatedItemStatus : item.status,
          };
        });
        customrecordinventory.setValue({
          fieldId: env.inventoryCountRecordFields.details,
          value: JSON.stringify({ ...jsonDetails, items: newItms }),
        });

        // customrecordinventory.setValue({
        // 	fieldId: env.inventoryCountRecordFields.status,
        // 	value: 2, // "Approved"
        // });

        customrecordinventory.save();

        return {
          id: invadjtId || "",
          location: customrecordinventory.getText(
            env.inventoryCountRecordFields.location
          ),
          IAtranId,
        };
        //  else return { id: "", location: "" };
      });
      if (updatedInventory)
        return {
          recordsCreated: interoryAjdustments.map(
            ({ id, location, IAtranId }) => ({
              location: location,
              link: id
                ? `https://${runtime.accountId
                    .split("_")
                    .join(
                      "-"
                    )}.app.netsuite.com/app/accounting/transactions/invadjst.nl?id=${id}`
                : "",
              id: IAtranId || "",
              status: status === "rejected" ? "Rejected" : "Approved",
            })
          ),
          success: true,
          message: "Inventory Adjusted",
        };
      else
        return {
          recordsCreated: [],
          success: true,
          message: "No Record Created!",
        };
    } catch (error) {
      log.debug({
        title: "err",
        details: error,
      });
      return { recordsCreated: [], success: false, message: error?.message };
    }
  }
  return {
    getEnvVariables: getEnvVariables,
    getItemByName: getItemByName,
    getInventoryCountDetails: getInventoryCountDetails,
    getLocations: getLocations,
    getUsersOfInventoryCount,
    getCurrentInventoryCountOfItems,
    approveInventoryCount,
    HandleSubmitCount,
    env,
  };
});
