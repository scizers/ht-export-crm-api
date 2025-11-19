import _ from 'lodash'
import async from 'async'
import moment from 'moment'
import {errorObj, successObj} from './response.js'

const utils = {
    removeExtraTableParams: (obj) => {
        let x = Object.assign({}, obj)
        delete x.results
        delete x.page
        delete x.count
        delete x.sortField
        delete x.sortOrder
        delete x.selectors
        delete x.select
        delete x.regExFilters
        delete x.populateArr
        delete x.project
        delete x.dateFilter
        delete x.pageSize
        delete x.current
        delete x.customSelection

        return x
    },
    runTableDataQuery: (model, options) => {
        return new Promise((resolve) => {

            let {results, page, sortField, sortOrder, selectors} = options
            let filters = utils.removeExtraTableParams(options)

            let query = model.find({})
            let countQuery = model.count()

            _.each(filters, (val, key) => {
                if (val.length && typeof val === 'object') {
                    if (val.length === 1) {
                        _.each(val, (item) => {
                            query.where({[key]: new RegExp(item, 'ig')})
                            countQuery.where({[key]: new RegExp(item, 'ig')})
                        })
                    } else {
                        query.where({[key]: {$in: val}})
                        countQuery.where({[key]: {$in: val}})
                    }
                }
            })

            // selectors

            if (results) {
                query.limit(results)
                query.skip((page - 1) * results)
            }
            if (sortField) query.sort({[sortField]: sortOrder === 'ascend' ? 'asc' : 'desc'})

            query.exec((err, data) => {
                countQuery.exec((er, count) => {
                    resolve({data, count})
                })
            })
        })
    },
}

export function isJson(str) {

    try {
        let json = JSON.parse(str)
        return (typeof json === 'object')
    } catch (e) {
        return false
    }

}

export const createDateMongodbQuery = (payload) => {

    if (Array.isArray(payload) && payload.length == 2) {
        return {
            $gte: moment(payload[0]).toDate(),
            $lt: moment(payload[1]).toDate(),
        }
    }
    if (typeof payload == 'object' && payload.type == 'relative' && payload?.dontInclude) {

        return {
            $lt: moment().subtract(payload.durationInMinutes, 'minutes').toDate(),
        };
    }

    if (typeof payload == 'object' && payload.type == 'relative') {

        // { type : 'relative' , durationInMinutes : 3600 }

        return {
            $gte: moment().subtract(payload.durationInMinutes, 'minutes').toDate(),
            $lt: moment().toDate(),
        }
    }

}

