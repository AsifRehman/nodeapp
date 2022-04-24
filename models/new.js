db.sales.aggregate([
    { "$limit": 1 },
    { "$facet": {
      "collection1": [
        { "$limit": 1 },
        { "$lookup": {
          "from": "sales",
          "pipeline": [
            { "$match": {
              "date": { "$gte": ISODate("2018-09-01"), "$lte": ISODate("2018-09-10") },
              "customer.name": customerName
            }},
            { "$project": {
              "_id":0, "dated": "$saleDate", "heading": "Sale", "particulars": "$invoiceNumber",
              "amount": "$totalAmount", "modeOfPayment": null
            }}
          ],
          "as": "collection1"
        }}
      ],
      "collection2": [
        { "$limit": 1 },
        { "$lookup": {
          "from": "transactions",
          "pipeline": [
            { "$match": {
              "transactionDate": { "$gte": ISODate("2018-09-01"), "$lte": ISODate("2018-09-10") },
              "userId": userId, "partyName": customerName
            }},
            { "$project": {
              "_id":0, "dated": "$transactionDate", "heading": "Payment","particulars": "$transactionNumber",
              "amount": "$amount", "paymentMode": "$transactionMode"
            }}
          ],
          "as": "collection2"
        }}
      ]
    }},
    { "$project": {
      "data": {
        "$concatArrays": [
          { "$arrayElemAt": ["$collection1.collection1", 0] },
          { "$arrayElemAt": ["$collection2.collection2", 0] },
        ]
      }
    }},
    { "$unwind": "$data" },
    { "$replaceRoot": { "newRoot": "$data" } },
    { "$sort": { "dated": -1 }}
  ])
  