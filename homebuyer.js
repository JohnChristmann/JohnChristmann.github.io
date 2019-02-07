var homes = null;
var bedroomsfilter = null;
var sizefilter = null;
var pricefilter = null;

function init() {
	var data_file = "./homebuyer.json";
	var http_request = new XMLHttpRequest();

	http_request.onreadystatechange = function () {
		if (http_request.readyState == 4) {
			var json_data = JSON.parse(http_request.responseText);
			Vue.filter('money', function (value) {
				if (!value) return ''
				value = value.toLocaleString('en')
				return value
			})

			homes = new Vue({
				el: '#homes',
				data: {
					database: json_data,
					bedrooms: [0, 0],
					size: [0, 0],
					price: [0, 0]
				},
				computed: {
					minmaxbedrooms: function () {
						var values = [0, 0]

						if (this.database.homes.length < 1)
							return values

						values[0] = this.database.homes[0].bedrooms;
						values[1] = values[0]

						for (var i = 1; i < this.database.homes.length; i++) {
							if (this.database.homes[i].bedrooms < values[0])
								values[0] = this.database.homes[i].bedrooms
							if (this.database.homes[i].bedrooms > values[1])
								values[1] = this.database.homes[i].bedrooms
						}

						return values
					},
					minmaxsize: function () {
						var values = [0, 0]

						if (this.database.homes.length < 1)
							return values

						values[0] = this.database.homes[0].size;
						values[1] = values[0]

						for (var i = 1; i < this.database.homes.length; i++) {
							if (this.database.homes[i].size < values[0])
								values[0] = this.database.homes[i].size
							if (this.database.homes[i].size > values[1])
								values[1] = this.database.homes[i].size
						}

						return values
					},
					minmaxprice: function () {
						var values = [0, 0]

						if (this.database.homes.length < 1)
							return values

						values[0] = this.database.homes[0].price;
						values[1] = values[0]

						for (var i = 1; i < this.database.homes.length; i++) {
							if (this.database.homes[i].price < values[0])
								values[0] = this.database.homes[i].price
							if (this.database.homes[i].price > values[1])
								values[1] = this.database.homes[i].price
						}

						return values
					},
					filteredhomes: function () {
						var items = []

						if (this.database.homes.length > 0) {
							for (var i = 0; i < this.database.homes.length; i++) {
								if (this.database.homes[i].bedrooms >= this.bedrooms[0] && this.database.homes[i].bedrooms <= this.bedrooms[1]
									&& this.database.homes[i].size >= this.size[0] && this.database.homes[i].size <= this.size[1]
									&& this.database.homes[i].price >= this.price[0] && this.database.homes[i].price <= this.price[1])
									items.push (this.database.homes[i])
							}
						}

						return items
					}
				}
			});

			bedroomsfilter = $('#bedroomsFilter').slider({
				min: homes.minmaxbedrooms[0],
				max: homes.minmaxbedrooms[1],
				value: homes.minmaxbedrooms,
				step: 1
			})
				.on('slide', updateBedrooms)
				.data('slider');

			sizefilter = $('#sizeFilter').slider({
				min: homes.minmaxsize[0],
				max: homes.minmaxsize[1],
				value: homes.minmaxsize,
				step: 25
			})
				.on('slide', updateSize)
				.data('slider');

			pricefilter = $('#priceFilter').slider({
				min: homes.minmaxprice[0],
				max: homes.minmaxprice[1],
				value: homes.minmaxprice,
				step: 5000
			})
				.on('slide', updatePrice)
				.data('slider');

			homes.bedrooms = homes.minmaxbedrooms;
			homes.size = homes.minmaxsize;
			homes.price = homes.minmaxprice;
		}
	}

	http_request.open("GET", data_file, true);
	http_request.send();
}

function updateBedrooms() {
	homes.bedrooms = bedroomsfilter.getValue();
}

function updateSize() {
	homes.size = sizefilter.getValue();
}

function updatePrice() {
	homes.price = pricefilter.getValue();
}