export const TableFilterQuery5 = (Model, Params) => {
    return new Promise(async (resolve) => {

        let {
            pageSize = 100,
            current = 1,
            sortField,
            sortOrder,
            regExFilters = [],
            select,
            populateArr,
            cache,
            customSelection,
            tenantId
        } = Params
        if (!tenantId) {
            return resolve({...errorObj, data: [], total: 0, message: "TenantId required"})

        }

        let page = current
        let results = pageSize
        let customSelectionCount = customSelection
        let populateArrFilters = []

        let filter = utils.removeExtraTableParams(Params)

        let {dateFilter} = Params
        let customQuery = null

        if (filter) {
            customQuery = filter.customQuery
        }

        results = parseInt(results)
        page = parseInt(page)

        let query = Model.find({})
        let countQuery = Model.count({})

        if (populateArr) {
            _.each(populateArr, (val, key) => {
                if (tenantId) {
                    query.populate({...val, match: {tenantId: tenantId}})
                } else {
                    query.populate(val)
                }

            })
        }

        if (customQuery) {
            if (typeof customQuery === 'string' && isJson(customQuery)) {
                customQuery = JSON.parse(customQuery)
            }
            query.where({...customQuery})
            countQuery.where({...customQuery})
            delete filter.customQuery
        }

        if (filter) {
            _.each(filter, (val, key) => {

                if (isJson(val)) {
                    val = JSON.parse(val)
                    query.where({[key]: val})
                    countQuery.where({[key]: val})
                } else {
                    if (val !== undefined) {
                        let valueWord = val
                        if (regExFilters.includes(key)) {
                            val = val && val.trim().replace(/(^ +)|( +$)/g, '')
                            val = val && val.replace(/^[^a-zA-Z0-9]+/, '')
                            val = val && val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                            valueWord = new RegExp(val, 'ig')

                        }
                        query.where({[key]: valueWord})
                        countQuery.where({[key]: valueWord})
                    }
                }

            })
        }

        if (dateFilter) {
            dateFilter = JSON.parse(dateFilter)

            if (dateFilter.from && dateFilter.to) {
                query.where({[dateFilter.key]: {$gte: moment(dateFilter.from).startOf('day')}})
                query.where({[dateFilter.key]: {$lte: moment(dateFilter.to).endOf('day')}})

                countQuery.where({[dateFilter.key]: {$gte: moment(dateFilter.from).startOf('day')}})
                countQuery.where({[dateFilter.key]: {$lte: moment(dateFilter.to).endOf('day')}})
            }

        }

        if (select) {
            query.select(select)
        }

        if (sortField) {

            let order = sortOrder === 'ascend' ? 'asc' : 'desc'

            query.sort({[sortField]: order}).collation({locale: 'en', strength: 2})
        }

        query.skip((page - 1) * results).limit(results)

        if (customSelectionCount > results) {
            query.skip((page - 1) * results).limit(customSelectionCount)
        }
        query.lean()
        query.allowDiskUse(true)

        if (cache) {
            // console.log(cache, ' this is cache')
            query.cache(cache)
            countQuery.cache(cache)
        }

        try {
            let data = await query.exec()
            let total = await countQuery.collation({locale: 'en', strength: 2}).exec()
            resolve({...successObj, data, total, page})

        } catch (err) {
            return resolve({...errorObj, err, data: [], total: 0, message: err?.message})
        }

    })
}
export const TableFilterQueryWithAggregate5 = (Model, fieldName, Params) => {
    return new Promise(async (resolve) => {

        let {pageSize = 10, current = 1, sortField, sortOrder, regExFilters = [], project, populateArr} = Params

        let filter = utils.removeExtraTableParams(Params)

        let page = current
        let results = pageSize

        let matchArr = []
        let order = sortOrder === 'ascend' ? 1 : -1
        let sortObj = {}
        sortObj[sortField] = order
        let query = Model.aggregate([{$unwind: `$` + `${fieldName}`}, {$sort: sortObj}, {$project: project}])

        let countQuery = Model.aggregate([{$unwind: `$` + `${fieldName}`}])

        if (filter) {
            _.each(filter, (val, key) => {
                if (val !== undefined) {
                    let valueWord = val

                    if (regExFilters.includes(key)) {
                        val = val && val.trim().replace(/(^ +)|( +$)/g, '')
                        val = val && val.replace(/^[^a-zA-Z0-9]+/, '')
                        valueWord = new RegExp(val, 'ig')
                    }

                    if (Params.project) {
                        let findPro = _.find(Params.project, (item1, key1) => {
                            return key1.indexOf('.' + key) >= 0
                        })
                        if (findPro) {
                            let newKey = findPro[0] ? findPro[0] : fieldName
                            key = `${newKey}.` + key
                        }
                    } else {
                        key = `${fieldName}.` + key
                    }

                    matchArr.push({[key]: valueWord})

                }

            })
        }

        if (matchArr.length) {
            query.match({$and: matchArr})

        }

        query.skip((page - 1) * results).limit(results)

        if (sortField) {
            let order = sortOrder === 'ascend' ? 'asc' : 'desc'
            query.sort({[sortField]: order})
        }

        //query.lean()

        if (matchArr.length) {
            countQuery.match({$and: matchArr})

        }
        countQuery.group({
            _id: null,
            count: {$sum: 1},
        })

        try {
            let data = await query.exec()
            let coudoc = await countQuery.exec()

            if (coudoc) {
                coudoc = coudoc[0]
            }
            let dataArr = Object.assign([], data)
            async.each(populateArr, (item, cb) => {
                let ModalName = item.schemaName
                ModalName.populate(dataArr, {
                    path: item.path,
                    select: item.select,
                }, function (err, result1) {
                    if (!err) {
                        dataArr = Object.assign([], result1)
                        cb()
                    } else {
                        cb()
                    }
                })
            }, () => {
                resolve({data: dataArr, total: coudoc ? coudoc.count : 0, ...successObj})
            })

        } catch (err) {
            return resolve({...errorObj, err, data: [], total: 0})
        }

    })
}

export default utils
