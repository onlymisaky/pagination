(function (w) {
    function Pagination(options) {
        this.init(options);
    }

    Pagination.prototype = {
        constructor: Pagination,
        init: init,
        getParams: getParams,
        bulidOptions: bulidOptions,
        createPage: createPage,
        buildEvent: buildEvent,
        change: change
    }

    function init(options) {
        this.getParams(options);
        this.bulidOptions();
        this.createPage();
    }

    // 将 getParams 和 bulidOptions 分开是为了在调用change时，不需要再获取一遍参数，从而导致更新失败
    function getParams(options) {
        this.el = document.querySelector(options.el);
        this.visiblePages = options.visiblePages;
        this.totalPages = options.totalPages;
        this.currentPage = options.currentPage;
        this.onPageChange = options.onPageChange;
    }

    function bulidOptions() {
        // 显示多少页
        this.visiblePages = parseInt(this.visiblePages) || 10;
        // 总页数，如果没有，取 totalCounts/pageSize
        this.totalPages = parseInt(this.totalPages) || Math.ceil(this.totalCounts / this.pageSize) || 10;
        // 当前页
        this.currentPage = Math.max(parseInt(this.currentPage) || 1, 1);
        // 当前页，不能大于当前最大页码
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        // 回调
        this.onPageChange = this.onPageChange;
        // 开始页最小为1，最大为totalPages，在非极值的情况下，尽量保证currentPage在中间显示
        var start1 = Math.max(this.currentPage - (this.visiblePages - this.visiblePages % 2) / 2, 1);
        var statr2 = Math.max(this.totalPages - (this.visiblePages + this.visiblePages % 2 - 1), 1);
        this.startPage = Math.min(start1, statr2);
        // 结束页最小为startPage，最大为totalPages
        this.endPage = Math.min(this.startPage + (this.visiblePages + this.visiblePages % 2 - 1), this.totalPages);
    }

    function createPage() {
        this.el.innerHTML = "";
        var ul = document.createElement("ul");
        var li, a;
        createElement(ul, li, a, "首页", "1");
        createElement(ul, li, a, "上一页", this.currentPage - 1);
        for (var i = this.startPage; i <= this.endPage; i++) {
            createElement(ul, li, a, i, i, this.currentPage);
        }
        createElement(ul, li, a, "下一页", this.currentPage + 1);
        createElement(ul, li, a, "末页", this.totalPages);
        this.el.appendChild(ul);
        var _this = this;
        ul.addEventListener("click", function (e) {
            _this.buildEvent(e);
        });
    }

    function createElement(ul, li, a, text, data, currentPage) {
        li = document.createElement("li");
        a = document.createElement("a");
        a.innerText = text;
        a.setAttribute("data-page", data);
        li.appendChild(a);
        ul.appendChild(li);
        if (data == currentPage) {
            a.className = "current";
        }
    }

    function buildEvent(e) {
        if (e.target.getAttribute("data-page")) {
            var page = parseInt(e.target.getAttribute("data-page"));
            page = Math.min(page, this.totalPages);
            page = Math.max(page, 1);
            if (page !== this.currentPage) {
                this.currentPage = parseInt(page);
                this.bulidOptions();
                this.createPage();
                if (typeof this.onPageChange === "function") {
                    this.onPageChange(this.currentPage);
                }
            }
        }
    }

    function change(obj) {
        for (var k in obj) {
            console.log(k, obj[k])
            this[k] = obj[k];
        }
        this.bulidOptions();
        this.createPage();
    }

    w.Pagination = Pagination;

})(window);

