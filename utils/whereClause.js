// base - Product.find()

const { remove } = require("../models/product");

// bigQ- //search=coder&page=2&category=shortsleeves&rating[gte]=4
// &price[lte]=4000&price[gte]=1999&limit=1

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};
    this.base = this.base.find({ ...searchword });
    return this;
  }

  pager(resultperPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }
    const skipVal = resultperPage * (currentPage - 1);

    this.base = this.base.limit(resultperPage).skip(skipVal);

    return this;
  }

  filter() {
    const copyBigQ = { ...this.bigQ };
    delete copyBigQ["search"];
    delete copyBigQ["page"];
    delete copyBigQ["limit"];

    let stringOfCopy = JSON.stringify(copyBigQ);
    stringOfCopy = stringOfCopy.replace(/\b(gte|lte|gt|lt)\b/g, (m) => `$${m}`);

    const jsonOfCopy = JSON.parse(stringOfCopy);
    const result = this.base.find(jsonOfCopy);
    this.base = this.base.find(jsonOfCopy);
    return this;
  }
}

module.exports = WhereClause;
