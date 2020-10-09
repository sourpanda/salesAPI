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
    <tr data-id=\"<%= sale._id %>\">
    <td><%= sale.customer.email %></td>
    <td><%= sale.storeLocation %></td>
    <td><%= sale.items.length %></td>
    <td><%= moment.utc(sale.saleDate).local().format('LLLL') %>
    </td></tr>
<% }); %>`;

var modelString = `<h4>Customer</h4>
<strong>email:</strong> <%= sale.customer.email %><br>
<strong>age:</strong> <%= sale.customer.age %><br>
<strong>satisfaction:</strong> <%= sale.customer.satisfaction %> / 5
<br><br>
<h4> Items: <%= sale.items.length %> </h4>
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
    <td><%= sale.item.name %></td>
    <td><%= sale.item.price %></td>
    <td><%= sale.item.quantity %></td>
    </tr>
<% }); %>
</tbody>
</table>`;

var saleModelBodyTemplate = _.template(modelString);

var saleTableTemplate = _.template(saleTemplateString);

function loadSaleData() {
  fetch(`/api/sales/?page=${page}&perPage=${perPage}`)
    .then((response) => response.json())
    .then((sales) => {
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
});
