


class ApiFeatuers {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }

    paginate() {
        let { page, size } = this.queryData
        if (!page || page < 0) page = 1
        if (!size || size < 0) size = 3
        this.mongooseQuery.limit(parseInt(size)).skip((parseInt(page) - 1) * parseInt(size))
        return this

    }
    filter() {
        const excloudQueryParams = ["page", "size", "sort", "search", "fields"]
        const filterQuery = { ...this.queryData }
        excloudQueryParams.forEach(params => {
            delete filterQuery[params]
        });
        this.mongooseQuery.find(JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match => `$${match}`)))
        return this

    }
    sort() {
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(",", " "))
        return this
    }
    search() {
        this.mongooseQuery.find({
            $or: [
                { name: { $regex: this.queryData?.search, $options: 'i' } },
                { description: { $regex: this.queryData?.search, $options: 'i' } },
            ]
        })
        return this
    }
    select() {
        this.mongooseQuery.select(this.queryData.fields?.replaceAll(",", " "))
        return this
    }
}

export default ApiFeatuers