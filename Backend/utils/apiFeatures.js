class APIFeatures {
  // query = Product.find()

  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { name: { $regex: this.queryStr.keyword, $options: "i" } },
            { address: { $regex: this.queryStr.keyword, $options: "i" } },
            { city: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filterByCity() {
    const rawCity = this.queryStr.city;
    if (
      rawCity &&
      typeof rawCity === "string" &&
      rawCity.trim() !== "" &&
      rawCity.trim().toLowerCase() !== "all"
    ) {
      const trimmedCity = rawCity.trim();
      this.query = this.query.find({
        $or: [
          { city: { $regex: new RegExp(`^${trimmedCity}$`, "i") } },
          { address: { $regex: new RegExp(trimmedCity, "i") } },
        ],
      });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    console.log(queryCopy);

    // Removing fields from the query
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => delete queryCopy[el]);

    console.log(queryCopy);

    //{ price: { gte: '1', lte: '200' } }

    //this.query = this.query.find(queryCopy);

    // Advance filter for price , ratings etc
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    console.log(queryStr);

    //{ price: { gte: '1', lte: '200' } }
    // gte , lte etc are mongo operators and each mongo operator starts with $ sign eg $lte
    // so we have to add $ sign  $lte and $gte . Hence we replace as above
    // console.log(queryCopy);

    this.query = this.query.find(JSON.parse(queryStr));

    // Check if sortBy is specified in the query parameters
    if (this.queryStr.sortBy) {
      const sortBy = this.queryStr.sortBy.toLowerCase();

      // Sort by ratings (highest to lowest)
      if (sortBy === "ratings") {
        sortQuery = { ratings: -1 };
      }
      // Sort by reviews (highest to lowest)
      else if (sortBy === "reviews") {
        sortQuery = { numOfReviews: -1 };
      }
    }

    // Apply the sorting query to the APIFeatures
    this.query = this.query.sort(sortQuery);

    //db.sar.find({“Last_Name”:{$gte:“C”}})
    //this.query = this.query.find({ 'queryStr.price': { $gte: '900' } });
    //console.log(this.query);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
  sort() {
    // Check if sortBy is specified in the query parameters
    if (this.queryStr.sortBy) {
      const sortBy = this.queryStr.sortBy.toLowerCase();
      let sortQuery = {};

      // Sort by ratings (highest to lowest)
      if (sortBy === "ratings") {
        sortQuery = { ratings: -1 };
      }
      // Sort by reviews (highest to lowest)
      else if (sortBy === "reviews") {
        sortQuery = { numOfReviews: -1 };
      }

      // Apply the sorting query to the APIFeatures
      this.query = this.query.sort(sortQuery);
    }

    return this;
  }
}

module.exports = APIFeatures;
