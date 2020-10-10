/*********************************************************************************
 * WEB422 – Assignment 2
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Clint Sheppard______ Student ID: 192292190_____ Date: October 8th, 2020
 * Heroku Link: https://clint-salesapi.herokuapp.com
 *
 ********************************************************************************/
var saleData = [];
var page = 1;
var perPage = 10;

var saleTemplateString = `
<% _.each(sales, function(sale){ %>
    <tr data-id="<%= sale._id %>">
    <td><%= sale.customer.email %></td>
    <td><%= sale.storeLocation %></td>
    <td><%= sale.items.length %></td>
    <td><%= moment.utc(sale.saleDate).local().format('LLLL') %>
    </td></tr>
<% }); %>`;

var modalString = `<h4>Customer</h4>
<strong>email:</strong> <%= sale.customer.email %><br>
<strong>age:</strong> <%= sale.customer.age %><br>
<strong>satisfaction:</strong> <%= sale.customer.satisfaction %> / 5
<br><br>
<h4> Items: $<%= sale.total %> </h4>
<table class="table">
<thead>
<tr>
<th>Product Name</th>
<th>Quantity</th>
<th>Price</th>
</tr>
</thead>
<tbody>
<% _.each(sale.items, function(item){ %>
    <tr>
    <td><%= item.name %></td>
    <td><%= item.quantity %></td>
    <td><%= item.price %></td>
    </tr>
<% }); %>
</tbody>
</table>`;

var saleModalBodyTemplate = _.template(modalString);

var saleTableTemplate = _.template(saleTemplateString);
var salesArray = [];

function loadSaleData() {
  fetch(`/api/sales/?page=${page}&perPage=${perPage}`)
    .then((response) => response.json())
    .then((sales) => {
      salesArray = sales;
      var tableData = saleTableTemplate({ sales: sales });
      $("tbody").html(tableData);
      $("#current-pg").html(page);
    })
    .catch((err) => {
      console.log(err);
    });
}

$(document).ready(function () {
  loadSaleData();
  $("table > tbody").on("click", "tr", function () {
    var clickedID = $(this).attr("data-id");
    var clickedSale = salesArray.find((sale) => sale._id == clickedID);
    clickedSale.total = 0;
    for (var i = 0; i < clickedSale.items.length; i++) {
      clickedSale.total +=
        clickedSale.items[i].price * clickedSale.items[i].quantity;
    }
    clickedSale.total = clickedSale.total.toFixed(2);
    // modal stuff here
    $("h4.modal-title").html(`Sale: ${clickedSale._id}`);
    var modalData = saleModalBodyTemplate({ sale: clickedSale });
    $("div.modal-body").html(modalData);
    $("div#sale-modal").modal({
      backdrop: false,
      keyboard: false,
    });
  });

  // paginate
  $("a#previous-pg").on("click", function () {
    page > 1 ? page-- : page;
    loadSaleData();
  });
  $("a#next-pg").on("click", function () {
    page++;
    loadSaleData();
  });
});
